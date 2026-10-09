export default function Loading() {
  return (
    <div className="container-x animate-pulse py-20 lg:py-24" role="status" aria-label="Loading">
      <div className="bg-elevated h-4 w-24 rounded" />
      <div className="bg-elevated mt-5 h-12 w-72 rounded" />
      <div className="bg-elevated mt-5 h-6 w-96 max-w-full rounded" />
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-elevated h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
