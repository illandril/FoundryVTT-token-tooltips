
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

const htmlToNode = (html: string) => {
  return tinyMCE.dom.DOMUtils.DOM.createFragment(sanitizeHTML(html));
};

export default htmlToNode;
