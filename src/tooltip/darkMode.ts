import module from '../module';

const CSS_DARK_MODE = module.cssPrefix.child('dark');

export const enableDarkMode = () => {
  document.body.classList.add(CSS_DARK_MODE);
};

export const disableDarkMode = () => {
  document.body.classList.remove(CSS_DARK_MODE);
};

export const isDarkMode = () => document.body.classList.contains(CSS_DARK_MODE);
