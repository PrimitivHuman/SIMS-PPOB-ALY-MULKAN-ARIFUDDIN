import { useSelector, useDispatch } from 'react-redux';
import { toggleBalanceVisibility } from '../../store/slices/homeSlice';
import '../PageStyles.css';

const FormProfileSection = () => {
    const dispatch = useDispatch();

    const {
        profile,
        profileLoading,
        balance,
        balanceLoading,
        balanceVisible
    } = useSelector((state) => state.home);

    const handleToggleBalance = () => {
        dispatch(toggleBalanceVisibility());
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="profile-section">
            <div className="profile-info">
                <img
                    src={profile.profile_image || '/Website Assets/Profile Photo.png'}
                    alt="Profile"
                    className="profile-photo"
                    onError={(e) => {
                        e.target.src = '/Website Assets/Profile Photo.png';
                    }}
                />
                <div className="greeting">
                    <p className="greeting-text">Selamat datang,</p>
                    <h2 className="user-name">
                        {profileLoading
                            ? 'Loading...'
                            : `${profile.first_name} ${profile.last_name}`.trim() || 'User'}
                    </h2>
                </div>
            </div>

            <div className="balance-card">
                <p className="balance-label">Saldo anda</p>
                <h1 className="balance-amount">
                    {balanceLoading
                        ? 'Loading...'
                        : balanceVisible
                            ? formatCurrency(balance)
                            : 'Rp ● ● ● ● ● ● ●'
                    }
                </h1>
                <button className="toggle-balance" onClick={handleToggleBalance}>
                    {balanceVisible ? 'Tutup Saldo' : 'Lihat Saldo'} 👁
                </button>
            </div>
        </div>
    );
};

export default FormProfileSection;
