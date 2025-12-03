import axios from 'axios';


const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '');
if(apiUrl) axios.defaults.baseURL = apiUrl;

export function setToken(token){
  if(token){
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
}

export function getToken(){
  return localStorage.getItem('token');
}

export function logout(){
  setToken(null);
}

export function registerAuthInterceptor(){
  axios.interceptors.response.use(
    res => res,
    err => {
      if(err?.response?.status === 401){
        setToken(null);
        if(window && window.location) window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
}
