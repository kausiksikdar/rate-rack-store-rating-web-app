import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ChangePwd() {
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [msg, setMsg] = useState('');
  const { updatePassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(oldPwd, newPwd);
      setMsg('Password changed!');
      setOldPwd('');
      setNewPwd('');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to update');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
      <h3>Change Password</h3>
      <input type="password" placeholder="Old password" value={oldPwd} onChange={e=>setOldPwd(e.target.value)} required />
      <input type="password" placeholder="New password (8-16, 1 uppercase, 1 special)" value={newPwd} onChange={e=>setNewPwd(e.target.value)} required />
      <button type="submit">Update</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}