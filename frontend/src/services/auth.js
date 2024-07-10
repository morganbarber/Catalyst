import axios from 'axios';
import { API_URL } from '../config';

export const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username: username,
    password: password
  });
  return response.data;
};

export const signup = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/signup`, {
    username: username,
    email: email,
    password: password
  });
  return response.data;
};