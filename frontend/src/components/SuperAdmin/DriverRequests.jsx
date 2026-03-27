import { useEffect, useState } from "react";

function DriverRequests() {
  const [drivers, setDrivers] = useState([]);
  const [_loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState({});
  const token = localStorage.getItem("authToken");

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/superAdmin/pending-drivers`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setDrivers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveDriver = async (id) => {
    try {
      setApproveLoading(prev => ({ ...prev, [id]: true }));
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/superAdmin/approve-driver/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchDrivers();
    } catch (error) {
      console.error(error);
    } finally {
      setApproveLoading(prev => ({ ...prev, [id]: false }));
    }
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
            <div key={driver.userId} className="driver-item">
              <div>
                <strong>{driver.user.name}</strong>
                <p style={{margin: '4px 0'}}>{driver.user.email}</p>
                <p style={{margin: '4px 0'}}>DL: {driver.dlNumber}</p>
                <p style={{margin: '4px 0'}}>Parking: {driver.parkingArea.name}</p>
              </div>
              <button
                onClick={() => approveDriver(driver.userId)}
                disabled={approveLoading[driver.userId]}
              >
                {approveLoading[driver.userId] ? 'Approving...' : 'Approve'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DriverRequests;