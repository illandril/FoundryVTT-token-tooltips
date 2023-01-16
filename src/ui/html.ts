
export const optionalIcon = (iconName: string, thin?: boolean) => {
  if (!iconName) {
    return null;
  }
  return icon(iconName, thin);
};

export const icon = (iconName: string, thin?: boolean) => {
  if (!iconName) {
    throw new Error('icon was not provided an iconName');
  }
  const iconElem = document.createElement('i');
  iconElem.classList.add(thin ? 'fat' : 'fas');
  iconElem.classList.add('fa-' + iconName);
  return iconElem;
};

export const img = (url?: string | null) => {
  if (url) {
    const elem = document.createElement('img');
    elem.src = url;
    elem.alt = '';
    return elem;
  }
  return null;
};

export const emptyNode = (node: Element) => {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
};

export const div = (cssClass: string) => {
  const elem = document.createElement('div');
  elem.classList.add(cssClass);
  return elem;
};

export const span = (cssClass: string) => {
  const elem = document.createElement('span');
  elem.classList.add(cssClass);
  return elem;
};

let tinyMCEParser: ReturnType<typeof tinyMCE.html.DomParser>;
let tinyMCESerializer: ReturnType<typeof tinyMCE.html.Serializer>;

const sanitizeHTML = (html: string) => {
  if (!tinyMCEParser) {
    // eslint-disable-next-line new-cap
    tinyMCEParser = tinyMCE.html.DomParser({ validate: true });
  }
  const parsedHTML = tinyMCEParser.parse(html);
  if (!tinyMCESerializer) {
    // eslint-disable-next-line new-cap
    tinyMCESerializer = tinyMCE.html.Serializer();
  }
  return tinyMCESerializer.serialize(parsedHTML);
};

export const htmlToNode = (html: string) => {
  return tinyMCE.dom.DOMUtils.DOM.createFragment(sanitizeHTML(html));
};
