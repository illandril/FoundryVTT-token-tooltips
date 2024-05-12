const addEventListenerToAll = (
  html: JQuery,
  selector: string,
  type: keyof HTMLElementEventMap,
  listener: (event: Event) => void,
) => {
  const elements = html.find(selector).addBack(selector).get();
  for (const element of elements) {
    element.addEventListener(type, listener);
  }
};

export default addEventListenerToAll;
