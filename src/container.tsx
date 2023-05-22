import { MicroUIAppRegistration } from './types';

export type MicroUIAppManifest = {
  name: string;
  version: string;
  bundleURL: string;
};

export const fetchManifest = (host: string): Promise<MicroUIAppManifest> =>
  fetch(`${host}/micro-manifest.json`).then((res) => res.json());

export type LoadMicroUIAppParams = {
  name: string;
  host: string;
};

/**
 * Loads a micro-ui app from a remote host.
 */
export const loadMicroUIApp = async ({ name, host }: LoadMicroUIAppParams) => {
  const scriptId = `micro-ui-script-${name}`;

  const manifest = await fetchManifest(host);

  if (document.getElementById(scriptId)) {
    throw new Error(
      'Attempting to load a micro-ui app that is already loaded. This is not supported.',
    );
  }

  if (manifest.name !== name) {
    throw new Error(
      'The host manifest file does not match the specified app name.',
    );
  }

  return new Promise<MicroUIAppRegistration>((resolve) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.onload = () => {
      resolve(window.microui.apps[manifest.name]);
    };
    script.src = manifest.bundleURL;
    document.head.appendChild(script);
  });
};
