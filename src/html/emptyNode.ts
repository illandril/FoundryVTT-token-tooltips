
const emptyNode = (node: Element) => {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
};

export default emptyNode;
