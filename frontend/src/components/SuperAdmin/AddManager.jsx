import { useEffect, useState } from "react";

function AddManager() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parkingAreas, setParkingAreas] = useState([]);
  const [selectedParking, setSelectedParking] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/superAdmin/parking-areas`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        console.log(data)
        const unassigned = data.filter(area => !area.managerId);
        setParkingAreas(unassigned);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/superAdmin/managers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            email,
            password,
            parkingAreaId: selectedParking
          })
        }
      );

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    alert("Manager Created");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h2>Add Manager</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Enter manager name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Parking Area</label>
          <select
            value={selectedParking}
            onChange={(e) => setSelectedParking(e.target.value)}
            required
          >
            <option value="">Select Parking Area</option>
            {parkingAreas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Manager'}
        </button>
      </form>
    </div>
  );
}

export default AddManager;
