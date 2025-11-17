import React, {useState} from 'react';
import API from '../api.jsx';

export default function Signin(){
  const [form, setForm] = useState({email:'', password:''});

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/auth/signin', form);
      localStorage.setItem('token', res.data.token);
      alert('Signed in');
      window.location = '/';
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button>Sign In</button>
      </form>
      <a href="/forgot">Forgot password?</a>
    </div>
  );
}
