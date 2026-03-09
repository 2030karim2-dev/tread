import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md';
}

export function StarRating({ rating, maxRating = 5, onRate, size = 'sm' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => (
        <button
          key={i}
          onClick={() => onRate?.(i + 1)}
          disabled={!onRate}
          className={`${onRate ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`${sizeClass} ${i < rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`}
          />
        </button>
      ))}
    </div>
  );
}
