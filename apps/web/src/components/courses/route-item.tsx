import Bus from "@/assets/bus.svg";
import Subway from "@/assets/subway.svg";
import Walk from "@/assets/walk.svg";
import type { TMapTransitMode, TMapTransitResponse } from "@/types/tmap";
import { formatDistance, formatTime } from "@/utils/time";

const getIcon = (mode: string, color: string) => {
  switch (mode) {
    case "WALK":
      return (
        <Walk
          className="size-8 shrink-0 rounded-full border p-1"
          style={{
            borderColor: color,
            color,
          }}
        />
      );
    case "BUS":
      return (
        <Bus
          className="size-8 shrink-0 rounded-full border p-1"
          style={{
            borderColor: color,
            color,
          }}
        />
      );
    case "SUBWAY":
      return (
        <Subway
          className="size-8 shrink-0 rounded-full border p-1"
          style={{
            borderColor: color,
            color,
          }}
        />
      );
    default:
      return (
        <Walk
          className="size-8 shrink-0 rounded-full border p-1"
          style={{
            borderColor: color,
            color,
          }}
        />
      );
  }
};

const getStationName = (stationName: string, mode: TMapTransitMode) => {
  if (mode === "SUBWAY") {
    return `${stationName}역`;
  }
  return stationName;
};

const getRouteInfo = (
  leg: TMapTransitResponse["metaData"]["plan"]["itineraries"][0]["legs"][0],
  isFirst: boolean,
  isLast: boolean,
  startName?: string,
  endName?: string
) => {
  if (leg.mode === "WALK") {
    return (
      <div className="space-y-1">
        <div className="typo-medium line-clamp-1">
          {isFirst ? startName || leg.start.name : leg.start.name}
        </div>
        <div className="typo-regular text-gray-500">
          도보 {formatDistance(leg.distance)} ({formatTime(leg.sectionTime)})
        </div>
        <div className="typo-medium line-clamp-1">{isLast ? endName : leg.end.name}</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <span className="typo-medium line-clamp-1">
        {isFirst
          ? startName || getStationName(leg.start.name, leg.mode)
          : getStationName(leg.start.name, leg.mode)}{" "}
        승차
      </span>
      <div className="space-y-1">
        {leg.passStopList?.stationList.slice(1, -1).map((lane) => (
          <div key={`${lane.stationID}-${lane.stationName}`} className="typo-regular text-gray-700">
            {getStationName(lane.stationName, leg.mode)}
          </div>
        ))}
      </div>
      <div className="typo-regular text-gray-500">
        {leg.passStopList?.stationList.length}개 정류장 이동 ({formatTime(leg.sectionTime)})
      </div>
      <span className="typo-medium line-clamp-1">
        {isLast ? endName : getStationName(leg.end.name, leg.mode)} 하차
      </span>
    </div>
  );
};

export default function RouteItem({
  leg,
  isLast,
  isFirst,
  startName,
  endName,
}: {
  leg: TMapTransitResponse["metaData"]["plan"]["itineraries"][0]["legs"][0];
  isLast: boolean;
  isFirst: boolean;
  startName?: string;
  endName?: string;
}) {
  const color = leg?.routeColor ? `#${leg.routeColor}` : "#808080";

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        {getIcon(leg.mode, color)}
        {!isLast && <div className="h-full w-0.5" style={{ backgroundColor: color }} />}
      </div>
      <div className="flex-1 py-1">{getRouteInfo(leg, isFirst, isLast, startName, endName)}</div>
    </div>
  );
}
