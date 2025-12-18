import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProfile,
    fetchBalance
} from '../../store/slices/homeSlice';
import {
    fetchTransactions,
    resetTransactions,
    incrementOffset
} from '../../store/slices/transactionSlice';
import FormHeader from '../FormHeader/FormHeader';
import FormProfileSection from '../FormProfileSection/FormProfileSection';
import '../PageStyles.css';

const PageTransaction = () => {
    const dispatch = useDispatch();

    const {
        profile,
        profileLoading,
        balance,
        balanceLoading
    } = useSelector((state) => state.home);

    const {
        transactions,
        offset,
        limit,
        hasMore,
        loading,
        error
    } = useSelector((state) => state.transaction);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchBalance());

        dispatch(resetTransactions());
        dispatch(fetchTransactions({ offset: 0, limit: 5 }));
    }, [dispatch]);

    const handleShowMore = () => {
        const newOffset = offset + limit;
        dispatch(incrementOffset());
        dispatch(fetchTransactions({ offset: newOffset, limit }));
    };



    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).replace('.', ':');
    };

    return (
        <div className="page-container">
            <FormHeader />

            <div className="main-content">
                <FormProfileSection />
                <div className="transaction-section">
                    <h2 className="section-title">Semua Transaksi</h2>

                    <div className="transaction-list">
                        {loading && transactions.length === 0 ? (
                            <p className="loading-text">Loading history...</p>
                        ) : transactions.length > 0 ? (
                            transactions.map((transaction, index) => (
                                <div key={`${transaction.invoice_number}-${index}`} className="transaction-item">
                                    <div className="transaction-info">
                                        <div className={`transaction-amount ${transaction.transaction_type === 'TOPUP' ? 'credit' : 'debit'}`}>
                                            {transaction.transaction_type === 'TOPUP' ? '+' : '-'} {formatCurrency(transaction.total_amount)}
                                        </div>
                                        <div className="transaction-date">
                                            {formatDate(transaction.created_on)} &nbsp;
                                            <span className="transaction-time">{formatTime(transaction.created_on)}</span>
                                        </div>
                                    </div>
                                    <div className="transaction-description">
                                        {transaction.description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>Maaf tidak ada histori transaksi saat ini</p>
                            </div>
                        )}

                        {error && <p className="error-text">{error}</p>}
                    </div>

                    {hasMore && !loading && transactions.length > 0 && (
                        <div className="show-more-container">
                            <button className="show-more-btn" onClick={handleShowMore}>
                                Show more
                            </button>
                        </div>
                    )}

                    {loading && transactions.length > 0 && (
                        <p className="loading-more">Loading more...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageTransaction;
