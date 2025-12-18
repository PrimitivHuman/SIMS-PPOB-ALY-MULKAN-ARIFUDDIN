import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Initial state
const initialState = {
    selectedService: null,
    isLoading: false,
    error: null,
    successMessage: null,
    transactionResult: null
};

// Async thunk for performing transaction
export const performTransaction = createAsyncThunk(
    'payment/performTransaction',
    async (serviceCode, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return rejectWithValue('Token tidak ditemukan. Silakan login kembali.');
            }

            const response = await fetch(`${API_BASE_URL}/transaction`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    service_code: serviceCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluarsa');
                }
                if (response.status === 400) {
                    return rejectWithValue(data.message || 'Service atau layanan tidak ditemukan');
                }
                return rejectWithValue(data.message || 'Gagal melakukan transaksi');
            }

            return data.data;
        } catch (error) {
            console.error('Transaction error:', error);
            return rejectWithValue('Terjadi kesalahan saat melakukan transaksi');
        }
    }
);

// Create the slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setSelectedService: (state, action) => {
            state.selectedService = action.payload;
        },
        clearPaymentState: (state) => {
            state.selectedService = null;
            state.isLoading = false;
            state.error = null;
            state.successMessage = null;
            state.transactionResult = null;
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(performTransaction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(performTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactionResult = action.payload;
                state.successMessage = 'Transaksi berhasil!';
            })
            .addCase(performTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    setSelectedService,
    clearPaymentState,
    clearMessages
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
