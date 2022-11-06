import {
  zeroFillLeftShift,
  andBitOperator,
  zeroFillRightShift,
} from './bitwise';

const stringToColor = (str: string): string => {
  let hash = 0;
  let color = '#';

  if (!str) {
    return '#ffffff';
  }

  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((zeroFillLeftShift(hash, 5)) - hash);
  }

  for (let i = 0; i < 3; i += 1) {
    const value = andBitOperator(zeroFillRightShift(hash, (i * 8)), 0xff);
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export default stringToColor;
