import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Initial state
const initialState = {
    // Profile data
    profile: {
        email: '',
        first_name: '',
        last_name: '',
        profile_image: ''
    },
    profileLoading: false,
    profileError: null,

    // Balance data
    balance: 0,
    balanceLoading: false,
    balanceError: null,

    // Services data
    services: [],
    servicesLoading: false,
    servicesError: null,

    // Banner data
    banners: [],
    bannersLoading: false,
    bannersError: null,

    // UI state
    balanceVisible: false,
    currentSlide: 0
};

// Async thunk for fetching user profile
export const fetchProfile = createAsyncThunk(
    'home/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return rejectWithValue('Token tidak ditemukan. Silakan login kembali.');
            }

            const response = await fetch(`${API_BASE_URL}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengambil data profile');
            }

            return data.data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            return rejectWithValue('Terjadi kesalahan saat mengambil data profile');
        }
    }
);

// Async thunk for fetching balance
export const fetchBalance = createAsyncThunk(
    'home/fetchBalance',
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return rejectWithValue('Token tidak ditemukan. Silakan login kembali.');
            }

            const response = await fetch(`${API_BASE_URL}/balance`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengambil data saldo');
            }

            return data.data.balance;
        } catch (error) {
            console.error('Balance fetch error:', error);
            return rejectWithValue('Terjadi kesalahan saat mengambil data saldo');
        }
    }
);

// Async thunk for fetching services
export const fetchServices = createAsyncThunk(
    'home/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return rejectWithValue('Token tidak ditemukan. Silakan login kembali.');
            }

            const response = await fetch(`${API_BASE_URL}/services`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengambil data layanan');
            }

            return data.data;
        } catch (error) {
            console.error('Services fetch error:', error);
            return rejectWithValue('Terjadi kesalahan saat mengambil data layanan');
        }
    }
);

// Async thunk for fetching banners (public API)
export const fetchBanners = createAsyncThunk(
    'home/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/banner`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || 'Gagal mengambil data banner');
            }

            return data.data;
        } catch (error) {
            console.error('Banners fetch error:', error);
            return rejectWithValue('Terjadi kesalahan saat mengambil data banner');
        }
    }
);

// Create the slice
const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        toggleBalanceVisibility: (state) => {
            state.balanceVisible = !state.balanceVisible;
        },
        setCurrentSlide: (state, action) => {
            state.currentSlide = action.payload;
        },
        nextSlide: (state) => {
            state.currentSlide = (state.currentSlide + 1) % state.banners.length;
        },
        prevSlide: (state) => {
            const bannersLength = state.banners.length;
            state.currentSlide = (state.currentSlide - 1 + bannersLength) % bannersLength;
        },
        resetHomeState: () => initialState
    },
    extraReducers: (builder) => {
        // Profile reducers
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
            });

        // Balance reducers
        builder
            .addCase(fetchBalance.pending, (state) => {
                state.balanceLoading = true;
                state.balanceError = null;
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.balanceLoading = false;
                state.balance = action.payload;
            })
            .addCase(fetchBalance.rejected, (state, action) => {
                state.balanceLoading = false;
                state.balanceError = action.payload;
            });

        // Services reducers
        builder
            .addCase(fetchServices.pending, (state) => {
                state.servicesLoading = true;
                state.servicesError = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.servicesLoading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.servicesLoading = false;
                state.servicesError = action.payload;
            });

        // Banners reducers
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.bannersLoading = true;
                state.bannersError = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.bannersLoading = false;
                state.banners = action.payload;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.bannersLoading = false;
                state.bannersError = action.payload;
            });
    }
});

// Export actions
export const {
    toggleBalanceVisibility,
    setCurrentSlide,
    nextSlide,
    prevSlide,
    resetHomeState
} = homeSlice.actions;

// Export reducer
export default homeSlice.reducer;
