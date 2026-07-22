import { NextRequest, NextResponse } from 'next/server'
import { isValidSession, ADMIN_COOKIE } from '@/lib/auth'
import { listBlogDrafts, saveBlogDraft, deleteBlogDraft } from '@/lib/db'

function authed(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const drafts = await listBlogDrafts()
  return NextResponse.json({ drafts })
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id, title, keyword, content } = await req.json()
  if (!content) {
    return NextResponse.json({ error: '내용이 비어 있습니다.' }, { status: 400 })
  }
  const draft = {
    id: id || `draft_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title:
      title ||
      content
        .split('\n')
        .map((l: string) => l.trim())
        .filter(Boolean)[0]
        ?.slice(0, 60) ||
      '제목 없는 초안',
    keyword: keyword || '',
    content,
    createdAt: new Date().toISOString(),
  }
  try {
    await saveBlogDraft(draft)
    return NextResponse.json({ draft })
  } catch (e) {
    console.error('[drafts] 저장 실패:', e)
    return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id가 필요합니다.' }, { status: 400 })
  const ok = await deleteBlogDraft(id)
  return NextResponse.json({ success: ok })
}
