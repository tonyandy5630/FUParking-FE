export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem("access_token", access_token);
};

export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("profile");
  const clearLSEvent = new Event("clearLS");
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const getAccessTokenFromLS = () => {
  if (typeof window !== "undefined") {
    // Perform localStorage action
    return localStorage.getItem("access_token") || "";
  }
  return "";
};
