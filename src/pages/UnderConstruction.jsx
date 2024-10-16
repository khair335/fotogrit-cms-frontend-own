import { Card } from '@/components/Card';

const UnderConstruction = () => {
  return (
    <>
      <Card className="p-4">
        <div className="relative flex items-center justify-center w-full h-full max-w-6xl px-6 mx-auto overflow-hidden sm:px-0">
          <div className="relative z-30 flex flex-col sm:flex-row sm:items-center sm:justify-center">
            <div className="flex flex-col items-center justify-center w-full ">
              <div className="w-28 h-28 transform scale-x-[-1]">
                <img
                  src="/images/under-maintenance.gif"
                  alt="under construction"
                  className="object-cover w-full h-full "
                />
              </div>

              <h1 className="text-3xl sm:text-4xl text-blue-950">
                <span className="font-bold">THIS PAGE</span> IS
              </h1>
              <h1 className="mb-2 text-lg font-medium uppercase sm:text-4xl text-blue-950 sm:mb-6">
                Under Construction
              </h1>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default UnderConstruction;
