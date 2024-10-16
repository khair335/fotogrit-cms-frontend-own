import { SkeletonTextEditor } from '.';

const SkeletonAppSetting = () => {
  return (
    <>
      <SkeletonTextEditor />

      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-[60%] mt-4">
        <div className="bg-gray-200 h-40 w-full rounded-xl animate-pulse" />
        <div className="bg-gray-200 h-40 w-full rounded-xl animate-pulse" />
      </div>
    </>
  );
};

export default SkeletonAppSetting;
