import Star from "@/assets/star.svg";

interface AverageStarRatingProps {
  rating: number;
  participants?: number;
}

export default function AverageStarRating({ rating, participants }: AverageStarRatingProps) {
  return (
    <div className="typo-regular flex items-center gap-1 text-gray-500">
      <Star className="size-3.5" />
      <p>
        {rating} (<span>{participants || 0}개</span>)
      </p>
    </div>
  );
}
