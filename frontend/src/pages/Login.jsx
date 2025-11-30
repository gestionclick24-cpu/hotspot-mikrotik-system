import React from 'react'

export default function Login(){
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h3 className="mb-3">Iniciar sesión</h3>
            <form onSubmit={async e=>{e.preventDefault(); const f=new FormData(e.target); const email=f.get('email'); const pass=f.get('password');
              const r = await fetch(API + '/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email, password:pass})});
              const j = await r.json(); if(j.token) localStorage.setItem('token', j.token), window.location.href='/dashboard';
            }}>
              <div className="mb-3"><label>Email</label><input name="email" className="form-control" required /></div>
              <div className="mb-3"><label>Password</label><input name="password" type="password" className="form-control" required /></div>
              <button className="btn btn-primary">Entrar</button>
            </form>

            <hr />
            <a className="btn btn-outline-dark me-2" href={API + '/auth/google'}>Entrar con Google</a>
            <a className="btn btn-outline-secondary" href={API + '/auth/apple'}>Entrar con Apple</a>
            <a className="btn btn-link" href="/plans">Ver planes</a>
          </div>
        </div>
      </div>
    </div>
  )
}
