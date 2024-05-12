import type { CalculatedValue, ValidAttributeType } from './types';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Legacy
const calculateValidAttributeValue = (attribute: ValidAttributeType, attributeKey: string): CalculatedValue => {
  let value: ValidAttributeType;
  if (Array.isArray(attribute)) {
    if (Array.prototype.some.call(attribute, (entry) => entry instanceof Node)) {
      value = document.createDocumentFragment();
      let first = true;
      for (const entry of attribute) {
        if (!first) {
          value.appendChild(document.createTextNode(', '));
        }
        first = false;
        if (entry instanceof Node) {
          value.appendChild(entry);
        } else {
          value.appendChild(document.createTextNode(entry.toString()));
        }
      }
    } else {
      value = Array.prototype.join.call(attribute, ', ');
    }
  } else if (typeof attribute === 'number' && attributeKey.endsWith('.pct')) {
    value = `${attribute.toFixed(2)}%`;
  } else {
    value = attribute;
  }
  return {
    value,
  };
};

export default calculateValidAttributeValue;
