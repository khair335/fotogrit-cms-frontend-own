import { SkeletonTable } from '.';

const SkeletonTab = () => {
  return (
    <>
      <div className="w-full h-14 bg-gray-200 animate-pulse mb-5" />

      <div className="py-2 px-4">
        <SkeletonTable />
      </div>
    </>
  );
};

export default SkeletonTab;
