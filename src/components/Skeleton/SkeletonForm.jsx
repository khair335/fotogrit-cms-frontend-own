const SkeletonForm = ({ rows = 4, cols = 4 }) => {
  let colsTable = [];
  let rowsTable = [];

  for (let i = 0; i < cols; i++) {
    colsTable.push(
      <div
        key={`col-${i}`}
        className="w-full h-9 bg-gray-200 animate-pulse rounded-lg"
      />
    );
  }

  for (let i = 0; i < rows; i++) {
    rowsTable.push(
      <div key={`row-${i}`} className={`grid grid-cols-${cols} gap-4`}>
        {colsTable}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 pt-2 pb-6">
      {rowsTable}

      <div className="flex gap-4 justify-end items-center mt-2">
        <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-32 h-10 bg-gray-200 animate-pulse rounded-md" />
      </div>
    </div>
  );
};

export default SkeletonForm;
