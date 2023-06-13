export const hasParam = (prop: string) => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.has(prop);
};

export const getParam = (prop: string) => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(prop);
};
