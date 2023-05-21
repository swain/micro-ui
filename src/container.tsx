import React, { useEffect } from 'react';
import { MicroUIAppRegistration } from './types';

export type UseRemoteAppOptions = {
  name: string;
  // TODO: Consider simplifying this to "host", and get opinionated about the
  // location of the manifest file.
  getBundleURL: () => Promise<string>;
};

export type UseRemoteAppReturnValue =
  | { status: 'loading' }
  | { status: 'success'; config: MicroUIAppRegistration };

export const useRemoteApp = ({
  name,
  getBundleURL,
}: UseRemoteAppOptions): UseRemoteAppReturnValue => {
  const scriptId = `micro-ui-script-${name}`;

  const [state, setState] = React.useState<UseRemoteAppReturnValue>({
    status: 'loading',
  });

  // TODO: use react-query to ensure we don't re-run this if the hook
  // is called multiple times.

  useEffect(() => {
    getBundleURL().then((bundleURL) => {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = bundleURL;
      script.onload = () => {
        setState({ status: 'success', config: window.microui.apps[name] });
      };
      document.head.appendChild(script);
    });
  }, []);

  return state;
};
