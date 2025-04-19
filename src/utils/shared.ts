export const getStringOrEmpty = (value: string) => {
  return value?.trim() ?? "";
};

export const isBlank = (str: string | undefined | null) => {
  return !str || /^\s*$/.test(str);
};

export const writeClipboardText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error: unknown) {
    // TODO consider throwing custom error and handling it in the component
    console.error("Failed to write to clipboard:", error);
    return false;
  }
};
