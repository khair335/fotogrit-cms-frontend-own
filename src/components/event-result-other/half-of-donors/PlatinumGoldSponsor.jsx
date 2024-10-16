import React from 'react';
import { RoundedImage } from '@/components';

const PlatinumGoldSponsor = (props) => {
  const { platinum, gold } = props;

  return (
    <div className="flex flex-col gap-5 p-3 shadow-xl rounded-xl h-fit overflow-x-auto lg:basis-[60%] lg:gap-8">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-sm font-bold text-center sm:text-xl">
          PLATINUM SPONSOR
        </h1>

        {platinum.map((platinumSponsor) => (
          <div key={platinumSponsor.id}>
            <RoundedImage
              src={platinumSponsor?.img}
              size="medium"
              alt="Platinum sponsor"
              className="min-w-[2rem] min-h-[2rem] sm:w-48 sm:h-48 lg:w-60 lg:h-60"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-sm font-bold text-center sm:text-xl">
          GOLD SPONSOR
        </h1>

        <div className="flex flex-wrap justify-center gap-3 w-full sm:justify-evenly sm:gap-2">
          {gold.map((goldSponsor) => (
            <div key={goldSponsor.id}>
              <RoundedImage
                src={goldSponsor?.img}
                size="small"
                alt="Gold sponsor"
                className="sm:w-20 sm:h-20"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatinumGoldSponsor;
