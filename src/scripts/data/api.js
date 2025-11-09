// src/scripts/data/api.js

import CONFIG from '../config';
import Auth from '../utils/auth';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
};

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const responseJson = await response.json();
  if (response.status >= 400) {
    throw new Error(responseJson.message || 'Registration failed');
  }
  return responseJson;
}

export async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const responseJson = await response.json();
  if (response.status >= 400) {
    throw new Error(responseJson.message || 'Login failed');
  }
  Auth.setToken(responseJson.loginResult.token); // Simpan token
  return responseJson;
}

export async function getAllStories() {
  const response = await fetch(ENDPOINTS.GET_ALL_STORIES, {
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
    },
  });
  const responseJson = await response.json();
  if (responseJson.error) {
    throw new Error(responseJson.message);
  }
  return responseJson.listStory;
}

export async function addNewStory(formData) {
  const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
    },
    body: formData,
  });
  const responseJson = await response.json();
  if (response.status >= 400) {
    throw new Error(responseJson.message || 'Failed to add story');
  }
  return responseJson;
}