import Loading from '@/components/common/Loading';
import PageNotFoundView from '@/components/common/PageNotFoundView';
import MainLayout from '@/layouts/Layout';
import Home from '@/pages/Home';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
const Layout = () => (
  <Suspense fallback={<Loading />}>
    <MainLayout />
  </Suspense>
);

//懒加载
const Test = lazy(() => import('@/components/test/index'));
const Profile = lazy(() => import('@/pages/Profile'));

const Routes: RouteObject[] = [];

const mainRoutes = {
  path: '/',
  element: <Layout />,
  children: [
    { path: '*', element: <PageNotFoundView /> },
    { path: '/profile', element: <Profile /> },
    { path: '/', element: <Home /> },
    { path: '404', element: <PageNotFoundView /> },
  ],
};

const DemoRoutes = {
  path: 'yideng',
  element: <Layout />,
  children: [{ path: 'test', element: <Test /> }],
};

Routes.push(mainRoutes, DemoRoutes);

export default Routes;