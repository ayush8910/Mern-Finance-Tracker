import React, {useState} from 'react';
import API from '../api.jsx';

export default function Signup(){
  const [form, setForm] = useState({username:'', email:'', password:''});
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/auth/signup', form);
      alert(res.data.message || 'Signup created. Check your email for OTP.');
      setStep(2);
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  }

  async function verify(e){
    e.preventDefault();
    try{
      const res = await API.post('/auth/verify-signup', { email: form.email, code });
      localStorage.setItem('token', res.data.token);
      alert('Verified and logged in');
      window.location = '/';
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="container">
      {step===1 && <form onSubmit={submit}>
        <h2>Sign Up</h2>
        <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button>Sign Up</button>
      </form>}
      {step===2 && <form onSubmit={verify}>
        <h2>Enter OTP</h2>
        <input placeholder="OTP" value={code} onChange={e=>setCode(e.target.value)}/>
        <button>Verify</button>
      </form>}
    </div>
  );
}
