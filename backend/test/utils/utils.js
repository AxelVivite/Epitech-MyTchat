export const url = 'http://localhost:3000';

export function makeId(length = 10) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function makeEmail() {
  return `${makeId()}@test.com`;
}

export function makePwd() {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  let result = makeId(10);

  result += digits[Math.floor(Math.random() * 10)];
  result += upper[Math.floor(Math.random() * 26)];

  return result;
}

export function arrayCmp(l1, l2, orderMatters = false) {
  if (l1.length !== l2.length) {
    return false;
  }

  if (!orderMatters) {
    l1.sort();
    l2.sort();
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < l1.length; i++) {
    if (l1[i] !== l2[i]) {
      return false;
    }
  }

  return true;
}
