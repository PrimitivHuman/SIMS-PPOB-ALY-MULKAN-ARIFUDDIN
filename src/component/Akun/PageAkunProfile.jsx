import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfileImage, updateProfile } from '../../store/slices/profileSlice';
import { logout } from '../../store/slices/loginSlice';
import { useNavigate } from 'react-router-dom';
import FormHeader from '../FormHeader/FormHeader';
import '../PageStyles.css';

const PageAkunProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: profile, loading } = useSelector((state) => state.profile);

    const [profileData, setProfileData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        profileImage: ''
    });

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setProfileData({
                email: profile.email || '',
                firstName: profile.first_name || '',
                lastName: profile.last_name || '',
                profileImage: (profile.profile_image && profile.profile_image !== 'null')
                    ? profile.profile_image
                    : '/Website Assets/Profile Photo.png'
            });
        }
    }, [profile]);
    const [isEditing, setIsEditing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToastNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        setShowLogoutConfirm(false);
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(updateProfile({
                first_name: profileData.firstName,
                last_name: profileData.lastName
            })).unwrap();

            showToastNotification('Profil berhasil diperbarui!', 'success');
            setIsEditing(false);
            dispatch(getProfile());
        } catch (error) {
            showToastNotification(error || 'Gagal mengupdate profil', 'error');
        }
    };

    const handleEditPhoto = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 100 * 1024) {
                showToastNotification('Ukuran file maksimal 100KB', 'error');
                return;
            }

            if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
                showToastNotification('Format file harus PNG atau JPEG', 'error');
                return;
            }

            try {
                const objectUrl = URL.createObjectURL(file);
                setProfileData(prev => ({ ...prev, profileImage: objectUrl }));

                await dispatch(updateProfileImage(file)).unwrap();
                await dispatch(getProfile());

                setTimeout(() => {
                    showToastNotification('Foto profil berhasil diperbarui', 'success');
                }, 50);
            } catch (error) {
                showToastNotification(error || 'Gagal mengupdate foto profil', 'error');
                dispatch(getProfile());
            }
        }
    };

    return (
        <div className="profile-page">
            <FormHeader />

            <div className="main-content">
                <div className="profile-container">
                    <div className="profile-photo-wrapper">
                        <img
                            src={profileData.profileImage}
                            alt="Profile"
                            className="profile-photo-large"
                            onError={(e) => {
                                e.target.src = '/Website Assets/Profile Photo.png';
                            }}
                        />
                        <button className="edit-photo-btn" onClick={handleEditPhoto}>
                            <img src="/pencil.png" alt="Edit" style={{ width: '14px', height: '14px' }} />
                        </button>
                        <input
                            type="file"
                            id="fileInput"
                            accept=".png, .jpeg, .jpg"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>

                    <h2 className="profile-name">
                        {profile?.first_name} {profile?.last_name}
                    </h2>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <img src="/@.png" alt="Email" style={{ width: '16px', height: '16px' }} />
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nama Depan</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <img src="/user.png" alt="User" style={{ width: '16px', height: '16px' }} />
                                </span>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nama Belakang</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <img src="/user.png" alt="User" style={{ width: '16px', height: '16px' }} />
                                </span>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                        </div>

                        {isEditing ? (
                            <>
                                <button type="submit" className="primary-btn">
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    className="outline-btn"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setProfileData({
                                            email: profile?.email || '',
                                            firstName: profile?.first_name || '',
                                            lastName: profile?.last_name || '',
                                            profileImage: profile?.profile_image || '/Website Assets/Profile Photo.png'
                                        });
                                    }}
                                >
                                    Batalkan
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="outline-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing(true);
                                }}
                            >
                                Edit Profil
                            </button>
                        )}
                    </form>

                    {!isEditing && (
                        <div className="logout-container">
                            <button
                                className="primary-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {showLogoutConfirm && (
                    <div className="modal-overlay" onClick={cancelLogout}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-icon">
                                <div className="icon-circle">
                                    <img src="/Website Assets/Logo.png" alt="Logo" />
                                </div>
                            </div>
                            <p className="modal-text">Apakah anda yakin untuk Logout?</p>
                            <button className="text-btn" onClick={confirmLogout}>
                                Ya
                            </button>
                            <button className="text-btn" onClick={cancelLogout}>
                                Batalkan
                            </button>
                        </div>
                    </div>
                )}

                {toast.show && (
                    <div className="toast-notification">
                        <div className={`toast-content ${toast.type}`}>
                            <span className="toast-icon">
                                {toast.type === 'success' ? '✓' : '✕'}
                            </span>
                            <span className="toast-message">{toast.message}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default PageAkunProfile;
