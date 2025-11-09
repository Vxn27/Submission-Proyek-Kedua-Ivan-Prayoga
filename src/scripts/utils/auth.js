// src/scripts/utils/auth.js

const AUTH_TOKEN_KEY = 'auth_token';

const Auth = {
  isLoggedIn() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

export default Auth;