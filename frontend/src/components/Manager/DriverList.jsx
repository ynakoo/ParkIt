import { useEffect, useState } from 'react';

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchDrivers = async () => {
      const res = await fetch('http://localhost:3000/api/manager/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDrivers(data);
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
                <p style={{margin: '4px 0', color: '#666'}}>{driver.user.email}</p>
                <p style={{margin: '4px 0', color: '#666'}}>DL: {driver.dlNumber}</p>
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
