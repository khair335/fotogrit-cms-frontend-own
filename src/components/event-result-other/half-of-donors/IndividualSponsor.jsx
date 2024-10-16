import React from 'react';
import { RoundedImage } from '@/components';

const IndividualSponsor = (props) => {
  const { individual } = props;

  return (
    <div className="flex justify-center p-5 lg:w-[40%]">
      <div className="flex flex-col items-center justify-between gap-3 w-full px-5 py-3 shadow-xl rounded-md overflow-x-auto lg:max-h-80">
        <h1 className="text-xs font-bold text-center break-keep sm:text-base">
          INDIVIDUAL SPONSORS/DONORS
        </h1>

        <div className="flex flex-wrap justify-center sm:justify-between lg:gap-5 lg:grid lg:grid-cols-3">
          {individual.map((individualSponsor) => (
            <div
              className="flex flex-col items-center w-20"
              key={individualSponsor.id}
            >
              <RoundedImage
                src={individualSponsor?.img}
                size="small"
                alt="Individual Sponsor"
                className="sm:w-16 sm:h-16"
              />
              <div className="text-center max-w-[6rem] break-keep">
                <h1 className="text-lg font-bold capitalize">
                  {individualSponsor.name}
                </h1>
                <p className="text-xs">"{individualSponsor.desc}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualSponsor;
