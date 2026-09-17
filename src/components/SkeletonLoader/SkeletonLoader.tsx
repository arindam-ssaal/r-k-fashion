
import classNames from "classnames";

function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div
      className={classNames(
        "animate-pulse bg-gray-300 rounded-md",
        className
      )}
    ></div>
  )
}

export default SkeletonLoader