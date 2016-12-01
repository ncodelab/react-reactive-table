export const copyObject = (obj) => {
  if (obj) {
  return JSON.parse(JSON.stringify(obj));
  }
};
