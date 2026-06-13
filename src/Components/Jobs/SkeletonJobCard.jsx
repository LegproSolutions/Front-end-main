const SkeletonJobCard = () => {
  return (
    <div className="border border-gray-200 p-4 shadow-sm rounded-lg transition-all duration-300 hover:shadow-lg bg-white flex flex-col h-full min-h-[300px]">
      {/* Company Logo & Title */}
      <div className="flex justify-between w-full items-start mb-3">
        <div className="flex items-center">
          <div className="h-14 w-14 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden animate-pulse"></div>
          <div className="ml-3 flex flex-col gap-2 animate-pulse w-48">
            <div className="h-4 w-3/4 rounded-full bg-gray-200"></div>
            <div className="h-3 w-1/2 rounded-full bg-gray-100"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 my-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="rounded-full h-4 w-4 bg-gray-200"></div>
            <div className="h-3 w-20 rounded-full bg-gray-100"></div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-6 animate-pulse">
        <div className="h-3 w-full rounded-full bg-gray-100"></div>
        <div className="h-3 w-full rounded-full bg-gray-100"></div>
        <div className="h-3 w-2/3 rounded-full bg-gray-100"></div>
      </div>

      <div className="mt-auto pt-4 flex gap-3 animate-pulse">
        <div className="h-10 flex-1 rounded-lg bg-gray-200"></div>
        <div className="h-10 flex-1 rounded-lg bg-gray-100"></div>
      </div>
    </div>
  );
};

export default SkeletonJobCard;
