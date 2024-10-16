import { lazy, Suspense } from 'react';

const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFormAppSetting = lazy(() =>
  import('@/components/others-app-setting/FormAppSetting')
);

import { Card } from '@/components/Card';
import { SkeletonAppSetting, SkeletonBreadcrumb } from '@/components/Skeleton';

const OthersAppSetting = () => {
  const breadcrumbItems = [
    { label: 'Settings', url: '#' },
    { label: 'App Setting' },
  ];

  return (
    <>
      <Card className="p-4 px-6">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="App Setting" items={breadcrumbItems} />
        </Suspense>

        <section className="mt-6">
          <Suspense fallback={<SkeletonAppSetting />}>
            <LazyFormAppSetting />
          </Suspense>
        </section>
      </Card>
    </>
  );
};

export default OthersAppSetting;
