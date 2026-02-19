import { useEffect, useState } from "react";

function ParkingList({ onSelect }) {
  const [parkingAreas, setParkingAreas] = useState([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchParking = async () => {
      const res = await fetch(
        "http://localhost:3000/api/superAdmin/parking-areas",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setParkingAreas(data);
    };

    fetchParking();
  }, []);

  return (
    <div>
      <h2>All Parking Areas</h2>
      <div className="parking-grid">
        {parkingAreas.map((area) => (
          <div key={area.id} className="parking-card">
            <h3>{area.name}</h3>
            <p>📍 Location: {area.location}</p>
            <p>👤 Manager: {area.user?.name || "Not Assigned"}</p>
            <p>💵 Rate: ${area.amount}/hr</p>
            <button onClick={() => onSelect(area)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingList;
