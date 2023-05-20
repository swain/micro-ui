import React, { useEffect, useRef } from 'react';

export type RemoteAppProps = {
  name: string;
  getBundleURL: () => Promise<string>;
};

export const RemoteApp: React.FC<RemoteAppProps> = ({ name, getBundleURL }) => {
  const elementId = `micro-ui-root-${name}`;
  const scriptId = `micro-ui-script-${name}`;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't add the script until the root element is available.
    if (!ref.current) {
      return;
    }

    getBundleURL().then((bundleURL) => {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = bundleURL;
      script.onload = () => {
        window.microui[name].renderAtElement(elementId);
      };
      document.head.appendChild(script);
    });
  }, [ref.current]);

  return <div ref={ref} id={elementId} />;
};
