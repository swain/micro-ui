declare global {
  interface Window {
    microui: Record<string, MicroUIConfig>;
  }
}

export type MicroUIConfig = {
  renderAtElement: (id: string) => void;
  unmountAtElement: (id: string) => void;
};
