import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import './index.css'
import PageRegistration from './component/PageRegistration/PageRegistration.jsx'
import PageLogin from './component/Login/PageLogin.jsx'
import HomePage from './component/Dashboard/HomePage.jsx'
import PageTopup from './component/TopUp/PageTopup.jsx'
import PageTransaction from './component/Transaction/PageTransaction.jsx'
import PageAkunProfile from './component/Akun/PageAkunProfile.jsx'
import PagePembayaran from './component/Pembayaran/PagePembayaran.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLogin />} />
        <Route path="/login" element={<PageLogin />} />
        <Route path="/registration" element={<PageRegistration />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/topup" element={<PageTopup />} />
        <Route path="/transaction" element={<PageTransaction />} />
        <Route path="/akun" element={<PageAkunProfile />} />
        <Route path="/pembayaran" element={<PagePembayaran />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
)
