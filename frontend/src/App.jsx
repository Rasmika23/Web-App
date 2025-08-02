import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import { PlaceOrder } from './pages/PlaceOrder/PlaceOrder'
import { Footer } from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Cart from './pages/Cart/Cart'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'

const App = () => {

  const [showLogin,setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} setShowForgotPassword={setShowForgotPassword} /> : <></>}
    {showForgotPassword?<ForgotPassword setShowForgotPassword={setShowForgotPassword} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='/order' element={<PlaceOrder />}></Route>
          <Route path='/verify' element={<Verify />}></Route>
          <Route path='/myorders' element={<MyOrders />}></Route>
          <Route path='/reset-password/:token' element={<ResetPassword />}></Route>
        </Routes>
      </div>
      <Footer />
    </>


  )
}

export default App
