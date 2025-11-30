import React, {useEffect} from 'react'

export default function Dashboard(){
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const token = localStorage.getItem('token')
  useEffect(()=>{ if(!token) window.location.href='/' },[])
  async function addUser(){
    const username = prompt('username');
    const password = prompt('password');
    const res = await fetch(API + '/mikrotik/user', { method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + token}, body: JSON.stringify({ username, password }) });
    alert((await res.json())?.ok ? 'creado' : 'error');
  }
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Hotspot Admin</h3>
        <div>
          <button className="btn btn-danger" onClick={()=>{ localStorage.removeItem('token'); window.location.href='/'}}>Salir</button>
        </div>
      </div>
      <div className="card p-3">
        <button className="btn btn-primary" onClick={addUser}>Crear usuario Hotspot</button>
      </div>
    </div>
  )
}
