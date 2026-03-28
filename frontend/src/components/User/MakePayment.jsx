import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function MakePayment() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const location = useLocation();
  const parkingArea = location.state?.parkingArea;
  const car = location.state?.car;

  if (!parkingArea || !car) {
    return (
      <div className="make-payment">
        <p>Missing parking or car data.</p>
        <button onClick={() => navigate('/scan-qr')} className="btn-primary">Go to Parking</button>
      </div>
    );
  }

  const hourlyRate = parseFloat(parkingArea.amount);
  const estimatedHours = 2;
  const subtotal = hourlyRate * estimatedHours;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          carId: car.id,
          parkingAreaId: parkingArea.id
        })
      });
      const ticket = await res.json();
      navigate('/ticket', { state: { ticket }, replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="make-payment">
      <h2>Payment Summary</h2>

      <div className="payment-details">
        <div className="detail-section">
          <h3>Parking Details</h3>
          <p><strong>Location:</strong> {parkingArea.name}</p>
          <p><strong>Address:</strong> {parkingArea.location}</p>
        </div>

        <div className="detail-section">
          <h3>Vehicle Details</h3>
          <p><strong>Car:</strong> {car.brand} {car.model}</p>
          <p><strong>Plate:</strong> {car.plateNumber}</p>
        </div>

        <div className="detail-section">
          <h3>Price Breakdown</h3>
          <div className="price-row">
            <span>Hourly Rate:</span>
            <span>₹{hourlyRate.toFixed(2)}/hr</span>
          </div>
          <div className="price-row">
            <span>Estimated Duration:</span>
            <span>{estimatedHours} hours</span>
          </div>
          <div className="price-row">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span>Tax (10%):</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="price-row total">
            <span><strong>Total:</strong></span>
            <span><strong>₹{total.toFixed(2)}</strong></span>
          </div>
        </div>
      </div>

      <button onClick={handlePayment} className="btn-pay shadow-hover" disabled={loading}>
        {loading ? (
          <span className="flex-center">
            <span className="spinner"></span> Processing...
          </span>
        ) : (
          <>
            <span className="pay-text">Confirm & Pay Securely</span>
            <span className="pay-amount">₹{total.toFixed(2)}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default MakePayment;
