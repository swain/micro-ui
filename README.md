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

2. A "deployed" child app should consist of a _single_ JavaScript bundle, and a _single_ JSON manifest file (child apps should not ship raw CSS or HTML). Manifest files look like this:

```json
{
  "name": "my-child-app",
  "version": "1.0.0",
  "bundle": "https://my-child-app.com/index.js"
}
```

3. Child apps should _not_ include `react` or `react-dom` in their deployed bundles, and should instead rely on the container app to provide these dependencies via `window.React` and `window.ReactDOM`.

<!--
  TODO: consider using import maps to minimize the need for child apps to process out the imports of react + react-dom

  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap
-->
