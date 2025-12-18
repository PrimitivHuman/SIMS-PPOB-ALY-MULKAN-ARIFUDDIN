import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProfile,
    fetchBalance
} from '../../store/slices/homeSlice';
import {
    setTopupAmount,
    performTopup,
    clearTopupState
} from '../../store/slices/topupSlice';
import FormHeader from '../FormHeader/FormHeader';
import FormProfileSection from '../FormProfileSection/FormProfileSection';
import '../PageStyles.css';

const PageTopup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        profile,
        profileLoading,
        balance,
        balanceLoading
    } = useSelector((state) => state.home);

    const {
        amount,
        isLoading,
        error: topupError,
        successMessage
    } = useSelector((state) => state.topup);

    const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successAmount, setSuccessAmount] = useState('');

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchBalance());

        return () => {
            dispatch(clearTopupState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            setShowSuccessDialog(true);
            dispatch(fetchBalance());
        }
        if (topupError) {
            setErrorMessage(topupError);
            setShowErrorDialog(true);
        }
    }, [successMessage, topupError, dispatch]);

    const formatCurrency = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        dispatch(setTopupAmount(value));
    };

    const handleQuickAmount = (value) => {
        dispatch(setTopupAmount(value.toString()));
    };

    const handleTopup = (e) => {
        e.preventDefault();
        const numericAmount = parseInt(amount);

        if (!amount || numericAmount <= 0) {
            alert('Silahkan masukkan nominal yang valid');
            return;
        }

        if (numericAmount > 1000000) {
            setErrorMessage('Maksimum nominal yang diterima untuk proses top up adalah 1.000.000');
            setShowErrorDialog(true);
            return;
        }

        setShowConfirmDialog(true);
    };

    const confirmTopup = () => {
        setShowConfirmDialog(false);
        setSuccessAmount(amount);
        dispatch(performTopup(amount));
    };

    const handleCancelTopup = () => {
        setShowConfirmDialog(false);
    };

    const handleCloseError = () => {
        setShowErrorDialog(false);
        setErrorMessage('');
    };

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);
        setSuccessAmount('');
        dispatch(clearTopupState());
        navigate('/home');
    };



    return (
        <div className="page-container">
            <FormHeader />

            <div className="main-content">
                <FormProfileSection />
                <div className="topup-section">
                    <h3 className="section-subtitle">Silahkan masukan</h3>
                    <h2 className="section-title">Nominal Top Up</h2>

                    <div className="topup-form-container">
                        <form onSubmit={handleTopup} className="topup-form">
                            <div className="input-group">
                                <img src="/100.png" alt="Icon" className="input-icon"
                                    onError={(e) => { e.target.style.display = 'none'; }} />
                                <input
                                    type="text"
                                    placeholder="masukan nominal Top Up"
                                    value={amount ? formatCurrency(amount) : ''}
                                    onChange={handleAmountChange}
                                    className="amount-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={isLoading || !amount || parseInt(amount) <= 0}
                            >
                                {isLoading ? 'Loading...' : 'Top Up'}
                            </button>
                        </form>

                        <div className="quick-amounts">
                            {quickAmounts.map((quickAmount, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className="quick-amount-btn"
                                    onClick={() => handleQuickAmount(quickAmount)}
                                >
                                    Rp{formatCurrency(quickAmount)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="modal-overlay" onClick={handleCancelTopup}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <div className="icon-circle">
                                <img src="/Website Assets/Logo.png" alt="Logo" />
                            </div>
                        </div>
                        <p className="modal-text">Anda yakin untuk Top Up sebesar</p>
                        <h2 className="modal-amount">Rp{formatCurrency(amount)}</h2>
                        <button className="primary-btn" onClick={confirmTopup}>
                            Ya, lanjutkan Top Up
                        </button>
                        <button className="text-btn" onClick={handleCancelTopup}>
                            Batalkan
                        </button>
                    </div>
                </div>
            )}

            {showSuccessDialog && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <div className="icon-circle-success">
                                <span className="checkmark-icon">✓</span>
                            </div>
                        </div>
                        <p className="modal-text">Top Up sebesar</p>
                        <h2 className="modal-amount">Rp{formatCurrency(successAmount)}</h2>
                        <p className="modal-text-bottom">berhasil!</p>
                        <button className="modal-link-btn" onClick={handleCloseSuccess}>
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            )}

            {showErrorDialog && (
                <div className="modal-overlay" onClick={handleCloseError}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <div className="icon-circle-error">
                                <span className="cross-icon">✕</span>
                            </div>
                        </div>
                        <p className="modal-text">{errorMessage}</p>
                        <button className="modal-link-btn" onClick={handleCloseError}>
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageTopup;
