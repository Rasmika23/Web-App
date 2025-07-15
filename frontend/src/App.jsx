import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import { PlaceOrder } from './pages/PlaceOrder/PlaceOrder'

const App = ()=>{
  return(
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/cart' element={<Home/>}></Route> {/* SHOULD CHANGE THIS */}
        <Route path='/order' element={<PlaceOrder/>}></Route>
      </Routes>
    </div>
  )
}

export default App
