import React, {useState} from 'react';
import API from '../api.jsx';

export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [step, setStep] = useState(1);

  async function sendOtp(e){ e.preventDefault(); try{ await API.post('/auth/forgot-password', { email }); alert('OTP sent (or check server logs)'); setStep(2); }catch(err){ alert(err.response?.data?.message || err.message); } }
  async function verify(e){ e.preventDefault(); try{ await API.post('/auth/verify-forgot', { email, code, newPassword: newPass }); alert('Password changed'); window.location='/signin'; }catch(err){ alert(err.response?.data?.message || err.message); } }

  return (
    <div className="container">
      {step===1 && <form onSubmit={sendOtp}>
        <h2>Forgot Password</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <button>Send OTP</button>
      </form>}
      {step===2 && <form onSubmit={verify}>
        <h2>Enter OTP & New Password</h2>
        <input placeholder="OTP" value={code} onChange={e=>setCode(e.target.value)}/>
        <input placeholder="New password" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}/>
        <button>Change Password</button>
      </form>}
    </div>
  );
}
