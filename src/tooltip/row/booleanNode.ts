export default (value: boolean) => {
  return document.createTextNode(
    value ? game.i18n.localize('Yes') : game.i18n.localize('No'),
  );
};
