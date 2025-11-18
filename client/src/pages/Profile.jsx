import React, { useEffect, useState } from 'react';
import API from '../api.jsx';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [pwd, setPwd] = useState({ oldPassword: '', newPassword: '', otp: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  async function load() {
    try {
      const res = await API.get('/profile');
      setUser(res.data);
      setForm({ username: res.data.username, email: res.data.email });
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location = '/signin';
      }
    }
  }

  async function requestOtp() {
    await API.post('/profile/request-otp');
    alert('OTP sent to your email');
    setOtpSent(true);
  }

  async function save(e) {
    e.preventDefault();
    try {
      await API.put('/profile/update', { ...form, otp });
      alert('Updated');
      setEditing(false);
      setOtp('');
      setOtpSent(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  async function changePwd(e) {
    e.preventDefault();
    try {
      await API.post('/profile/change-password', pwd);
      alert('Password updated');
      setPwd({ oldPassword: '', newPassword: '', otp: '' });
      setOtpSent(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    alert("Logged out");
    window.location = "/signin";
  }

  useEffect(() => {
    load();
  }, []);

  if (!user) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded-lg shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded-xl">
        <div className="mb-4">
          <label className="font-semibold">Username:</label>
          {editing ? (
            <input
              className="border px-2 py-1 w-full"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
            />
          ) : (
            <div>{user.username}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="font-semibold">Email:</label>
          {editing ? (
            <input
              className="border px-2 py-1 w-full"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          ) : (
            <div>{user.email}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="font-semibold">Password:</label>
          <div>********</div>
        </div>

        {otpSent && editing && (
          <input
            className="border px-2 py-1 w-full mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
        )}

        {editing && (
          <button
            onClick={requestOtp}
            className="bg-purple-600 text-white px-3 py-1 rounded mb-3"
          >
            Get OTP
          </button>
        )}

        {editing ? (
          <button onClick={save} className="bg-blue-600 text-white px-3 py-1 rounded">
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-gray-700 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        )}
      </div>

      <h3 className="text-xl mt-6 mb-2 font-bold">Change Password</h3>
      <form onSubmit={changePwd} className="bg-white shadow p-4 rounded-xl space-y-3">
        <input
          className="border px-2 py-1 w-full"
          placeholder="Old password"
          type="password"
          value={pwd.oldPassword}
          onChange={e => setPwd({ ...pwd, oldPassword: e.target.value })}
        />
        <input
          className="border px-2 py-1 w-full"
          placeholder="New password"
          type="password"
          value={pwd.newPassword}
          onChange={e => setPwd({ ...pwd, newPassword: e.target.value })}
        />
        <input
          className="border px-2 py-1 w-full"
          placeholder="OTP"
          value={pwd.otp}
          onChange={e => setPwd({ ...pwd, otp: e.target.value })}
        />

        <div className="flex gap-2">
          <button
            onClick={requestOtp}
            type="button"
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            Get OTP
          </button>

          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
