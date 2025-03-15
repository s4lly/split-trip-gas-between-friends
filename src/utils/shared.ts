export const getStringOrEmpty = (value: string) => {
  return value?.trim() ?? "";
};

export const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};

export const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;

  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
