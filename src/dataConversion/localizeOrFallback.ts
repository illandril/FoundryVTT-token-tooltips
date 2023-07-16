const localizeOrFallback = (localeKey: string, fallback: string) => {
  return game.i18n.has(localeKey) ? game.i18n.localize(localeKey) : fallback;
};

export default localizeOrFallback;
