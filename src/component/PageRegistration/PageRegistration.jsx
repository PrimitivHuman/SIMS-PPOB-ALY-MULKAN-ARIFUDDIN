import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateFormField,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    registerUser,
    resetForm
} from '../../store/slices/registrationSlice';
import '../PageStyles.css';

const LOGO_PATH = '/Website Assets/Logo.png';
const ILLUSTRATION_PATH = '/Website Assets/Illustrasi Login.png';

const PageRegistration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { formData, showPassword, showConfirmPassword, loading, error, registrationSuccess } = useSelector(
        (state) => state.registration
    );
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateFormField({ name, value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateField = (name, value) => {
        let error = '';
        if (!value || value.trim() === '') {
            switch (name) {
                case 'email':
                    error = 'Email harus diisi';
                    break;
                case 'firstName':
                    error = 'Nama depan harus diisi';
                    break;
                case 'lastName':
                    error = 'Nama belakang harus diisi';
                    break;
                case 'password':
                    error = 'Password harus diisi';
                    break;
                case 'confirmPassword':
                    error = 'Konfirmasi password harus diisi';
                    break;
                default:
                    break;
            }
        } else if (name === 'password' && value.length < 8) {
            error = 'Password minimal 8 karakter';
        } else if (name === 'confirmPassword' && value !== formData.password) {
            error = 'Password tidak cocok';
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            email: validateField('email', formData.email),
            firstName: validateField('firstName', formData.firstName),
            lastName: validateField('lastName', formData.lastName),
            password: validateField('password', formData.password),
            confirmPassword: validateField('confirmPassword', formData.confirmPassword)
        };

        setValidationErrors(errors);

        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
            return;
        }

        dispatch(registerUser());
    };

    useEffect(() => {
        if (registrationSuccess) {
            setShowToast(true);

            const timer = setTimeout(() => {
                setShowToast(false);
                dispatch(resetForm());
                navigate('/login');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [registrationSuccess, navigate, dispatch]);

    return (
        <div className="registration-container">
            <div className="left-panel">
                <div className="form-wrapper">
                    <div className="logo-header">
                        <img src={LOGO_PATH} alt="SIMS PPOB Logo" className="logo-icon" />
                        <span className="app-title">SIMS PPOB</span>
                    </div>

                    <h2 className="page-title">
                        Lengkapi data untuk<br />membuat akun
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <span className="input-icon">@</span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="masukan email anda"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                                />
                            </div>
                            {validationErrors.email && (
                                <span className="error-message">{validationErrors.email}</span>
                            )}
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="nama depan"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-input ${validationErrors.firstName ? 'input-error' : ''}`}
                                />
                            </div>
                            {validationErrors.firstName && (
                                <span className="error-message">{validationErrors.firstName}</span>
                            )}
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="nama belakang"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-input ${validationErrors.lastName ? 'input-error' : ''}`}
                                />
                            </div>
                            {validationErrors.lastName && (
                                <span className="error-message">{validationErrors.lastName}</span>
                            )}
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="buat password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
                                />
                                <div
                                    className="password-toggle"
                                    onClick={() => dispatch(togglePasswordVisibility())}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {validationErrors.password && (
                                <span className="error-message">{validationErrors.password}</span>
                            )}
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="konfirmasi password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                                />
                                <div
                                    className="password-toggle"
                                    onClick={() => dispatch(toggleConfirmPasswordVisibility())}
                                >
                                    {showConfirmPassword ? (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {validationErrors.confirmPassword && (
                                <span className="error-message">{validationErrors.confirmPassword}</span>
                            )}
                        </div>

                        {error && (
                            <div style={{
                                color: '#f44336',
                                fontSize: '14px',
                                marginTop: '10px',
                                textAlign: 'center'
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                            style={{
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? 'Memproses...' : 'Registrasi'}
                        </button>
                    </form>

                    <div className="login-link">
                        sudah punya akun? <span className="login-text-highlight" onClick={() => navigate('/login')}>login di sini</span>
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <img src={ILLUSTRATION_PATH} alt="Illustration" className="illustration-img" />
            </div>

            {showToast && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-icon">✓</span>
                        <span className="toast-message">Registrasi berhasil! Silakan login</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageRegistration;
