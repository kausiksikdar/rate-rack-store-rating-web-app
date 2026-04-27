import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  let [email, setEmail] = useState('');
  let [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, pwd);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'user') navigate('/user');
      else navigate('/owner');
    } catch (error) {
      console.log("login failed", error); // debug
      setErr('Invalid credentials');
    }
  };

  return (
    <div className="container">
      <h1>Sign In</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {err && <p style={{color:'red', marginTop:'15px'}}>{err}</p>}
      </form>
      <p style={{marginTop:'20px'}}>No account? <a href="/register">Register here</a></p>
    </div>
  );
}