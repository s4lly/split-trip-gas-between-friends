export const getStringOrEmpty = (value: string) => {
  return value?.trim() ?? "";
};

export const isBlank = (str: string) => {
  return !str || /^\s*$/.test(str);
};

export const createFormTitle = (value: string | null | undefined): string => {
  if (!value || isBlank(value)) return "";
  return value.trim().toLowerCase().replace(/\s+/g, "-");
};

export const isParentLink = (parent: string, child: string): boolean => {
  return child.includes(parent) && !parent.includes(child);
};
