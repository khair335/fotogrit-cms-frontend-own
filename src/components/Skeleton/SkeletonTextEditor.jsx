const SkeletonTextEditor = () => {
  return (
    <>
      <div className="flex gap-3 mb-1">
        <div className="w-[15%] h-9 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[12%] h-9 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[12%] h-9 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[15%] h-9 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[15%] h-9 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-[5%] h-9 bg-gray-200 animate-pulse rounded-md" />
      </div>
      <div className="w-full h-[260px] bg-gray-200 animate-pulse rounded-md"></div>
    </>
  );
};

export default SkeletonTextEditor;
