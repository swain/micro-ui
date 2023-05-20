export type AppRegistrationConfig = {
  name: string;
  renderAtElement: (id: string) => void;
  unmountAtElement: (id: string) => void;
};

export const registerApp = ({
  name,
  renderAtElement,
  unmountAtElement,
}: AppRegistrationConfig) => {
  if (!window.microui) {
    window.microui = {};
  }

  window.microui[name] = { renderAtElement, unmountAtElement };
};
