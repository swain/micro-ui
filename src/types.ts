import React from 'react';

declare global {
  interface Window {
    microui: {
      apps: Record<string, MicroUIAppRegistration>;
    };
  }
}

export type MicroUIAppProviderProps = {
  /**
   * Routing utilities for performing navigation.
   */
  routing: { push: (path: string) => void };
  children?: React.ReactNode;
};

export type MicroUIAppRegistration = {
  name: string;
  Provider?: React.ComponentType<MicroUIAppProviderProps>;
  routes: Record<string, { Component: React.ComponentType<{}> }>;
};
