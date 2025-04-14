export const getStringOrEmpty = (value: string) => {
  return value?.trim() ?? "";
};

export const isBlank = (str: string | undefined | null) => {
  return !str || /^\s*$/.test(str);
};
