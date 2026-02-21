import { useState, useEffect } from 'react';

function SelectCar({ onBack, parkingArea, onCarSelected }) {
  const [cars, setCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({ plateNumber: '', brand: '', model: '', color: '' });
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await fetch('http://localhost:3000/api/user/cars', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCars(data);
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/api/user/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newCar)
    });
    setNewCar({ plateNumber: '', brand: '', model: '', color: '' });
    setShowAddCar(false);
    fetchCars();
  };

  return (
    <div className="select-car">
      <button onClick={onBack} className="btn-back">← Back</button>
      <h2>Select Your Car</h2>
      <p>Parking at: {parkingArea.name}</p>

      <div className="car-list">
        {cars.map(car => (
          <div key={car.id} className="car-item" onClick={() => onCarSelected(car)}>
            <h4>{car.brand} {car.model}</h4>
            <p>{car.plateNumber} - {car.color}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAddCar(!showAddCar)} className="btn-secondary">
        + Add New Car
      </button>

      {showAddCar && (
        <form onSubmit={handleAddCar} className="add-car-form">
          <input
            placeholder="Plate Number"
            value={newCar.plateNumber}
            onChange={(e) => setNewCar({...newCar, plateNumber: e.target.value})}
            required
          />
          <input
            placeholder="Brand"
            value={newCar.brand}
            onChange={(e) => setNewCar({...newCar, brand: e.target.value})}
            required
          />
          <input
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({...newCar, model: e.target.value})}
            required
          />
          <input
            placeholder="Color"
            value={newCar.color}
            onChange={(e) => setNewCar({...newCar, color: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary">Add Car</button>
        </form>
      )}
    </div>
  );
}

export default SelectCar;
