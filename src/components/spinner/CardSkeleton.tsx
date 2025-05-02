import Skeleton from "@/components/spinner/Skeleton";

export default function CardSkeleton(): React.ReactNode {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="my-2 h-9 w-full" />
    </div>
  );
}
