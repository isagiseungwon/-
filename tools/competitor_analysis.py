"""네이버 검색 API로 경쟁 글을 모아서 패턴을 분석한다.

사용법 (PowerShell):
    $env:NAVER_CLIENT_ID="발급받은ID"
    $env:NAVER_CLIENT_SECRET="발급받은SECRET"
    python tools/competitor_analysis.py "쌍문 스터디카페" "쌍문역 무인 스터디카페"

결과는 reports/ 폴더에 마크다운 파일로 저장된다. 키는 파일에 적지 않는다.
"""
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime
from pathlib import Path

API = "https://openapi.naver.com/v1/search/{kind}.json"
STOPWORDS = {
    "스터디카페", "스터디", "카페", "후기", "추천", "있는", "하는", "에서", "으로",
    "그리고", "입니다", "합니다", "정말", "너무", "오늘", "이용", "및", "the",
}
CLICK_PATTERNS = {
    "숫자 포함": r"\d",
    "후기/리뷰": r"후기|리뷰",
    "가격/요금": r"가격|요금|비용|할인",
    "추천/순위": r"추천|TOP|순위|best|BEST",
    "무인/24시": r"무인|24시",
    "질문형": r"\?|까요|나요",
}


def strip_tags(text):
    return html.unescape(re.sub(r"<[^>]+>", "", text))


def call_api(kind, query, display=100, start=1, sort="sim"):
    client_id = os.environ.get("NAVER_CLIENT_ID")
    client_secret = os.environ.get("NAVER_CLIENT_SECRET")
    if not client_id or not client_secret:
        sys.exit("NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수를 먼저 설정하세요. (tools/README.md 참고)")
    params = urllib.parse.urlencode(
        {"query": query, "display": display, "start": start, "sort": sort}
    )
    req = urllib.request.Request(API.format(kind=kind) + "?" + params)
    req.add_header("X-Naver-Client-Id", client_id)
    req.add_header("X-Naver-Client-Secret", client_secret)
    with urllib.request.urlopen(req, timeout=15) as res:
        return json.loads(res.read().decode("utf-8"))


def tokens(title):
    words = re.findall(r"[가-힣A-Za-z0-9]{2,}", title)
    return [w for w in words if w not in STOPWORDS]


def analyze(items):
    titles = [strip_tags(i["title"]) for i in items]
    words = Counter(w for t in titles for w in tokens(t))
    bloggers = Counter(i.get("bloggername", "") for i in items)
    patterns = {
        name: sum(1 for t in titles if re.search(p, t)) for name, p in CLICK_PATTERNS.items()
    }
    lengths = [len(t) for t in titles] or [0]
    dates = sorted(i.get("postdate", "") for i in items if i.get("postdate"))
    return {
        "count": len(titles),
        "avg_len": sum(lengths) / len(lengths),
        "top_words": words.most_common(15),
        "top_bloggers": [b for b in bloggers.most_common(5) if b[0]],
        "patterns": patterns,
        "newest": dates[-1] if dates else "",
        "oldest": dates[0] if dates else "",
        "samples": titles[:10],
    }


def render(query, result):
    n = max(result["count"], 1)
    lines = [f"## 검색어: {query}", f"- 수집한 글: {result['count']}개 (글 제목 평균 {result['avg_len']:.0f}자)"]
    lines.append(f"- 글 날짜 범위: {result['oldest']} ~ {result['newest']}")
    lines.append("\n### 제목에 자주 나오는 단어")
    lines += [f"- {w} ({c}회)" for w, c in result["top_words"]]
    lines.append("\n### 제목 패턴 (비율)")
    lines += [f"- {k}: {v}개 ({v * 100 // n}%)" for k, v in result["patterns"].items()]
    lines.append("\n### 자주 보이는 블로거")
    lines += [f"- {b} ({c}편)" for b, c in result["top_bloggers"]] or ["- 없음"]
    lines.append("\n### 상위 제목 예시")
    lines += [f"{i}. {t}" for i, t in enumerate(result["samples"], 1)]
    return "\n".join(lines)


def main(queries):
    if not queries:
        sys.exit('검색어를 하나 이상 넣으세요. 예: python tools/competitor_analysis.py "쌍문 스터디카페"')
    sections = []
    for q in queries:
        data = call_api("blog", q)
        sections.append(render(q, analyze(data.get("items", []))))
    out_dir = Path(__file__).resolve().parent.parent / "reports"
    out_dir.mkdir(exist_ok=True)
    path = out_dir / f"competitor-{datetime.now():%Y%m%d-%H%M}.md"
    path.write_text("# 경쟁 글 분석\n\n" + "\n\n".join(sections) + "\n", encoding="utf-8")
    print(f"저장 완료: {path}")


if __name__ == "__main__":
    main(sys.argv[1:])
