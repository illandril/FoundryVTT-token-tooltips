export const KEY = 'illandril-token-tooltips';
export const NAME = "Illandril's Token Tooltips";
export const CSS_PREFIX = `${KEY}--`;

const _log = (logFN, ...args) => {
  logFN.apply(console, [`%c${NAME} |`, 'color: rgba(0,0,0,0.5);', ...args]);
};

export const log = {
  dir: (label, ...args) => {
    const group = `${NAME} | ${label}`;
    console.group(group);
    console.dir(...args);
    console.groupEnd(group);
  },
  debug: (...args) => {
    _log(console.debug, ...args);
  },
  info: (...args) => {
    _log(console.info, ...args);
  },
  error: (...args) => {
    _log(console.error, ...args);
  },
};
