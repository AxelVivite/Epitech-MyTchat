export const zeroFillLeftShift = (nbr: number, ZerosToPushRight: number) => {
  const bin = nbr.toString(2);

  return parseInt(bin.slice(1) + '0'.repeat(ZerosToPushRight), 2);
};

export const zeroFillRightShift = (nbr: number, bitToPopRight: number) => {
  const bin = nbr.toString(2);

  return parseInt(bin.slice(0, -bitToPopRight), 2);
};

export const andBitOperator = (a: number, b: number) => {
  let binA = a.toString(2);
  let binB = b.toString(2);
  let binRes = '';

  while (binA.length > binB.length) {
    binB = `0${binB}`;
  }
  while (binB.length > binA.length) {
    binA = `0${binB}`;
  }
  for (let i = 0; binA[i] && binB[i]; i += 1) {
    if (binA === '1' && binB === '1') {
      binRes = `1${binRes}`;
    } else {
      binRes = `0${binRes}`;
    }
  }

  return parseInt(binRes, 2);
};
