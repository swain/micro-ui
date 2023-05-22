import { withBaseMicroUIAppProvider } from './context';
import { MicroUIAppRegistration } from './types';

export const registerMicroUIApp = (config: MicroUIAppRegistration) => {
  if (!window.microui) {
    window.microui = { apps: {} };
  }

  window.microui.apps[config.name] = {
    ...config,
    Provider: withBaseMicroUIAppProvider(config.Provider),
  };
};
