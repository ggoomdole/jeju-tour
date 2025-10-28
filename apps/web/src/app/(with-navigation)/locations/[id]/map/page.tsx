import { notFound } from "next/navigation";

import LocationMapPage from "@/page/locations/[id]/map";

interface LocationMapPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    lat: string;
    lng: string;
  }>;
}

export default async function LocationMap({ params, searchParams }: LocationMapPageProps) {
  const { id } = await params;
  const { lat, lng } = await searchParams;

  if (!lat || !lng) {
    return notFound();
  }

  return <LocationMapPage id={id} lat={lat} lng={lng} />;
}
