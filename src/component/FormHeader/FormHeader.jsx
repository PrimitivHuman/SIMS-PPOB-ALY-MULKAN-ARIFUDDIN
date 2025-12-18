import { Link, useLocation } from 'react-router-dom';
import '../PageStyles.css';

const FormHeader = () => {
    const location = useLocation();

    return (
        <header className="header">
            <div className="header-logo">
                <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/Website Assets/Logo.png" alt="Logo" />
                    <span className="brand-name">SIMS PPOB</span>
                </Link>
            </div>
            <nav className="header-nav">
                <Link
                    to="/topup"
                    className={`menu-link ${location.pathname === '/topup' ? 'active' : ''}`}
                >
                    Top Up
                </Link>
                <Link
                    to="/transaction"
                    className={`menu-link ${location.pathname === '/transaction' ? 'active' : ''}`}
                >
                    Transaction
                </Link>
                <Link
                    to="/akun"
                    className={`menu-link ${location.pathname === '/akun' ? 'active' : ''}`}
                >
                    Akun
                </Link>
            </nav>
        </header>
    );
};

export default FormHeader;
