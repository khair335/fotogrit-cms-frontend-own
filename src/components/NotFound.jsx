import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="w-full h-screen overflow-hidden fixed inset-0 z-100 flex justify-center items-center">
      <div className="bg__img-camera  w-full h-full absolute inset-0 z-0" />
      <div className="bg-black/80 blur-lg  w-full h-full absolute inset-0 z-0" />

      <div className="z-30 flex flex-col gap-4 items-center justify-center">
        <h1 className="font-bold text-7xl text-white">404</h1>
        <h3 className="font-medium text-gray-200 text-3xl">
          Oh no... We lost this page.
        </h3>
        <div className="text-gray-300 text-center">
          <p className="">
            We searched everywhere but couldn&#39;t find what you&#39;re looking
            for.
          </p>
          <p>Let&#39;s find a better place for you to go.</p>
        </div>
        <Link
          to="/"
          className="py-2 px-6 bg-gray-400 hover:bg-gray-500  hover:text-white font-medium rounded-lg transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
