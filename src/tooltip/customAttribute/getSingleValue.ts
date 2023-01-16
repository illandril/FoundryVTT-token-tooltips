import calculateValue from '../calculateValue';

const intPattern = /^-?[0-9]+$/;

const getSingleValue = (actor: Actor, rawAttributeKey: string) => {
  const attributeKey = rawAttributeKey.trim();
  if (intPattern.test(attributeKey)) {
    const asInt = parseInt(attributeKey, 10);
    if (!isNaN(asInt)) {
      return { value: asInt };
    }
  }
  const attribute = foundry.utils.getProperty(actor, attributeKey);
  return calculateValue(attribute, attributeKey);
};

export default getSingleValue;
