
const img = (url?: string | null) => {
  if (url) {
    const elem = document.createElement('img');
    elem.src = url;
    elem.alt = '';
    return elem;
  }
  return null;
};

export default img;
