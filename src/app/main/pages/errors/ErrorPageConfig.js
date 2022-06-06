import { lazy } from 'react';

const ErrorPageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/404',
      component: lazy(() => import('./Error404Page')),
    },
    {
      path: '/500',
      component: lazy(() => import('./Error500Page')),
    },
  ],
};

export default ErrorPageConfig;
