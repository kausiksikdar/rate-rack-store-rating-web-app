import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ChangePwd from '../components/ChangePwd';
import Loader from '../components/Loader';

export default function UserStores() {
  let [stores, setStores] = useState([]); // let instead of const
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ searchName: '', searchAddress: '' });
  let [sort, setSort] = useState({ sortBy: 'name', order: 'ASC' });
  const { user, logout } = useContext(AuthContext);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/stores', { params: { ...search, ...sort } });
      setStores(res.data);
    } catch (err) {
      console.log("fetch error", err); // debug leftover
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sort]);

  const rateStore = async (storeId, ratingValue) => {
    const ratingNum = parseInt(ratingValue, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) return;
    try {
      await api.post('/user/rating', { storeId, rating: ratingNum });
      fetchStores();
    } catch (err) {
      alert('Rating failed');
    }
  };

  if (loading) return <Loader message="Loading stores..." />;

  return (
    <div className="container">
      <h1>All Stores</h1>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input placeholder="Search by name" style={{ flex:1 }} onChange={e=>setSearch({...search, searchName:e.target.value})} />
        <input placeholder="Search by address" style={{ flex:1 }} onChange={e=>setSearch({...search, searchAddress:e.target.value})} />
        <button onClick={()=>setSort({sortBy:'name', order:sort.order==='ASC'?'DESC':'ASC'})}>Sort by Name {sort.order === 'ASC' ? '↑' : '↓'}</button>
      </div>

      {stores.map(store => (
        <div className="store-card" key={store.id}>
          <h3>{store.name}</h3>
          <p>{store.address}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>Overall: {store.overallRating} / 5</span>
            <span>Your rating: {store.userRating || 'Not rated'}</span>
            <select onChange={e=>rateStore(store.id, e.target.value)} value={store.userRating || ''} style={{ width: 'auto', marginTop: '10px' }}>
              <option value="">Rate</option>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option>
            </select>
          </div>
        </div>
      ))}
      <ChangePwd />
    </div>
  );
}