import React, {useEffect, useState} from 'react'

export default function Plans(){
  const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const [plans, setPlans] = useState([])
  const [email, setEmail] = useState('')
  useEffect(()=>{ fetch(API + '/plans').then(r=>r.json()).then(setPlans) },[])
  async function pay(plan){
    const res = await fetch(API + '/api/mp/create_preference', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan_id: plan.id, payer_email: email })});
    const j = await res.json();
    if(j.init_point) window.location.href = j.init_point;
    else alert('error creando preferencia');
  }
  return (
    <div className="container py-5">
      <h3>Planes</h3>
      <div className="mb-3"><label>Tu email (para el pago)</label><input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div className="row">
        {plans.map(p=>(
          <div className="col-md-4" key={p.id}>
            <div className="card p-3 mb-3">
              <h5>{p.name}</h5>
              <p>Precio: {(p.price_cents/100).toFixed(2)}</p>
              <p>Duración: {p.duration_days} día(s)</p>
              <button className="btn btn-success" onClick={()=>pay(p)}>Pagar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
