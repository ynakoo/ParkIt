import { useEffect, useState } from "react";

function DriverRequests() {
  const [drivers, setDrivers] = useState([]);
  const token = localStorage.getItem("authToken");

  const fetchDrivers = async () => {
    const res = await fetch(
      "http://localhost:3000/api/superAdmin/pending-drivers",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();
    setDrivers(data);
  };

  const approveDriver = async (id) => {
    await fetch(
      `http://localhost:3000/api/superAdmin/approve-driver/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchDrivers();
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div>
      <h2>Pending Driver Requests</h2>
      <div className="driver-list">
        {drivers.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          drivers.map((driver) => (
            <div key={driver.id} className="driver-item">
              <div>
                <strong>{driver.name}</strong>
                <p style={{margin: '4px 0', color: '#666'}}>{driver.email}</p>
              </div>
              <button onClick={() => approveDriver(driver.id)}>
                Approve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverRequests;