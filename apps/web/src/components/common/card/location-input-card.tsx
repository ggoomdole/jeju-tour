import Close from "@/assets/close.svg";

interface LocationInputCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeName: string;
  onRemove?: () => void;
}

// value에 reason 넣기
export default function LocationInputCard({
  placeName,
  onRemove,
  ...props
}: LocationInputCardProps) {
  return (
    <div className="shadow-layout flex w-full justify-between gap-2.5 rounded-xl p-2.5">
      <div className="w-full">
        <p className="typo-medium line-clamp-1">{placeName}</p>
        <input className="typo-regular w-full" {...props} />
      </div>
      {onRemove && (
        <button onClick={onRemove} aria-label={`${placeName} 삭제`}>
          <Close />
        </button>
      )}
    </div>
  );
}
