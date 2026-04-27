import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import ChangePwd from '../components/ChangePwd';
import Loader from '../components/Loader';

export default function OwnerDashboard() {
  let [stores, setStores] = useState([]); // let instead of const
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get('/owner/dashboard');
        setStores(res.data);
      } catch (err) {
        console.log("dashboard error", err); // debug left
        alert('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="container">
      <h1>Store Owner Dashboard</h1>

      {stores.length === 0 ? (
        <p>You don't own any stores. Contact admin.</p>
      ) : (
        stores.map(store => (
          <div key={store.id} className="store-card" style={{ marginBottom: '30px' }}>
            <h2>{store.name}</h2>
            <p>{store.address}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4361ee' }}>
              Average Rating: {store.averageRating} / 5
            </p>

            <h3>Users who rated this store:</h3>
            {!store.users.length ? (
              <p>No ratings yet.</p>
            ) : (
              <div className="table-wrapper">
                <table border="1">
                  <thead>
                    <tr><th>Name</th><th>Rating (avg)</th></tr>
                  </thead>
                  <tbody>
                    {store.users.map((u, idx) => (
                      <tr key={idx}>
                        <td>{u.name}</td>
                        <td>{u.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
      <ChangePwd />
    </div>
  );
}