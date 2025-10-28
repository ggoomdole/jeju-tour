import Star from "@/assets/star.svg";
import StarHalf from "@/assets/star-half.svg";
import StarOutline from "@/assets/star-outline.svg";

interface StarRatingProps {
  rating: number;
  className?: string;
}

export default function StarRating({ rating, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const outlineStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {/* 완전한 별들 */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className={className} />
      ))}

      {/* 반별 */}
      {hasHalfStar && <StarHalf key="half" className={className} />}

      {/* 빈 별들 */}
      {Array.from({ length: outlineStars }).map((_, index) => (
        <StarOutline key={`outline-${index}`} className={className} />
      ))}
    </div>
  );
}
