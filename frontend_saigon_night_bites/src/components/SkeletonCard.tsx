function SkeletonItem() {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
      <div className="h-40 skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-5 skeleton rounded-lg w-3/4" />
        <div className="flex gap-3">
          <div className="h-4 skeleton rounded-full w-16" />
          <div className="h-4 skeleton rounded-full w-12" />
        </div>
        <div className="h-3 skeleton rounded-md w-full" />
        <div className="h-9 skeleton rounded-xl w-full mt-2" />
      </div>
    </div>
  )
}

export const SkeletonCard = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </>
  )
}
