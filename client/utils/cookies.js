export const setTokenCookie = (token) => {
    window.localStorage.setItem("token", token);
};

export const getTokenCookie = () => {
    return window.localStorage.getItem("token")
};

export const removeTokenCookies = () => {
    window.localStorage.removeItem("token");
};