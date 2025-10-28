"use client";

import Star from "@/assets/star.svg";
import StarOutline from "@/assets/star-outline.svg";

interface RegisterStarRatingProps {
  rating: number;
  className?: string;
  onRatingChange: (rating: number) => void;
}

export default function RegisterStarRating({
  rating,
  className,
  onRatingChange,
}: RegisterStarRatingProps) {
  const fullStars = Math.floor(rating);
  const outlineStars = 5 - fullStars;

  const onStarClick = (e: React.MouseEvent, starIndex: number) => {
    e.stopPropagation();
    onRatingChange(starIndex + 1);
  };

  return (
    <div className="flex">
      {/* 완전한 별들 */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <button
          key={`full-${index}`}
          type="button"
          onClick={(e) => onStarClick(e, index)}
          aria-label={`${index + 1}점`}
        >
          <Star className={className} />
        </button>
      ))}

      {/* 빈 별들 */}
      {Array.from({ length: outlineStars }).map((_, index) => {
        const starIndex = fullStars + index;
        return (
          <button
            key={`outline-${index}`}
            type="button"
            onClick={(e) => onStarClick(e, starIndex)}
            aria-label={`${starIndex + 1}점`}
          >
            <StarOutline className={className} />
          </button>
        );
      })}
    </div>
  );
}
