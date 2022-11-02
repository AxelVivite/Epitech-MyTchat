function intToChar(int: number): string {
  const code = 'A'.charCodeAt(0);

  return String.fromCharCode(code + int);
}

export default intToChar;
