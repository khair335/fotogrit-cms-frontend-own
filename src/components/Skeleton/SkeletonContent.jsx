const SkeletonContent = ({ children }) => {
  return (
    <div className="p-[22px] pt-[90px] bg-white w-full h-screen overflow-hidden">
      <div className="bg-gray-100 animate-pulse rounded-lg w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default SkeletonContent;
