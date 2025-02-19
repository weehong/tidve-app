import classNames from "classnames";

export default function Skeleton({
  className,
}: {
  className?: string;
}): React.ReactNode {
  return (
    <div
      className={classNames(
        "h-4 w-4 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700",
        className,
      )}
    />
  );
}
