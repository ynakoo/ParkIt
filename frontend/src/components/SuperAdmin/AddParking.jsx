import { useState } from "react";

function AddParking() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [amount, setAmount] = useState("");
  const [_loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/superAdmin/parking-areas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            location,
            qrCode: qrCode,
            amount: Number(amount)
          })
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    alert("Parking Area Created");
    setName("");
    setLocation("");
    setAmount("");
    setQrCode("");
  };

  return (
    <div>
      <h2>Add Parking Area</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Parking Name</label>
          <input
            placeholder="Enter parking name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>QR Code</label>
          <input
            placeholder="Enter QR code"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount per Hour</label>
          <input
            type="number"
            placeholder="Enter hourly rate"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Parking Area</button>
      </form>
    </div>
  );
}

export default AddParking;