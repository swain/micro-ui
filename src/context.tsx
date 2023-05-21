import React from 'react';
import { MicroUIAppProviderProps } from './types';

const BaseContext = React.createContext<
  Pick<MicroUIAppProviderProps, 'routing'> | undefined
>(undefined);

const MicroAppProvider: React.FC<MicroUIAppProviderProps> = ({
  routing,
  children,
}) => {
  const value = React.useMemo(() => ({ routing }), [routing]);
  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>;
};

export const withBaseMicroUIAppProvider =
  (Provider: React.ComponentType<MicroUIAppProviderProps>) =>
  ({ children, ...props }: MicroUIAppProviderProps) =>
    (
      <MicroAppProvider {...props}>
        <Provider {...props}>{children}</Provider>
      </MicroAppProvider>
    );

export const useMicroAppContext = () => {
  const context = React.useContext(BaseContext);
  if (!context) {
    throw new Error(
      'useMicroAppContext must be used within a MicroAppProvider',
    );
  }
  return context;
};
