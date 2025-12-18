import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBalance } from './homeSlice';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

// Helper to get token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Async thunk for processing top up
export const performTopup = createAsyncThunk(
    'topup/performTopup',
    async (amount, { rejectWithValue, dispatch }) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return rejectWithValue('Token tidak ditemukan. Silakan login kembali.');
            }

            const response = await fetch(`${API_BASE_URL}/topup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    top_up_amount: parseInt(amount)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluarsa');
                }
                return rejectWithValue(data.message || 'Gagal melakukan Top Up');
            }

            // On success, refresh the balance in home slice
            dispatch(fetchBalance());

            return data.data.balance;
        } catch (error) {
            console.error('Topup error:', error);
            return rejectWithValue('Terjadi kesalahan saat memproses Top Up');
        }
    }
);

const initialState = {
    amount: '',
    isLoading: false,
    error: null,
    successMessage: null
};

const topupSlice = createSlice({
    name: 'topup',
    initialState,
    reducers: {
        setTopupAmount: (state, action) => {
            state.amount = action.payload;
            state.error = null;
            state.successMessage = null;
        },
        clearTopupState: (state) => {
            state.amount = '';
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(performTopup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(performTopup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = `Top Up sebesar Rp ${new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(state.amount)} berhasil!`;
                // Note: We don't clear amount immediately to let user see what they deposited, 
                // but usually better to clear or keep. I'll reset on navigation or explicit clear.
                state.amount = '';
            })
            .addCase(performTopup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { setTopupAmount, clearTopupState } = topupSlice.actions;

export default topupSlice.reducer;
