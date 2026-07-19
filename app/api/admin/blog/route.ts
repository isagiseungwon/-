import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { buildPrompt, templateGenerate, BlogRequest } from '@/lib/blogGen'

// AI 생성은 시간이 걸리므로 함수 실행 시간 상한을 늘린다 (Vercel)
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!isValidSession(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = (await req.json()) as Partial<BlogRequest>
  if (!body.keyword || !body.topic) {
    return NextResponse.json(
      { error: '키워드와 주제는 필수입니다.' },
      { status: 400 }
    )
  }

  const blogReq: BlogRequest = {
    keyword: body.keyword,
    topic: body.topic,
    type: body.type ?? '정보형',
    photos: Array.isArray(body.photos) ? body.photos.filter(Boolean) : [],
    extra: body.extra,
  }

  // API 키가 없으면 무료 템플릿 모드로 폴백
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      mode: 'template',
      note: 'AI 키(ANTHROPIC_API_KEY)를 설정하면 훨씬 자연스러운 글이 생성됩니다.',
      content: templateGenerate(blogReq),
    })
  }

  const { system, user } = buildPrompt(blogReq)
  const client = new Anthropic()
  // 기본은 최고 품질 모델. 응답이 느리거나 비용을 낮추려면
  // Vercel 환경변수 BLOG_MODEL=claude-haiku-4-5 로 교체 가능.
  const model = process.env.BLOG_MODEL || 'claude-opus-4-8'

  try {
    const response = await client.messages.create({
      model,
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      system,
      messages: [{ role: 'user', content: user }],
    })

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')

    if (!text) {
      return NextResponse.json(
        { error: '생성 결과가 비어 있습니다. 다시 시도해주세요.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ mode: 'ai', model, content: text })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: 'AI 키가 올바르지 않습니다. ANTHROPIC_API_KEY를 확인해주세요.' },
        { status: 500 }
      )
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: '요청이 많아요. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      )
    }
    if (error instanceof Anthropic.APIError) {
      console.error('[blog] Claude API 오류:', error.status, error.message)
      return NextResponse.json(
        { error: 'AI 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 }
      )
    }
    console.error('[blog] 알 수 없는 오류:', error)
    return NextResponse.json(
      { error: '글 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
