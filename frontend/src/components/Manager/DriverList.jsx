import { useEffect, useState } from 'react';

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [_loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/manager/drivers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setDrivers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  return (
    <div>
      <h2>All Drivers</h2>
      <div className="driver-list">
        {drivers.length === 0 ? (
          <p>No drivers added yet</p>
        ) : (
          drivers.map((driver) => (
            <div key={driver.userId} className="driver-item">
              <div>
                <strong>{driver.user.name}</strong>
                <p style={{margin: '4px 0'}}>{driver.user.email}</p>
                <p style={{margin: '4px 0'}}>DL: {driver.dlNumber}</p>
              </div>
              <span className={`status-badge ${driver.status.toLowerCase()}`}>
                {driver.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverList;
