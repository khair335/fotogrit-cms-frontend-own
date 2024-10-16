import { lazy, Suspense } from 'react';
const LazyStreamContabo = lazy(() => import('@/components/StreamContabo'));

const StreamContaboPage = () => {
  return (
    <Suspense
      fallback={<div className="w-full h-full bg-gray-200 rounded-lg" />}
    >
      <LazyStreamContabo />
    </Suspense>
  );
};

export default StreamContaboPage;
