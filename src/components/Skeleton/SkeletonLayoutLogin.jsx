const SkeletonLayoutLogin = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen py-8 bg-gray-100">
      <div className="w-[80%] md:w-[400px] lg:w-[370px]">
        <div className="w-[160px] md:w-[250px] lg:w-[150px] mx-auto mb-2 md:mb-6 bg-gray-300 h-[110px] md:h-[200px] lg:h-[110px] rounded-xl"></div>

        <div className="w-full h-full bg-gray-200 rounded-[20px] p-6 mt-6">
          <div className="flex flex-col gap-4">
            <div className="w-[30%] bg-gray-300 h-8 mx-auto rounded-xl" />

            <div className="flex flex-col gap-2">
              <div className="w-[30%] bg-gray-300 h-6 rounded-xl" />
              <div className="w-full bg-gray-300 h-10 rounded-xl" />
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-[30%] bg-gray-300 h-6 rounded-xl" />
              <div className="w-full bg-gray-300 h-10 rounded-xl" />
            </div>

            <div className="w-[50%] bg-gray-300 h-4 rounded-xl mt-2" />

            <div className="w-full bg-gray-300 h-10 rounded-xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLayoutLogin;
