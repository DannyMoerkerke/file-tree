
let handler;

export const onOutsideClick = (element, callback) => {
  handler = e => {
    const [target] = e.composedPath();

    if(target !== element && target.compareDocumentPosition(element) !== 10) {
      callback();
    }
  };

  document.body.addEventListener('click', handler);
};

export const removeOutsideClick = () => {
  if(handler) {
    document.body.removeEventListener('click', handler);
  }
};
