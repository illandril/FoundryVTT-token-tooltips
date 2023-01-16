const imageKeyPattern = /^(.+\.)?(img|image|texture)(.src)?$/i;

const isImageKey = (key: string) => {
  return imageKeyPattern.test(key);
};

export default isImageKey;
