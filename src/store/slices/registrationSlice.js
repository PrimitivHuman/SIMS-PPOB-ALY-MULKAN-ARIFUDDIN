import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Initial state
const initialState = {
    formData: {
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
    },
    showPassword: false,
    showConfirmPassword: false,
    loading: false,
    error: '',
    registrationSuccess: false
};

// Async thunk for registration API call
export const registerUser = createAsyncThunk(
    'registration/registerUser',
    async (_, { getState, rejectWithValue }) => {
        const { formData } = getState().registration;

        // Validation
        if (formData.password.length < 8) {
            return rejectWithValue('Password minimal 8 karakter');
        }

        if (formData.password !== formData.confirmPassword) {
            return rejectWithValue('Password dan konfirmasi password tidak sama');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return rejectWithValue('Format email tidak valid');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Registrasi gagal. Silakan coba lagi');
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            return rejectWithValue('Terjadi kesalahan. Silakan coba lagi');
        }
    }
);

// Create the slice
const registrationSlice = createSlice({
    name: 'registration',
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
        toggleConfirmPasswordVisibility: (state) => {
            state.showConfirmPassword = !state.showConfirmPassword;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = '';
        },
        resetForm: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                state.registrationSuccess = true;
                state.error = '';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    updateFormField,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    setError,
    clearError,
    resetForm
} = registrationSlice.actions;

// Export reducer
export default registrationSlice.reducer;
