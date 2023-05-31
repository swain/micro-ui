A _tiny_ framework for building micro frontend apps using React.

The source code has zero dependencies, and is less than 100 lines of code.

## Micro Frontends

To understand the micro-frontend architecture pattern in general, [read this article](https://martinfowler.com/articles/micro-frontends.html).

### Terms

We'll use these terms to talk about the various components of a micro-frotend system:

- _container app_ - this is a "shell" SPA that loads + renders many micro-frontends. Think of it as "a nav bar + a micro-frontend loader".

- _child app_ - a smaller SPA that is loaded by a container app

## The Rules

This framework requires that you stick to a few key rules:

1. Everything is React. We don't support multiple frameworks.

2. A "deployed" child app should consist of a _single_ JavaScript bundle, and a _single_ JSON manifest file (child apps may not ship raw CSS or HTML). Manifest files look like this:

```json
{
  "name": "my-child-app",
  "version": "1.0.0",
  "bundleURL": "https://my-child-app.com/index.js"
}
```

3. Child apps should _not_ include `react` or `react-dom` in their deployed bundles, and should instead rely on the container app to provide these dependencies via [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).

## Usage

### Child App

A child app should be defined by a single JavaScript entrypoint. That entrypoint should be declared using `registerMicroUIApp`.

```tsx
// child-app.tsx
import { registerMicroUIApp } from '@swain-test/micro-ui';
import { SomeProvider } from './SomeProvider';

registerMicroUIApp({
  // This name should match the name in the manifest.
  name: 'my-child-app',
  // A map of URL routes that the child is responsible for.
  routes: {
    '/child-app': {
      // Each route should map to a single React component.
      Component: () => {
        return <div>Base Route</div>;
      },
    },
    // Match using typically path part syntax.
    '/child-app/:id': {
      Component: () => {
        return <div>By Id Route</div>;
      },
    },
    }
  },
  // Optionally specify a Provider component that will be wrapped around all of
  // the provided routes.
  Provider: SomeProvider,
});
```

The child app must also deploy a `micro-manifest.json` file that describes the app. This file should be served from the same domain as the child app's JavaScript bundle. The naming of the bundle file is not important, since the manifest file is used to determine the bundle URL.

An example structure:

```
https://my-child-app.com/latest/
  micro-manifest.json
  bundle.js
```

```json
{
  "name": "my-child-app",
  "version": "1.0.0",
  "bundleURL": "https://my-child-app.com/latest/bundle.js"
}
```

### Container App

Container apps are responsible for:

- Loading child apps at the appropriate time, using `loadMicroUIApp`.
- Managing the current route.
- Displaying the correct route at the correct time, between child apps.

This is a simple example of orchestrating the loading of a micro-ui child app, and using `react-router-dom` to manage routes.

```tsx
// container.tsx
import React from 'react';
import { Routes, useNavigate } from 'react-router-dom';
import { loadMicroUIApp } from '@swain-test/micro-ui';

export const MyChildApp: React.FC = () => {
  const navigate = useNavigate();
  const [app, setApp] = React.useState(undefined);

  // Load the child app bundle.
  React.useEffect(() => {
    loadMicroUIApp({
      name: 'my-child-app',
      host: 'https://my-child-app.com/latest',
    }).then((app) => {
      setApp(app);
    });
  }, []);

  if (!app) {
    return <div>Loading child app...</div>;
  }

  // Render the child app's routes, using the Provider + your desired routing framework.
  return (
    <app.Provider
      // This gives the child app a way to change the route.
      routing={{ push: navigate }}
    >
      <Routes>
        {Object.entries(app.routes).map(([path, { Component }]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
    </app.Provider>
  );
};
```
