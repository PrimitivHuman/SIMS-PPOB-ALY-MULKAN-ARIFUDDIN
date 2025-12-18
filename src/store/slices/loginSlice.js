import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Initial state
const initialState = {
    formData: {
        email: '',
        password: ''
    },
    showPassword: false,
    loading: false,
    error: '',
    isAuthenticated: false,
    token: null,
    user: null
};

// Async thunk for login API call
export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (_, { getState, rejectWithValue }) => {
        const { formData } = getState().login;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return rejectWithValue('Format email tidak valid');
        }

        // Validate password length
        if (formData.password.length < 8) {
            return rejectWithValue('Password minimal 8 karakter');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle different error status codes
                if (response.status === 401) {
                    return rejectWithValue('Email atau password salah');
                }
                return rejectWithValue(data.message || 'Login gagal. Silakan coba lagi');
            }

            // Store token in localStorage
            if (data.data && data.data.token) {
                localStorage.setItem('token', data.data.token);
            }

            return data.data;
        } catch (error) {
            console.error('Login error:', error);
            return rejectWithValue('Terjadi kesalahan. Silakan coba lagi');
        }
    }
);

// Create the slice
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        updateFormField: (state, action) => {
            const { name, value } = action.payload;
            state.formData[name] = value;
            // Clear error when user starts typing
            if (state.error) {
                state.error = '';
            }
        },
        togglePasswordVisibility: (state) => {
            state.showPassword = !state.showPassword;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = '';
        },
        logout: (state) => {
            // Clear token from localStorage
            localStorage.removeItem('token');
            // Reset state to initial
            return initialState;
        },
        resetForm: (state) => {
            state.formData = initialState.formData;
            state.error = '';
            state.showPassword = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.error = '';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    updateFormField,
    togglePasswordVisibility,
    setError,
    clearError,
    logout,
    resetForm
} = loginSlice.actions;

// Export reducer
export default loginSlice.reducer;
