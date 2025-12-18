import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProfile,
    fetchBalance
} from '../../store/slices/homeSlice';
import {
    performTransaction,
    clearMessages
} from '../../store/slices/paymentSlice';
import FormHeader from '../FormHeader/FormHeader';
import FormProfileSection from '../FormProfileSection/FormProfileSection';
import '../PageStyles.css';

const PagePembayaran = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        profile,
        profileLoading,
        balance,
        balanceLoading
    } = useSelector((state) => state.home);

    const {
        selectedService,
        isLoading,
        error,
        successMessage
    } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchBalance());

        if (!selectedService) {
            navigate('/home');
        }
    }, [dispatch, selectedService, navigate]);

    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
    const [showErrorDialog, setShowErrorDialog] = React.useState(false);
    useEffect(() => {
        if (successMessage) {
            setShowSuccessDialog(true);
            dispatch(fetchBalance());
        }
        if (error) {
            setShowErrorDialog(true);
        }
    }, [successMessage, error, dispatch]);

    const handleCloseSuccess = () => {
        setShowSuccessDialog(false);
        dispatch(clearMessages());
        navigate('/home');
    };

    const handleCloseError = () => {
        setShowErrorDialog(false);
        dispatch(clearMessages());
        navigate('/home');
    };

    const formatCurrency = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };



    const handlePayment = (e) => {
        e.preventDefault();
        if (selectedService && selectedService.service_code) {
            setShowConfirmDialog(true);
        } else {
            alert('Service tidak ditemukan');
        }
    };

    const confirmPayment = () => {
        setShowConfirmDialog(false);
        dispatch(performTransaction(selectedService.service_code));
    };

    const handleCancelPayment = () => {
        setShowConfirmDialog(false);
    };

    if (!selectedService) {
        return null;
    }

    return (
        <div className="pembayaran-page">
            <FormHeader />

            <div className="main-content">
                <FormProfileSection />

                <div className="payment-section">
                    <h3 className="section-label">PemBayaran</h3>
                    <div className="service-info">
                        <img
                            src={selectedService.service_icon}
                            alt={selectedService.service_name}
                            className="service-icon"
                            onError={(e) => { e.target.src = '/Website Assets/PBB.png'; }}
                        />
                        <span className="service-name">{selectedService.service_name}</span>
                    </div>

                    <form onSubmit={handlePayment} className="payment-form">
                        <div className="input-group">
                            <img src="/100.png" alt="Icon" className="input-icon"
                                onError={(e) => { e.target.style.display = 'none'; }} />
                            <input
                                type="text"
                                value={selectedService.service_tariff ? formatCurrency(selectedService.service_tariff) : ''}
                                className="amount-input"
                                readOnly
                                disabled
                            />
                        </div>
                        <button
                            type="submit"
                            className="payment-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Bayar'}
                        </button>
                    </form>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="modal-overlay" onClick={handleCancelPayment}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <div className="icon-circle">
                                <img src="/Website Assets/Logo.png" alt="Logo" />
                            </div>
                        </div>
                        <p className="modal-text">Beli {selectedService.service_name} senilai</p>
                        <h2 className="modal-amount">Rp{formatCurrency(selectedService.service_tariff)}</h2>
                        <button className="modal-confirm-btn" onClick={confirmPayment}>
                            Ya, lanjutkan Bayar
                        </button>
                        <button className="modal-cancel-btn" onClick={handleCancelPayment}>
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
                        <p className="modal-text">Pembayaran {selectedService.service_name} sebesar</p>
                        <h2 className="modal-amount">Rp{formatCurrency(selectedService.service_tariff)}</h2>
                        <p className="modal-text-bottom">berhasil!</p>
                        <button className="modal-link-btn" onClick={handleCloseSuccess}>
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            )}

            {showErrorDialog && (
                <div className="modal-overlay">
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <div className="icon-circle-error">
                                <span className="cross-icon">✕</span>
                            </div>
                        </div>
                        <p className="modal-text">Pembayaran {selectedService.service_name} sebesar</p>
                        <h2 className="modal-amount">Rp{formatCurrency(selectedService.service_tariff)}</h2>
                        <p className="modal-text-bottom">gagal</p>
                        <button className="modal-link-btn" onClick={handleCloseError}>
                            Kembali ke Beranda
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
};

export default PagePembayaran;
