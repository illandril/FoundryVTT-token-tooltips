export const icon = (iconName) => {
  if (!iconName) {
    return null;
  }
  const iconElem = document.createElement('i');
  iconElem.classList.add('fas');
  iconElem.classList.add('fa-' + iconName);
  return iconElem;
};

export const img = (url) => {
  if (url) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    return img;
  }
  return null;
};

export const emptyNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
};

export const div = (cssClass) => {
  const div = document.createElement('div');
  div.classList.add(cssClass);
  return div;
};

export const span = (cssClass) => {
  const span = document.createElement('span');
  span.classList.add(cssClass);
  return span;
};

export const appendText = (element, text) => {
  element.appendChild(document.createTextNode(text));
};
