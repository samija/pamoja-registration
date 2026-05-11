export default function AdminLoading() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-pamoja-border/50 rounded w-48" />
        <div className="h-4 bg-pamoja-border/30 rounded w-72" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white rounded-xl shadow-sm" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-xl shadow-sm" />
          <div className="h-64 bg-white rounded-xl shadow-sm" />
        </div>
      </div>
    </div>
  );
}
