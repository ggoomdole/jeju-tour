import Image from "next/image";

interface NearbyTouristSpotItemProps {
  title: string;
  image: string;
  address: string;
  rating: number;
  onRouteToLocation: () => void;
  disabled: boolean;
}

const DEFAULT_IMAGE = "/static/default-thumbnail.png";

export default function NearbyTouristSpotItem({
  title,
  image,
  address,
  onRouteToLocation,
  disabled,
}: NearbyTouristSpotItemProps) {
  return (
    <button
      onClick={onRouteToLocation}
      className="flex w-max max-w-40 shrink-0 flex-col overflow-hidden rounded-sm text-start shadow-lg"
      disabled={disabled}
    >
      <Image
        src={image || DEFAULT_IMAGE}
        alt={title}
        width={160}
        height={160}
        className="aspect-square object-cover"
      />
      <div className="h-full space-y-0.5 bg-white p-1">
        <p className="typo-medium truncate">{title}</p>
        <p className="typo-regular">{address}</p>
      </div>
    </button>
  );
}
