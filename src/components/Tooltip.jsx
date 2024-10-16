import React, { useState } from 'react';

const Tooltip = ({ text, children, position, disabled }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const getTooltipPosition = () => {
    switch (position) {
      case 'top':
        return 'tooltip__top';
      case 'right':
        return 'tooltip__right';
      case 'bottom':
        return 'tooltip__bottom';
      case 'left':
        return 'tooltip__left';
      default:
        return 'tooltip__top';
    }
  };

  const getArrowPosition = () => {
    switch (position) {
      case 'top':
        return 'tooltip__arrow-bottom';
      case 'right':
        return 'tooltip__arrow-left';
      case 'bottom':
        return 'tooltip__arrow-top';
      case 'left':
        return 'tooltip__arrow-right';
      default:
        return 'tooltip__arrow-top';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className="group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {isTooltipVisible && !disabled && (
        <div
          className={`absolute ${getTooltipPosition()} px-2 py-1 bg-gray-700 shadow-inner text-white rounded-md whitespace-nowrap text-[10px] z-50`}
        >
          <div className={`tooltip__arrow bg-gray-700 ${getArrowPosition()}`} />
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
