import { MicroUIAppRegistration } from './types';

export const registerMicroUIApp = (config: MicroUIAppRegistration) => {
  if (!window.microui) {
    window.microui = { apps: {} };
  }

  // TODO: wrap the "providers" using withBaseMicroUIAppProvider
  window.microui.apps[config.name] = config;
};
