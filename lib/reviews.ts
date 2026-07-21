// 방문자 실제 후기.
// ✏️ 실제 후기가 생기면 아래 배열에 한 개씩 추가하세요. 추가하는 즉시 공간 페이지에 표시됩니다.
//    비어 있으면 후기 섹션 자체가 숨겨집니다.
//
// 형식 예시 (실제 후기로만 채울 것 — 허위 후기는 표시광고법 위반 소지):
// {
//   name: '김*진',            // 이름 일부 가리기 추천
//   source: '네이버 리뷰',     // 네이버 리뷰 / 인스타 DM / 방문 후기 등
//   text: '조용해서 두 시간이 금방 갔어요. 생각 정리하러 또 올 것 같아요.',
// }

export interface Review {
  name: string
  source: string
  text: string
}

export const REVIEWS: Review[] = []
