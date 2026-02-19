import { useState } from "react";
import ParkingList from "./ParkingList";
import DriverRequests from "./DriverRequests";
import AddManager from "./AddManager";
import AddParking from "./AddParking";
import Profile from "./Profile";
import "./admin.css";

function SuperAdminDashboard() {
  const [section, setSection] = useState("DASHBOARD");
  const [selectedParking, setSelectedParking] = useState(null);

  const renderSection = () => {
    switch (section) {
      case "DASHBOARD":
        return (
          <ParkingList
            onSelect={(area) => {
              setSelectedParking(area);
              setSection("DETAILS");
            }}
          />
        );

      case "DETAILS":
        return (
          <ParkingDetails
            area={selectedParking}
            onBack={() => setSection("DASHBOARD")}
          />
        );

      case "DRIVER_REQUESTS":
        return <DriverRequests />;

      case "ADD_MANAGER":
        return <AddManager />;

      case "ADD_PARKING":
        return <AddParking />;

      case "PROFILE":
        return <Profile />;

      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h3>🅿️ ParkIt Admin</h3>
        <p onClick={() => setSection("DASHBOARD")}>📊 Dashboard</p>
        <p onClick={() => setSection("ADD_MANAGER")}>👤 Add Manager</p>
        <p onClick={() => setSection("ADD_PARKING")}>🅿️ Add Parking</p>
        <p onClick={() => setSection("DRIVER_REQUESTS")}>🚗 Driver Requests</p>
        <p onClick={() => setSection("PROFILE")}>⚙️ Profile</p>
      </div>

      <div className="admin-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
