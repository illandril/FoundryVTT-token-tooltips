const div = (cssClass: string) => {
  const elem = document.createElement('div');
  elem.classList.add(cssClass);
  return elem;
};

export default div;
