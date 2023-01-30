
const span = (cssClass: string) => {
  const elem = document.createElement('span');
  elem.classList.add(cssClass);
  return elem;
};

export default span;
