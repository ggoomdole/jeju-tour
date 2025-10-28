import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import SearchHeader from "@/components/common/header/search-header";
import Map from "@/components/common/map";
import { LOCATION } from "@/constants/location";
import { DEFAULT_MAP_CENTER } from "@/constants/map";
import { CoursePlaceProps } from "@/types/course";
import { TMap, TMapMarkerClickEvent, TMapPoi } from "@/types/tmap";
import { getParams } from "@/utils/params";
import { infoToast } from "@/utils/toast";

import { Search } from "lucide-react";

interface LocationProps {
  title: string;
  address: string;
  id: string;
  latitude: number;
  longitude: number;
}

interface FindByMapTabProps {
  query: string;
  tab: string;
  currentPlaces: CoursePlaceProps[];
  id?: string;
  view?: "private" | "duplicate";
  onSelectPlace: (place: CoursePlaceProps) => void;
}

const TMAP_API_KEY = process.env.NEXT_PUBLIC_TMAP_API_KEY;
const DEFAULT_THUMBNAIL = "/static/default-thumbnail.png";

export default function FindByMapTab({
  query,
  tab,
  currentPlaces,
  id,
  view,
  onSelectPlace,
}: FindByMapTabProps) {
  // 07/21 장소 검색 및 상세 조회에서 썸네일이 없기 때문에 우선 기본 썸네일 + 별점 X 버전으로 진행
  const [selectedMarker, setSelectedMarker] = useState<LocationProps | null>(null);
  const [searchResult, setSearchResult] = useState<TMapPoi[]>([]);
  const [isDragEnd, setIsDragEnd] = useState(false);

  const mapInstanceRef = useRef<TMap | null>(null);

  const pathname = usePathname();
  const buttonText = pathname.includes("upload") ? "추가하기" : "요청목록에 추가";

  const router = useRouter();

  const onClickMap = () => {
    setSelectedMarker(null);
  };

  const onClickMarker = (e: TMapMarkerClickEvent) => {
    const selectedPoi = searchResult.find((poi) => poi.id === e._marker_data.options.title);

    setSelectedMarker({
      title: selectedPoi?.name || "",
      address: selectedPoi?.newAddressList.newAddress[0].fullAddressRoad || "",
      id: selectedPoi?.id || "",
      latitude: Number(selectedPoi?.newAddressList.newAddress[0].frontLat) || 0,
      longitude: Number(selectedPoi?.newAddressList.newAddress[0].frontLon) || 0,
    });
  };

  const onAddNewPlace = () => {
    if (!selectedMarker) return;

    const isDuplicate = currentPlaces.some((place) => place.placeName === selectedMarker.title);

    if (isDuplicate) {
      return infoToast("이미 추가된 장소에요.");
    }

    onSelectPlace({
      placeName: selectedMarker.title,
      placeId: selectedMarker.id,
      reason: "",
      address: selectedMarker.address,
      latitude: selectedMarker.latitude,
      longitude: selectedMarker.longitude,
    });
    setSelectedMarker(null);

    const params = getParams({ id, view });
    router.replace(`?${params}`);
  };

  const fetchSearchResult = async () => {
    const center = mapInstanceRef.current?.getCenter();

    const params = getParams({
      searchKeyword: query,
      appKey: TMAP_API_KEY,
      version: 1,
      centerLon: center?.lng()?.toString() || DEFAULT_MAP_CENTER.lng,
      centerLat: center?.lat()?.toString() || DEFAULT_MAP_CENTER.lat,
    });

    const res = await fetch(`https://apis.openapi.sk.com/tmap/pois?${params}`, {
      next: {
        tags: [
          LOCATION.SEARCH,
          query,
          center?.lng()?.toString() || "",
          center?.lat()?.toString() || "",
        ],
      },
    });
    const data = await res.json();
    setSearchResult(data.searchPoiInfo.pois.poi);
    setIsDragEnd(false);
    if (data.searchPoiInfo.pois.poi.length > 0) {
      const { frontLat, frontLon } = data.searchPoiInfo.pois.poi[0].newAddressList.newAddress[0];
      mapInstanceRef.current?.setCenter(
        new window.Tmapv3.LatLng(Number(frontLat), Number(frontLon))
      );
    }
  };

  useEffect(() => {
    if (!query) return;

    fetchSearchResult();
  }, [query]);

  return (
    <>
      <SearchHeader id={id} word={query} tab={tab} view={view} onSearch={fetchSearchResult} />
      <main className="relative">
        <Map
          mapInstanceRef={mapInstanceRef}
          markers={searchResult}
          onClickMap={onClickMap}
          onClickMarker={onClickMarker}
          onDragEnd={() => setIsDragEnd(true)}
          selectedMarkerId={selectedMarker?.id}
        />
        {isDragEnd && (
          <button
            className="bg-main-900 typo-medium absolute left-1/2 top-5 flex w-max -translate-x-1/2 items-center gap-2.5 rounded-full border-2 px-3 py-1 text-white"
            onClick={fetchSearchResult}
          >
            <Search className="size-4" />
            재검색
          </button>
        )}
        {selectedMarker && (
          <section className="max-w-floating-button absolute bottom-5 left-1/2 flex w-[calc(100%-2.5rem)] -translate-x-1/2 gap-5 rounded-2xl bg-white p-5 shadow-2xl">
            <Image
              src={DEFAULT_THUMBNAIL}
              alt={`${selectedMarker.title}-thumbnail`}
              width={100}
              height={125}
              className="aspect-thumbnail rounded-2xl object-cover"
            />
            <div className="flex flex-col justify-center gap-1">
              <h2 className="typo-semibold line-clamp-1">{selectedMarker.title}</h2>
              <p className="typo-regular line-clamp-1 text-gray-500">{selectedMarker.address}</p>
              <button
                className="bg-main-300 typo-regular w-max rounded-xl px-5 py-1 text-gray-500"
                onClick={onAddNewPlace}
                aria-label="요청목록에 추가"
              >
                {buttonText}
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
