import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  let [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.length < 20) {
      setError('Name must be at least 20 characters');
      return;
    }
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      console.log("reg error", err); // debug
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h1>Create Account</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Full Name (20-60 chars)</label>
          <input name="name" onChange={handleChange} required />
          {form.name && form.name.length < 20 && <small style={{color:'red'}}>Min 20 chars</small>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address (max 400)</label>
          <textarea name="address" maxLength="400" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password (8-16, 1 upper, 1 special)</label>
          <input name="password" type="password" pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" onChange={handleChange}>
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
        {error && <p style={{color:'red', marginTop:'15px'}}>{error}</p>}
      </form>
    </div>
  );
}