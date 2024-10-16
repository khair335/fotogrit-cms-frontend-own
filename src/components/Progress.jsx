import React from 'react';

const Progress = (props) => {
  const {
    value,
    label,
    background = 'black',
    size = 'small',
    hideValue = false,
    hideLabel = false,
  } = props;

  const progressBarSize =
    size == 'small'
      ? 'h-3.5 text-[0.5rem]'
      : size == 'medium'
      ? 'h-5 text-xs'
      : size == 'large'
      ? 'h-7 text-sm'
      : 'h-3 text-[0.5rem]';

  const labelSize =
    size == 'small'
      ? 'text-xs'
      : size == 'medium'
      ? 'text-sm'
      : size == 'large'
      ? 'text-base'
      : 'text-xs';

  const progressBarValue = Number(value);
  return (
    <div>
      <label className={`text-gray-500 ${labelSize}`}>
        {!hideLabel && label}
      </label>
      <div className={`w-full ${progressBarSize} rounded-xl bg-[#D9D9D9]`}>
        <div
          className={`flex items-center font-medium bg__progress-${background} px-2 rounded-xl h-full text-white break-keep`}
          style={{ width: `${progressBarValue}%` }}
        >
          {!hideValue && `${value}%`}
        </div>
      </div>
    </div>
  );
};

export default Progress;
