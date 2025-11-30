import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Callback from './pages/Callback'
import Plans from './pages/Plans'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/auth' element={<Callback />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/plans' element={<Plans />} />
      </Routes>
    </BrowserRouter>
  )
}
