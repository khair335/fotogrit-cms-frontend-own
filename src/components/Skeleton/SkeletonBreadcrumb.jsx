const SkeletonBreadcrumb = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-md" />
      <div className="w-60 h-4 bg-gray-200 animate-pulse rounded-md" />
    </div>
  );
};

export default SkeletonBreadcrumb;
