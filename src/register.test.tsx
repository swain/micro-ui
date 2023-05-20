import { registerApp } from './register';

test('registerApp', () => {
  registerApp({
    name: 'test',
    renderAtElement: (element) => console.log('mounting', element.id),
    unmountAtElement: (element) => console.log('unmounting', element.id),
  });

  const element = document.createElement('div');

  window.microui.test.renderAtElement(element);
  window.microui.test.unmountAtElement(element);
});
