import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Swipe = (props) => {
  const { children, currentSection, setCurrentSection, data } = props;

  const handleDecrement = () => {
    if (currentSection == 1) {
      setCurrentSection(currentSection);
    } else {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleIncrement = () => {
    if (currentSection == data.length) {
      setCurrentSection(currentSection);
    } else {
      setCurrentSection(currentSection + 1);
    }
  };
  return (
    <div className="flex justify-center items-center gap-3">
      <FaChevronLeft
        className="text-3xl sm:text-5xl cursor-pointer"
        onClick={handleDecrement}
      />

      <div className="w-2/5 max-h-44">{children}</div>

      <FaChevronRight
        className="text-3xl sm:text-5xl cursor-pointer"
        onClick={handleIncrement}
      />
    </div>
  );
};

export default Swipe;
