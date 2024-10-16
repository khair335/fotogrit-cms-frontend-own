import React, { useEffect, useState } from 'react';

const Tabs = ({ children, defaultActiveTab, setDefaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabActive = (index) => {
    setActiveTab(index);
    setDefaultActiveTab(index);
  };

  return (
    <>
      <div className="flex pt-1 bg-ftgreen-700 h-[50px] sm:justify-center items-center w-full overflow-x-auto">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const { label } = child.props;
          return (
            <div
              key={index}
              className={`${
                activeTab === index ? 'font-bold text-black' : 'text-white '
              } text-[16px] cursor-pointer px-3 h-full w-full flex justify-center items-center  transition-opacity duration-500 relative`}
              onClick={() => handleTabActive(index)}
            >
              {index === activeTab && (
                <img
                  src="/images/union-tabs-2.png"
                  alt="bg tabs header"
                  className="absolute bottom-0 w-full h-full"
                />
              )}
              <span className="z-10 text-center text-[0.5rem] sm:text-xs md:text-sm lg:text-base px-2">
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return (
          <div key={index} hidden={activeTab !== index} className="p-3">
            {child.props.children}
          </div>
        );
      })}
    </>
  );
};

const Tab = ({ children }) => {
  return <>{children}</>;
};

const TabPanel = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab, TabPanel };
