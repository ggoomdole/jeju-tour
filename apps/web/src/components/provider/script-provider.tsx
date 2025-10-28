/* eslint-disable @next/next/no-sync-scripts */

const TMAP_API_KEY = process.env.NEXT_PUBLIC_TMAP_API_KEY;

export default function ScriptProvider() {
  return (
    // 동기적 로드가 필요하기 때문에 Script 컴포넌트 사용 불가
    <script src={`https://apis.openapi.sk.com/tmap/vectorjs?version=1&appKey=${TMAP_API_KEY}`} />
  );
}
