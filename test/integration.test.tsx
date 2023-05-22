import React from 'react';
import { build } from 'esbuild';
import fs from 'fs';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { render } from '@testing-library/react';
import { Container } from './container-app/main';

// Let's build + "deploy" the child app.
const server = setupServer();
beforeAll(async () => {
  const CHILD_APP_HOST = 'http://localhost:3000/child-app';
  process.env.CHILD_APP_HOST = CHILD_APP_HOST;

  const CHILD_APP_DIR = `${__dirname}/child-app`;
  // Bundle the child app.
  await build({
    entryPoints: [`${CHILD_APP_DIR}/main.tsx`],
    bundle: true,
    outfile: `${CHILD_APP_DIR}/dist/bundle.js`,
  });

  // Now, use MSW to mock the bundle + manifest file.
  server.use(
    rest.get(`${CHILD_APP_HOST}/bundle.js`, (req, res, ctx) => {
      console.log('received req', req);
      return res(
        ctx.status(200),
        ctx.delay(100), // Simulate a slower network connection
        ctx.body(fs.readFileSync(`${CHILD_APP_DIR}/dist/bundle.js`)),
      );
    }),
    rest.get(`${CHILD_APP_HOST}/micro-manifest.json`, (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          name: 'test-app',
          version: '1.0.0',
          bundle: `${CHILD_APP_HOST}/bundle.js`,
        }),
      ),
    ),
  );

  server.listen({ onUnhandledRequest: 'error' });
  return () => server.close();
});

test('integration', async () => {
  const page = render(<Container />);

  await page.findByText('Container App Header');

  await page.findByText('Loading child app...');

  await page.findByText('child app header');
});
