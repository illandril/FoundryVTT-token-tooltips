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
    const elem = document.createElement('img');
    elem.src = url;
    elem.alt = '';
    return elem;
  }
  return null;
};

export const emptyNode = (node) => {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
};

export const div = (cssClass) => {
  const elem = document.createElement('div');
  elem.classList.add(cssClass);
  return elem;
};

export const span = (cssClass) => {
  const elem = document.createElement('span');
  elem.classList.add(cssClass);
  return elem;
};

export const appendText = (element, text) => {
  element.appendChild(document.createTextNode(text));
};

let tinyMCEParser;
let tinyMCESerializer;

const sanitizeHTML = (html) => {
  if(!tinyMCEParser) {
    tinyMCEParser = new tinyMCE.html.DomParser({ validate: true });
  }
  const parsedHTML = tinyMCEParser.parse(html);
  if(!tinyMCESerializer) {
    tinyMCESerializer = new tinymce.html.Serializer();
  }
  return tinyMCESerializer.serialize(parsedHTML);
};

export const htmlToNode = (html) => {
  return tinyMCE.dom.DOMUtils.DOM.createFragment(sanitizeHTML(html));
}
