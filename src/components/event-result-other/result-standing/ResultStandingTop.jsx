import React from 'react';
import { RoundedImage } from '@/components';

const ResultStandingTop = ({ children }) => {
  return (
    <div className="flex flex-col gap-3 p-3 shadow-xl border-2 border-ftbrown rounded-xl sm:flex-row sm:flex-wrap sm:justify-between">
      {children}
    </div>
  );
};

const ResultStandingTopCategory = (props) => {
  const { category, name, img } = props;
  return (
    <div className="flex flex-row items-center justify-around gap-3 overflow-auto sm:justify-start sm:min-w-[200px]">
      <div>
        {/* <img
          src={img}
          alt="Result Standing Top"
          className="min-w-[4rem] min-h-[4rem] w-16 h-16 object-cover rounded-full"
        /> */}
        <RoundedImage
          src={img}
          size="small"
          alt="Result Standing Top"
          className="min-w-[4rem] min-h-[4rem]"
        />
      </div>

      <div className="w-1/3 sm:w-full">
        <h1 className="text-md uppercase">{category}</h1>
        <p className="text-sm font-bold capitalize">{name}</p>
      </div>
    </div>
  );
};

export { ResultStandingTop, ResultStandingTopCategory };
