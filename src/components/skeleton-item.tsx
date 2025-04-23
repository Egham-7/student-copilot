import { cn } from "@/lib/utils";

interface SkeletonItemProps {
  count?: number;
  className?: string;
}

export function SkeletonItem({ count = 3, className }: SkeletonItemProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center w-full p-4 space-x-4 animate-pulse",
            className,
          )}
        >
          <div className="w-4 h-4 rounded-full bg-muted" />
          <div className="h-4 bg-muted rounded flex-1" />
        </div>
      ))}
    </>
  );
}
