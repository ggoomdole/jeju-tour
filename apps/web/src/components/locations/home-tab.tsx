"use client";

import Clock from "@/assets/clock.svg";
import MapPin from "@/assets/map-pin.svg";
import Phone from "@/assets/phone.svg";
import { cn } from "@/lib/utils";
import { GetDetailPOIDTO } from "@/models/tmap";
import { errorToast, successToast } from "@/utils/toast";

interface HomeTabProps {
  data: GetDetailPOIDTO;
}

const getOperatingHours = (str: string): string[] | null => {
  const operatingHours = str.split("[").filter((a) => a.includes("영업시간"))[0];
  if (!operatingHours) return null;
  return operatingHours.split("]")[1].split(";").filter(Boolean);
};

const isOperating = (
  operatingHours: string[]
): "영업 중" | "브레이크 타임" | "영업 종료" | "휴무일" => {
  const now = new Date();
  const currentDay = new Intl.DateTimeFormat("ko-kr", { weekday: "short" }).format(now);
  const currentTime = now.getHours() * 60 + now.getMinutes(); // 분 단위로 변환

  // 현재 요일에 해당하는 영업시간 찾기
  let todayHours: string | null = null;

  // 매일 영업시간 확인
  const everyDayHours = operatingHours.find((hour) => hour.includes("매일"));
  if (everyDayHours) {
    todayHours = everyDayHours;
  } else {
    // 요일별 영업시간 확인
    const dayHours = operatingHours.find((hour) => hour.includes(currentDay));
    if (dayHours) {
      todayHours = dayHours;
    }
  }

  if (!todayHours) {
    return "휴무일";
  }

  // 영업시간 파싱
  const timeMatch = todayHours.match(/(\d{1,2}):(\d{2})~(\d{1,2}):(\d{2})/);
  if (!timeMatch) {
    return "영업 종료";
  }

  const startHour = parseInt(timeMatch[1]);
  const startMinute = parseInt(timeMatch[2]);
  const endHour = parseInt(timeMatch[3]);
  const endMinute = parseInt(timeMatch[4]);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  // 브레이크 타임 확인
  const breakTimeHours = operatingHours.find((hour) => hour.includes("브레이크타임"));
  if (breakTimeHours) {
    const breakMatch = breakTimeHours.match(/(\d{1,2}):(\d{2})~(\d{1,2}):(\d{2})/);
    if (breakMatch) {
      const breakStartHour = parseInt(breakMatch[1]);
      const breakStartMinute = parseInt(breakMatch[2]);
      const breakEndHour = parseInt(breakMatch[3]);
      const breakEndMinute = parseInt(breakMatch[4]);

      const breakStartTime = breakStartHour * 60 + breakStartMinute;
      const breakEndTime = breakEndHour * 60 + breakEndMinute;

      if (currentTime >= breakStartTime && currentTime <= breakEndTime) {
        return "브레이크 타임";
      }
    }
  }

  // 라스트오더 확인
  const lastOrderHours = operatingHours.find((hour) => hour.includes("라스트오더"));
  if (lastOrderHours) {
    const lastOrderMatch = lastOrderHours.match(/(\d{1,2}):(\d{2})/);
    if (lastOrderMatch) {
      const lastOrderHour = parseInt(lastOrderMatch[1]);
      const lastOrderMinute = parseInt(lastOrderMatch[2]);
      const lastOrderTime = lastOrderHour * 60 + lastOrderMinute;

      if (currentTime > lastOrderTime) {
        return "영업 종료";
      }
    }
  }

  // 영업시간 내인지 확인
  if (currentTime >= startTime && currentTime <= endTime) {
    return "영업 중";
  }

  return "영업 종료";
};

const getOperatingStatusColor = (status: "영업 중" | "브레이크 타임" | "영업 종료" | "휴무일") => {
  switch (status) {
    case "영업 중":
      return "text-green-700";
    case "브레이크 타임":
      return "text-orange-700";
    case "영업 종료":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

export default function HomeTab({ data }: HomeTabProps) {
  const onCopy = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();

    const defaultSuccess = () => successToast("복사에 성공했어요.");
    const defaultFailure = () => errorToast("복사에 실패했어요.");

    navigator.clipboard.writeText(text).then(defaultSuccess).catch(defaultFailure);
  };

  const operatingHours = getOperatingHours(data.poiDetailInfo.additionalInfo);

  return (
    <section className="typo-regular space-y-2.5 px-5 py-2.5">
      <div className="flex items-center gap-2.5">
        <MapPin className="size-5" />
        <div className="flex gap-1">
          <p>{data.poiDetailInfo.bldAddr || "정보가 없어요."}</p>
          {data.poiDetailInfo.bldAddr && (
            <button
              className="text-gray-500 underline"
              onClick={(e) => onCopy(e, data.poiDetailInfo.bldAddr)}
            >
              복사
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Phone className="size-5" />
        <div className="flex gap-1">
          <p>{data.poiDetailInfo.tel || "정보가 없어요."}</p>
          {data.poiDetailInfo.tel && (
            <button
              className="text-gray-500 underline"
              onClick={(e) => onCopy(e, data.poiDetailInfo.tel)}
            >
              복사
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-2.5">
        <Clock className="size-5" />
        <div className="mt-px flex gap-1">
          {operatingHours ? (
            <>
              <p
                className={cn("font-medium", getOperatingStatusColor(isOperating(operatingHours)))}
              >
                {isOperating(operatingHours)}
              </p>
              <p className="whitespace-pre-line">{operatingHours.join("\n")}</p>
            </>
          ) : (
            <p>정보가 없어요.</p>
          )}
        </div>
      </div>
    </section>
  );
}
