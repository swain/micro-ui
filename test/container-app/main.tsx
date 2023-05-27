import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { loadMicroUIApp } from '../../src';

const ChildApp: React.FC = () => {
  const navigate = useNavigate();

  const query = useQuery(['app'], () =>
    loadMicroUIApp({
      name: 'test-app',
      host: process.env.CHILD_APP_HOST!,
    }),
  );

  if (!query.data) {
    return <div>Loading child app...</div>;
  }

  const app = query.data;

  const routes = (
    <>
      <div>child app header</div>
      <Routes>
        {Object.entries(app.routes).map(([path, { Component }]) => (
          <Route key={path} path={path} Component={Component} />
        ))}
      </Routes>
    </>
  );

  if (app.Provider) {
    return <app.Provider routing={{ push: navigate }}>{routes}</app.Provider>;
  }

  return routes;
};

const client = new QueryClient();

export const Container: React.FC = () => {
  return (
    <QueryClientProvider client={client}>
      <div>
        <div>Container App Header</div>
        <BrowserRouter>
          <ChildApp />
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
};
