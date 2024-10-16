import { Suspense, lazy, useEffect, useState } from 'react';

import { SkeletonContent, SkeletonNavbar, SkeletonSidebar } from './Skeleton';

const LazySidebar = lazy(() => import('./Sidebar'));
const LazyNavbar = lazy(() => import('./Navbar'));
const LazyContent = lazy(() => import('./Content'));

const Layout = ({ children }) => {
  const storedState = localStorage.getItem('ft-SO');
  const [activeSidebar, setActiveSidebar] = useState(storedState === 'true');

  //choose the screen size
  const handleMobileResponsive = () => {
    if (window.innerWidth <= 820) {
      setActiveSidebar(false);
    } else {
      setActiveSidebar(true);
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener('resize', handleMobileResponsive);

    // handleMobileResponsive();
  }, []);

  useEffect(() => {
    localStorage.setItem('ft-SO', activeSidebar.toString());
  }, [activeSidebar]);

  return (
    <div className="flex ">
      <Suspense fallback={<SkeletonSidebar active={activeSidebar} />}>
        <LazySidebar active={activeSidebar} />
      </Suspense>

      <div
        className={`w-full ${
          activeSidebar ? 'pl-[240px]' : 'pl-[64px]'
        } transition-all duration-300`}
      >
        <div className="relative">
          <Suspense fallback={<SkeletonNavbar />}>
            <LazyNavbar
              activeSidebar={activeSidebar}
              setActiveSidebar={setActiveSidebar}
            />
          </Suspense>

          <Suspense fallback={<SkeletonContent children={children} />}>
            <LazyContent children={children} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Layout;
