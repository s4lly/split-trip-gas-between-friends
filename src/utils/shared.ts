export const getStringOrEmpty = (value: string) => {
  return value?.trim() ?? "";
};

export const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};
