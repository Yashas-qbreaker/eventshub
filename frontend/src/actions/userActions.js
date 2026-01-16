import api from "../utils/api";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_UPDATE_SUCCESS,
} from "../constants/userConstants";

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const { data } = await api.post("/users/login/", { username, password });
    // Remove role concept - keep backend data but do not store role
    const userInfo = { ...data, username: username };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
  } catch (err) {
    let errorMessage = "Login failed. Please try again.";
    
    if (err.code === 'ECONNABORTED' || err.message === 'Network Error' || !err.response) {
      errorMessage = "Unable to connect to server. Please make sure the backend is running.";
    } else if (err.response?.data?.detail) {
      errorMessage = err.response.data.detail;
    } else if (err.response?.data) {
      errorMessage = typeof err.response.data === 'string' ? err.response.data : "Invalid credentials.";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch({ type: USER_LOGIN_FAIL, payload: errorMessage });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const register = (payload) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    await api.post("/users/register/", payload);
    // auto-login after register
    const { data } = await api.post("/users/login/", { username: payload.username, password: payload.password });
    // Remove role concept on register/login
    const userInfo = { ...data, username: payload.username };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    dispatch({ type: USER_REGISTER_SUCCESS, payload: userInfo });
  } catch (err) {
    let errorMessage = "An error occurred. Please try again.";
    
    if (err.code === 'ECONNABORTED' || err.message === 'Network Error' || !err.response) {
      errorMessage = "Unable to connect to server. Please make sure the backend is running.";
    } else if (err.response?.data) {
      // Handle validation errors from backend
      if (typeof err.response.data === 'object') {
        const errors = Object.values(err.response.data).flat();
        errorMessage = errors.length > 0 ? errors.join(', ') : "Registration failed. Please check your information.";
      } else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      } else if (err.response.data.detail) {
        errorMessage = err.response.data.detail;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    dispatch({ type: USER_REGISTER_FAIL, payload: errorMessage });
  }
};

export const getProfile = () => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });
    const { data } = await api.get("/users/profile/");
    
    // Sync avatar and is_staff to localStorage if they exist
    const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
    if (userInfo) {
      let updated = false;
      const updatedUserInfo = { ...userInfo };
      
      if (data.avatar) {
        // If avatar is a relative URL, construct full URL
        const avatarUrl = data.avatar.startsWith('http') ? data.avatar : `${process.env.REACT_APP_API_BASE || "http://localhost:8000"}${data.avatar}`;
        updatedUserInfo.avatar = avatarUrl;
        updated = true;
      }
      
      if (data.is_staff !== undefined) {
        updatedUserInfo.is_staff = data.is_staff;
        updated = true;
      }
      
      if (updated) {
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('localStorageUpdated'));
      }
    }
    
    dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: USER_PROFILE_FAIL, payload: err.response?.data || err.message });
  }
};

export const updateProfile = (formData) => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });
    const { data } = await api.put("/users/profile/", formData, { headers: { "Content-Type": "multipart/form-data" } });
    
    // Update localStorage with new avatar and is_staff if they exist
    const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
    if (userInfo) {
      let updated = false;
      const updatedUserInfo = { ...userInfo };
      
      if (data.avatar) {
        // If avatar is a relative URL, construct full URL
        const avatarUrl = data.avatar.startsWith('http') ? data.avatar : `${process.env.REACT_APP_API_BASE || "http://localhost:8000"}${data.avatar}`;
        updatedUserInfo.avatar = avatarUrl;
        updated = true;
      }
      
      if (data.is_staff !== undefined) {
        updatedUserInfo.is_staff = data.is_staff;
        updated = true;
      }
      
      if (updated) {
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('localStorageUpdated'));
      }
    }
    
    dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: USER_PROFILE_FAIL, payload: err.response?.data || err.message });
  }
};


