import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useRemoteMicroUIApp } from '../../src';

const ChildApp: React.FC = () => {
  const navigate = useNavigate();

  const app = useRemoteMicroUIApp({
    name: 'test-app',
    host: process.env.CHILD_APP_HOST!,
  });

  if (app.status === 'loading') {
    return <div>Loading child app...</div>;
  }

  const routes = (
    <>
      <div>child app header</div>
      <Routes>
        {Object.entries(app.config.routes).map(([path, { Component }]) => (
          <Route key={path} path={path} Component={Component} />
        ))}
      </Routes>
    </>
  );

  if (app.config.Provider) {
    return (
      <app.config.Provider routing={{ push: navigate }}>
        {routes}
      </app.config.Provider>
    );
  }

  return routes;
};

export const Container: React.FC = () => {
  return (
    <div>
      <div>Container App Header</div>
      <BrowserRouter>
        <ChildApp />
      </BrowserRouter>
    </div>
  );
};
