import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Async thunk for getting profile
export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token tidak ditemukan');
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluwarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengambil data profile');
            }

            return data.data;
        } catch (error) {
            console.error('Get profile error:', error);
            return rejectWithValue('Terjadi kesalahan. Silakan coba lagi');
        }
    }
);

// Async thunk for updating profile image
export const updateProfileImage = createAsyncThunk(
    'profile/updateProfileImage',
    async (file, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token tidak ditemukan');
            }

            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/profile/image`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Do NOT set Content-Type header, let browser set it with boundary
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluwarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengupdate foto profil');
            }

            return data.data;
        } catch (error) {
            console.error('Update profile image error:', error);
            return rejectWithValue('Terjadi kesalahan. Silakan coba lagi');
        }
    }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async ({ first_name, last_name }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Token tidak ditemukan');
            }

            const response = await fetch(`${API_BASE_URL}/profile/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ first_name, last_name })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluwarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengupdate profil');
            }

            return data.data;
        } catch (error) {
            console.error('Update profile error:', error);
            return rejectWithValue('Terjadi kesalahan. Silakan coba lagi');
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.data = null;
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile Image cases
            .addCase(updateProfileImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileImage.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // API returns updated profile data
                state.error = null;
            })
            .addCase(updateProfileImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile cases
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // API returns updated profile data
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
