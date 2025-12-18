import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchProfile,
    fetchBalance,
    fetchServices,
    fetchBanners,
    setCurrentSlide,
    nextSlide,
    prevSlide
} from '../../store/slices/homeSlice';
import { setSelectedService } from '../../store/slices/paymentSlice';
import FormHeader from '../FormHeader/FormHeader';
import FormProfileSection from '../FormProfileSection/FormProfileSection';
import '../PageStyles.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        profile,
        profileLoading,
        balance,
        balanceLoading,
        services,
        servicesLoading,
        banners,
        bannersLoading,
        currentSlide
    } = useSelector((state) => state.home);

    useEffect(() => {
        if (!profile.first_name && !profileLoading) {
            dispatch(fetchProfile());
        }
        if (!balanceLoading && balance === 0) {
            dispatch(fetchBalance());
        }
        if (services.length === 0 && !servicesLoading) {
            dispatch(fetchServices());
        }
        if (banners.length === 0 && !bannersLoading) {
            dispatch(fetchBanners());
        }
    }, [dispatch, profile.first_name, profileLoading, balance, balanceLoading, services.length, servicesLoading, banners.length, bannersLoading]);

    useEffect(() => {
        if (banners.length > 0) {
            const interval = setInterval(() => {
                dispatch(nextSlide());
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [banners.length, dispatch]);

    const handleNextSlide = () => {
        dispatch(nextSlide());
    };

    const handlePrevSlide = () => {
        dispatch(prevSlide());
    };

    const handleServiceClick = (service) => {
        dispatch(setSelectedService(service));
        navigate('/pembayaran');
    };

    return (
        <div className="home-page">
            <FormHeader />

            <div className="main-content">
                <FormProfileSection />

                <div className="services-section">
                    {servicesLoading ? (
                        <p>Loading services...</p>
                    ) : services.length > 0 ? (
                        services.map((service, index) => (
                            <div
                                key={index}
                                className="service-item"
                                onClick={() => handleServiceClick(service)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="service-icon">
                                    <img
                                        src={service.service_icon}
                                        alt={service.service_name}
                                        onError={(e) => {
                                            e.target.src = '/Website Assets/PBB.png';
                                        }}
                                    />
                                </div>
                                <p className="service-name">{service.service_name}</p>
                            </div>
                        ))
                    ) : (
                        <p>No services available</p>
                    )}
                </div>

                <section className="banner-section">
                    <h3 className="banner-title">Temukan promo menarik</h3>
                    {bannersLoading ? (
                        <p>Loading banners...</p>
                    ) : banners.length > 0 ? (
                        <>
                            <div className="banner-slider">
                                <button className="slider-btn prev" onClick={handlePrevSlide}>
                                    ❮
                                </button>
                                <div className="banner-container">
                                    <div
                                        className="banner-track"
                                        style={{
                                            transform: `translateX(-${currentSlide * 340}px)`,
                                        }}
                                    >
                                        {banners.map((banner, index) => (
                                            <div key={index} className="banner-slide">
                                                <img
                                                    src={banner.banner_image}
                                                    alt={banner.banner_name}
                                                    onError={(e) => {
                                                        e.target.src = '/Website Assets/Banner 1.png';
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className="slider-btn next" onClick={handleNextSlide}>
                                    ❯
                                </button>
                            </div>
                            <div className="slider-dots">
                                {banners.map((_, index) => (
                                    <span
                                        key={index}
                                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                                        onClick={() => dispatch(setCurrentSlide(index))}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p>No banners available</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
