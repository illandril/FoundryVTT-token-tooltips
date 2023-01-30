
export const optionalIcon = (iconName: string, thin?: boolean) => {
  if (!iconName) {
    return null;
  }
  return icon(iconName, thin);
};

const icon = (iconName: string, thin?: boolean) => {
  if (!iconName) {
    throw new Error('icon was not provided an iconName');
  }
  const iconElem = document.createElement('i');
  iconElem.classList.add(thin ? 'fat' : 'fas');
  iconElem.classList.add('fa-' + iconName);
  return iconElem;
};

export default icon;
