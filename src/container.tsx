import React, { useEffect } from 'react';
import { MicroUIAppRegistration } from './types';

export type UseRemoteMicroUIAppOptions = {
  name: string;
  host: string;
};

export type UseRemoteMicroUIAppReturnValue =
  | { status: 'loading' }
  | { status: 'success'; config: MicroUIAppRegistration };

const getManifest = (host: string) =>
  fetch(`${host}/micro-manifest.json`).then((res) => res.json());

export const useRemoteMicroUIApp = ({
  name,
  host,
}: UseRemoteMicroUIAppOptions): UseRemoteMicroUIAppReturnValue => {
  const scriptId = `micro-ui-script-${name}`;

  const [state, setState] = React.useState<UseRemoteMicroUIAppReturnValue>({
    status: 'loading',
  });

  // TODO: use react-query to ensure we don't re-run this if the hook
  // is called multiple times.

  useEffect(() => {
    getManifest(host).then((manifest) => {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = manifest.bundle;
      script.onload = () => {
        setState({ status: 'success', config: window.microui.apps[name] });
      };
      document.head.appendChild(script);
    });
  }, []);

  return state;
};
