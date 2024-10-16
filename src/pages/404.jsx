import { lazy, Suspense } from 'react';
const LazyNotFound = lazy(() => import('@/components/NotFound'));

const NotFoundPage = () => {
  return (
    <Suspense
      fallback={<div className="w-full h-full bg-gray-200 rounded-lg" />}
    >
      <LazyNotFound />
    </Suspense>
  );
};

export default NotFoundPage;
