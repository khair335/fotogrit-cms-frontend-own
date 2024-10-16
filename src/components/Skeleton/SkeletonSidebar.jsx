const SkeletonSidebar = ({ active }) => {
  const numberOfMenu = 9;
  const menus = [];

  if (active) {
    for (let i = 0; i < numberOfMenu; i++) {
      menus.push(
        <div
          key={i}
          className="w-[90%] h-10 bg-gray-300 animate-pulse rounded-md"
        />
      );
    }
  } else {
    for (let i = 0; i < numberOfMenu; i++) {
      menus.push(
        <div
          key={i}
          className="w-[76%] h-10 bg-gray-300 animate-pulse rounded-md"
        />
      );
    }
  }

  return (
    <div
      className={`${
        active ? 'w-[240px]' : 'w-16'
      } bg-gray-200 animate-pulse rounded-br-lg h-screen fixed top-0 left-0 z-70`}
    >
      <div className="flex flex-col gap-2 justify-center items-center">
        <div
          className={`${
            active ? 'w-36 h-28' : 'w-10 h-10'
          }  bg-gray-300 animate-pulse mt-10 mb-8 rounded-md`}
        />

        {menus}
      </div>
    </div>
  );
};

export default SkeletonSidebar;
