import React from 'react';

const ErrorFetchingData = ({ error }) => {
  return (
    <>
      <div className="py-8 text-center text-gray-500">
        <p className="">Oops Sorry!</p>
        <p className="">There is an error, try refreshing the page again.</p>
        {error && <p className="capitalize">{error?.message}</p>}
      </div>
    </>
  );
};

const NoDataMessage = ({ title, col = 1 }) => {
  const messages = Array?.from({ length: col }, (_, index) => (
    <div key={index} className="text-center space-y-1">
      <h3 className="font-bold text-gray-500 text-lg">No Data Available</h3>
      <p className="text-gray-400 text-sm font-light">
        Unfortunately, we couldn't find any data for{' '}
        <span className="font-medium text-gray-600">{title}</span> at this time.
        <br />
        Please refine your search criteria or try again later.
      </p>
    </div>
  ));

  return (
    <div
      className="h-full w-full grid place-items-center py-10"
      style={{
        gridTemplateColumns: `repeat(${col}, 1fr)`,
      }}
    >
      {messages}
    </div>
  );
};

export { ErrorFetchingData, NoDataMessage };
