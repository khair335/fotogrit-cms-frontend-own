import React from 'react';

const CardItem = (props) => {
  const { label, text, icon, backgroundColor } = props;
  return (
    <div
      className={`w-full h-24 p-3 flex justify-between items-center bg-gray-200 rounded-lg ${backgroundColor}`}
    >
      <div className="">
        <p className="text-gray-100 text-xs font-light">{label}</p>
        <h3 className="text-white font-bold text-xl">{text}</h3>
      </div>

      <div className="h-16 w-16 bg-white/10 rounded-full p-2">
        <div className="h-full w-full bg-white/50 rounded-full grid place-items-center text-white text-2xl">
          {icon || <FaFileInvoiceDollar />}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
