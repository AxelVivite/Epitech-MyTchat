export const zeroFillLeftShift = (nbr: number, ZerosToPushRight: number) => {
  const isNegatif = nbr < 0;
  const bin = nbr.toString(2).replace('-', '');

  let rtn = parseInt((bin + '0'.repeat(ZerosToPushRight)), 2);

  while (rtn > 2147483648) {
    rtn -= 2147483648 * 2;
  }

  while (rtn < -2147483647) {
    rtn += 2147483648 * 2;
  }

  if (isNegatif) {
    rtn = -rtn;
  }

  return rtn;
};

export const zeroFillRightShift = (nbr: number, bitToPopRight: number) => {
  let bin = nbr.toString(2).slice(1);
  bin = bin.slice(0, nbr.toString(2).length - bitToPopRight - 1);
  let rtn = parseInt(bin, 2);

  while (rtn > 2147483648) {
    rtn -= 2147483648 * 2;
  }

  while (rtn < -2147483647) {
    rtn += 2147483648 * 2;
  }

  return rtn;
};

export const andBitOperator = (a: number, b: number) => {
  let binA = a.toString(2);
  let binB = b.toString(2);
  let binRes = '';

  while (binA.length > binB.length) {
    binB = `0${binB}`;
  }
  while (binB.length > binA.length) {
    binA = `0${binA}`;
  }

  for (let i = 0; binA[i] && binB[i]; i += 1) {
    if (binA[i] === '1' && binB[i] === '1') {
      binRes = `${binRes}1`;
    } else {
      binRes = `${binRes}0`;
    }
  }

  return parseInt(binRes, 2);
};
