import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ChangePwd from '../components/ChangePwd';
import Loader from '../components/Loader';

export default function AdminPanel() {
  const { logout } = useContext(AuthContext);

  // state variables
  const [stats, setStats] = useState({});
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [storeOwners, setStoreOwners] = useState([]);

  const [storeFilter, setStoreFilter] = useState({ name: '', address: '' });
  const [userFilter, setUserFilter] = useState({ name: '', email: '', address: '', role: '' });
  let [storeSort, setStoreSort] = useState({ sortBy: 'name', order: 'ASC' }); // var style
  const [userSort, setUserSort] = useState({ sortBy: 'name', order: 'ASC' });

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', owner_id: '' });

  const [loading, setLoading] = useState(true); // single flag

  // load everything - sometimes fails, console log left
  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/stores', { params: { ...storeFilter, ...storeSort } }),
      api.get('/admin/users', { params: { ...userFilter, ...userSort } }),
      api.get('/admin/users', { params: { role: 'store_owner' } })
    ]).then(([statsRes, storesRes, usersRes, ownersRes]) => {
      setStats(statsRes.data);
      setStores(storesRes.data);
      setUsers(usersRes.data);
      setStoreOwners(ownersRes.data);
      setLoading(false);
    }).catch(err => {
      console.log("error loading", err); // debug leftover
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAll();
  }, [storeFilter, storeSort, userFilter, userSort]);

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', newUser);
      fetchAll(); // refresh everything, not ideal but works
      setNewUser({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  const addStore = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/stores', newStore);
      fetchAll();
      setNewStore({ name: '', email: '', address: '', owner_id: '' });
      alert('Store added');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };

  if (loading) return <Loader message="Loading..." />;

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      {/* stats row */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="store-card" style={{ flex: 1, textAlign: 'center' }}>
          <strong>Total Users</strong><br/>{stats.totalUsers || 0}
        </div>
        <div className="store-card" style={{ flex: 1, textAlign: 'center' }}>
          <strong>Total Stores</strong><br/>{stats.totalStores || 0}
        </div>
        <div className="store-card" style={{ flex: 1, textAlign: 'center' }}>
          <strong>Total Ratings</strong><br/>{stats.totalRatings || 0}
        </div>
      </div>

      {/* add user form */}
      <h2>Add User</h2>
      <form onSubmit={addUser}>
        <div class="form-group"><input placeholder="Name (20-60)" value={newUser.name} onChange={e=>setNewUser({...newUser, name:e.target.value})} required minLength="20" maxLength="60" /></div>
        <div class="form-group"><input placeholder="Email" type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email:e.target.value})} required /></div>
        <div class="form-group"><input placeholder="Password (8-16, upper, special)" value={newUser.password} onChange={e=>setNewUser({...newUser, password:e.target.value})} required pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$" /></div>
        <div class="form-group"><textarea placeholder="Address max 400" maxLength="400" value={newUser.address} onChange={e=>setNewUser({...newUser, address:e.target.value})} /></div>
        <div class="form-group">
          <select value={newUser.role} onChange={e=>setNewUser({...newUser, role:e.target.value})}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>

      {/* add store form */}
      <h2>Add Store</h2>
      <form onSubmit={addStore}>
        <div class="form-group"><input placeholder="Store Name" value={newStore.name} onChange={e=>setNewStore({...newStore, name:e.target.value})} required /></div>
        <div class="form-group"><input placeholder="Store Email" type="email" value={newStore.email} onChange={e=>setNewStore({...newStore, email:e.target.value})} required /></div>
        <div class="form-group"><input placeholder="Store Address" value={newStore.address} onChange={e=>setNewStore({...newStore, address:e.target.value})} required /></div>
        <div class="form-group">
          <select value={newStore.owner_id} onChange={e=>setNewStore({...newStore, owner_id: e.target.value})}>
            <option value="">-- Assign to Store Owner (optional) --</option>
            {storeOwners.map(owner => (
              <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
            ))}
          </select>
        </div>
        <button type="submit">Create Store</button>
      </form>

      <hr />

      <h2>Stores List</h2>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input placeholder="Filter name" style={{ flex:1 }} onChange={e=>setStoreFilter({...storeFilter, name:e.target.value})} />
        <input placeholder="Filter address" style={{ flex:1 }} onChange={e=>setStoreFilter({...storeFilter, address:e.target.value})} />
        <button onClick={()=>setStoreSort({sortBy:'name', order:storeSort.order==='ASC'?'DESC':'ASC'})}>Sort by Name {storeSort.order === 'ASC' ? '↑' : '↓'}</button>
      </div>
      <div className="table-wrapper">
        <table border="1">
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
          <tbody>
            {stores.map(s => (
              <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{s.rating}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Users List</h2>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Filter name" style={{ flex:1 }} onChange={e=>setUserFilter({...userFilter, name:e.target.value})} />
        <input placeholder="Filter email" style={{ flex:1 }} onChange={e=>setUserFilter({...userFilter, email:e.target.value})} />
        <input placeholder="Filter address" style={{ flex:1 }} onChange={e=>setUserFilter({...userFilter, address:e.target.value})} />
        <select onChange={e=>setUserFilter({...userFilter, role:e.target.value})} style={{ padding: '0 12px' }}>
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button onClick={()=>setUserSort({sortBy:'name', order:userSort.order==='ASC'?'DESC':'ASC'})}>Sort by Name {userSort.order === 'ASC' ? '↑' : '↓'}</button>
      </div>
      <div className="table-wrapper">
        <table border="1">
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Rating (if owner)</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td><td>{u.rating || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChangePwd />
    </div>
  );
}