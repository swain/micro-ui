import React from 'react';
import { registerMicroUIApp } from '../../src';
import { useMicroAppContext } from '../../src/context';

registerMicroUIApp({
  name: 'test-app',
  routes: {
    '/': {
      Component: () => {
        const { routing } = useMicroAppContext();
        return (
          <div>
            <div>child app root</div>
            <button onClick={() => routing.push('/test-app/something')}>
              go to by id route
            </button>
            <button onClick={() => routing.push('/')}>exit child app</button>
          </div>
        );
      },
    },
    '/:id': {
      Component: () => {
        const { routing } = useMicroAppContext();
        return (
          <div>
            <div>child app by id</div>
            <button onClick={() => routing.push('/test-app')}>
              go to root of child app
            </button>
            <button onClick={() => routing.push('/')}>exit child app</button>
          </div>
        );
      },
    },
  },
});
