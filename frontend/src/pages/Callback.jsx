import React, {useEffect} from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Callback(){
  const [sp] = useSearchParams();
  useEffect(()=>{
    const token = sp.get('token');
    if(token){
      localStorage.setItem('token', token);
      window.location.href = '/dashboard';
    }else{
      window.location.href = '/';
    }
  },[])
  return <div className="container py-5">Cargando...</div>
}
