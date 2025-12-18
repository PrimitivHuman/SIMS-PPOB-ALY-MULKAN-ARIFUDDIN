import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateFormField,
    togglePasswordVisibility,
    loginUser,
    resetForm
} from '../../store/slices/loginSlice';
import '../PageStyles.css';

const LOGO_PATH = '/Website Assets/Logo.png';
const ILLUSTRATION_PATH = '/Website Assets/Illustrasi Login.png';

const PageLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { formData, showPassword, loading, error, isAuthenticated } = useSelector(
        (state) => state.login
    );
    const [validationErrors, setValidationErrors] = useState({
        email: '',
        password: ''
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
                case 'password':
                    error = 'Password harus diisi';
                    break;
                default:
                    break;
            }
        } else if (name === 'password' && value.length < 8) {
            error = 'Password minimal 8 karakter';
        }
        return error;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setValidationErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password)
        };

        setValidationErrors(errors);

        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
            return;
        }

        dispatch(loginUser());
    };

    useEffect(() => {
        if (isAuthenticated) {
            setShowToast(true);

            const timer = setTimeout(() => {
                setShowToast(false);
                dispatch(resetForm());
                navigate('/home');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, navigate, dispatch]);

    return (
        <div className="login-container">
            <div className="left-panel">
                <div className="form-wrapper">
                    <div className="logo-header">
                        <img src={LOGO_PATH} alt="SIMS PPOB Logo" className="logo-icon" />
                        <span className="app-title">SIMS PPOB</span>
                    </div>

                    <h2 className="page-title">
                        Masuk atau buat akun<br />untuk memulai
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
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="masukan password anda"
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
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>

                    <div className="login-link">
                        belum punya akun? registrasi <span className="login-text-highlight" onClick={() => navigate('/registration')}>di sini</span>
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
                        <span className="toast-message">Login berhasil!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PageLogin;
