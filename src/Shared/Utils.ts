export const getStringOrEmpty = (value) => {
  return value?.trim() ?? "";
};

export const isBlank = (str) => {
  return !str || /^\s*$/.test(str);
};
