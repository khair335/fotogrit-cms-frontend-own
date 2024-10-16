import React from 'react';
import { FaShirt } from 'react-icons/fa6';
import { RoundedImage } from '@/components';

const PlayerList = (props) => {
  const { data } = props;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:grid-cols-4">
      {data.map((playerData) => (
        <div
          className={`flex flex-col justify-center items-center gap-7 border-2 border-ftbrown rounded-md px-3 pt-5 pb-9 overflow-x-auto overflow-y-hidden sm:flex-row sm:flex-nowrap sm:justify-start sm:gap-3 sm:h-32 ${
            playerData?.isCaptain ? 'order-1' : 'order-2'
          }`}
          key={playerData?.id}
        >
          <div className="relative w-fit h-fit">
            {playerData?.isCaptain && (
              <div className="absolute -top-1 -left-2 bg-ftbrown px-1.5 rounded-md">
                <p className="font-bold text-base text-[#FFFFFF]">C</p>
              </div>
            )}

            <RoundedImage
              src={playerData?.img}
              size="small"
              alt="Player Picture"
              className="min-w-[4rem] min-h-[4rem]"
            />

            <div className="absolute top-[83%] left-1/2 -translate-x-1/2 ">
              <div className="relative w-fit">
                <FaShirt className="text-4xl text-[#A17F58]" />
                <p className="absolute text-white text-xs font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {playerData?.jerseyNumber.toString().length == 1
                    ? `0${playerData?.jerseyNumber}`
                    : playerData?.jerseyNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col break-keep w-[70%] items-center text-center sm:items-start sm:text-left">
            <h1 className="text-base font-bold uppercase sm:text-sm">
              {playerData?.playerName}
            </h1>
            <p className="text-sm opacity-50 sm:text-xs">
              Age {playerData?.age}, KU {playerData?.ku}
            </p>

            <p className="text-sm font-semibold capitalize mt-2 sm:text-xs">
              {playerData?.role}
            </p>
          </div>
        </div>
      ))}
    </div>

    // <div className="flex flex-wrap justify-between gap-3">
    //   {data.map((playerData) => (
    //     <div
    //       className={`flex flex-wrap justify-center items-center grow gap-6 px-3 pb-7 pt-3 w-full overflow-x-scroll border-2 border-ftbrown rounded-md sm:gap-3 sm:flex-nowrap sm:justify-start sm:w-[48%] sm:h-28 sm:overflow-hidden lg:w-[24%] ${
    //         playerData.isCaptain ? 'order-1' : 'order-2'
    //       }`}
    //       key={playerData.id}
    //     >
    //       <div className="relative w-fit h-fit">
    //         {playerData?.isCaptain && (
    //           <div className="absolute -top-1 -left-2 bg-ftbrown px-1.5 rounded-md">
    //             <p className="font-bold text-base text-[#FFFFFF]">C</p>
    //           </div>
    //         )}

    //         {/* <img
    //           src={playerData?.img}
    //           alt="Player Picture"
    //           className="min-w-[4rem] min-h-[4rem] w-16 h-16 rounded-full object-cover"
    //         /> */}
    //         <RoundedImage
    //           src={playerData?.img}
    //           size="small"
    //           alt="Player Picture"
    //           className="min-w-[4rem] min-h-[4rem]"
    //         />

    //         <div className="absolute top-[83%] left-1/2 -translate-x-1/2 ">
    //           <div className="relative w-fit">
    //             <FaShirt className="text-4xl text-[#A17F58]" />
    //             <p className="absolute text-white text-xs font-semibold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    //               {playerData?.jerseyNumber.toString().length == 1
    //                 ? `0${playerData?.jerseyNumber}`
    //                 : playerData?.jerseyNumber}
    //             </p>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="flex flex-col w-[55%]">
    //         <h1 className="text-sm font-bold uppercase">
    //           {playerData?.playerName}
    //         </h1>
    //         <p className="text-xs opacity-50">
    //           Age {playerData?.age}, KU {playerData?.ku}
    //         </p>

    //         <p className="text-xs font-semibold break-normal capitalize mt-2">
    //           {playerData?.role}
    //         </p>
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default PlayerList;
