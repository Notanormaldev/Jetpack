import axios from "axios";

const authapi = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
});

// Axios response interceptor to handle silent Access Token Refresh
authapi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if response is 401 Unauthorized, contains an expired token indicator, and hasn't been retried yet
    if (
      error.response?.status === 401 && 
      error.response?.data?.expired && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Post request to refresh token (handles cookies on backend)
        await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });
        
        // Retry the original request
        return authapi(originalRequest);
      } catch (refreshError) {
        // Refresh token has failed/expired -> clear state and redirect to login
        console.warn("Session expired. Redirecting to login.");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export async function register({ email, fullname, password }) {
  try {
    const res = await authapi.post('/register', { email, fullname, password })
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Registration failed" }
  }
}

export async function verifyOtp({ email, otp }) {
  try {
    const res = await authapi.post('/verify-otp', { email, otp })
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "OTP verification failed" }
  }
}

export async function login({ email, password }) {
  try {
    const res = await authapi.post('/login', { email, password })
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Login failed" }
  }
}

export async function getme() {
  try {
    const res = await authapi.get('/get-me')
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Failed to fetch user session" }
  }
}

export async function forgotPasswordApi({ email }) {
  try {
    const res = await authapi.post('/forgot-password', { email })
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Failed to send reset OTP" }
  }
}

export async function resetPasswordApi({ email, otp, newPassword }) {
  try {
    const res = await authapi.post('/reset-password', { email, otp, newPassword })
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Password reset failed" }
  }
}

export async function logoutApi() {
  try {
    const res = await authapi.post('/logout')
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Logout failed" }
  }
}

export async function deleteAccountApi() {
  try {
    const res = await authapi.delete('/delete-account')
    return res.data
  } catch (error) {
    throw error.response?.data || { msg: "Failed to delete account" }
  }
}
