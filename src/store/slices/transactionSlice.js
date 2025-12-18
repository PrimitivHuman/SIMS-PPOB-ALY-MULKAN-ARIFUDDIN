import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const fetchTransactions = createAsyncThunk(
    'transaction/fetchTransactions',
    async ({ offset, limit }, { rejectWithValue }) => {
        try {
            const token = getAuthToken();
            if (!token) {
                return rejectWithValue('Token tidak ditemukan');
            }

            const response = await fetch(`${API_BASE_URL}/transaction/history?offset=${offset}&limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    return rejectWithValue('Token tidak valid atau kadaluarsa');
                }
                return rejectWithValue(data.message || 'Gagal mengambil data transaksi');
            }

            return data.data;
        } catch (error) {
            console.error('Transaction fetch error:', error);
            return rejectWithValue('Terjadi kesalahan saat mengambil data transaksi');
        }
    }
);

const initialState = {
    transactions: [],
    offset: 0,
    limit: 5,
    hasMore: true,
    loading: false,
    error: null
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        resetTransactions: (state) => {
            state.transactions = [];
            state.offset = 0;
            state.hasMore = true;
            state.error = null;
        },
        incrementOffset: (state) => {
            state.offset += state.limit;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                const newRecords = action.payload.records;

                // Append new records
                if (state.offset === 0) {
                    state.transactions = newRecords;
                } else {
                    state.transactions = [...state.transactions, ...newRecords];
                }

                // Check if we have more data
                if (newRecords.length < state.limit) {
                    state.hasMore = false;
                }
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetTransactions, incrementOffset } = transactionSlice.actions;

export default transactionSlice.reducer;
