import { LOCATION } from "@/constants/location";
import LocationsPage from "@/page/locations/[id]";
import { getCookie } from "@/utils/cookie";

interface LocationPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tab: string;
  }>;
}

const TMAP_API_KEY = process.env.NEXT_PUBLIC_TMAP_API_KEY;

export default async function Locations({ params, searchParams }: LocationPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;

  const res = await fetch(
    `https://apis.openapi.sk.com/tmap/pois/${id}?findOption=id&version=1&appKey=${TMAP_API_KEY}`,
    { next: { tags: [LOCATION.DETAIL, id] } }
  );
  const data = await res.json();
  const currentUserId = await getCookie("userId");

  return <LocationsPage id={id} tab={tab} data={data} currentUserId={currentUserId ?? null} />;
}
