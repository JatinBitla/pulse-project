import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createPost = (formData) => API.post('/posts', formData);
export const getPosts = () => API.get('/posts');
export const likePost = (postId) => API.post(`/posts/${postId}/like`);
export const getUserProfile = (username) => API.get(`/users/profile/${username}`);
export const followUser = (id) => API.post(`/users/follow/${id}`);
export const unfollowUser = (id) => API.post(`/users/unfollow/${id}`);