const SkeletonNavbar = () => {
  return (
    <div className="bg-gray-200 animate-pulse rounded-br-lg py-4 px-4 absolute top-0 w-full z-60">
      <div className="flex justify-between">
        <div className="w-10 h-10 bg-gray-300 animate-pulse rounded-lg" />
        <div className="w-60 h-10 bg-gray-300 animate-pulse rounded-lg" />
      </div>
    </div>
  );
};

export default SkeletonNavbar;
