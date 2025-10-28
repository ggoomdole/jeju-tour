import Image from "next/image";
import Link from "next/link";

import { SpotReviewDTO } from "@repo/types";

import AverageStarRating from "../star/average-star-rating";

const DEFAULT_THUMBNAIL = "/static/default-thumbnail.png";

export default function LocationCard({
  avgReview,
  introSpot,
  name,
  numReview,
  number,
  spotId,
}: SpotReviewDTO) {
  return (
    <Link
      href={`/locations/${spotId}`}
      className="flex items-center gap-2.5 border-b border-b-gray-100 px-1 py-2.5"
    >
      <div className="relative">
        <Image
          src={DEFAULT_THUMBNAIL}
          alt={`${name}-thumbnail`}
          width={80}
          height={80}
          className="aspect-square rounded-sm object-cover"
        />
        {numReview && (
          <p className="typo-medium typo-regular bg-main-900 absolute -left-2.5 -top-2.5 flex size-5 items-center justify-center rounded-full text-white">
            {number}
          </p>
        )}
      </div>
      <div>
        <h2 className="typo-semibold line-clamp-1">{name}</h2>
        <AverageStarRating rating={Number(avgReview)} participants={Number(numReview)} />
        <p className="typo-medium line-clamp-1">{introSpot}</p>
      </div>
    </Link>
  );
}
