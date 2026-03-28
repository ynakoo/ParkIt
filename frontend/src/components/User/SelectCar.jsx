import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SelectCar() {
  const [cars, setCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({ plateNumber: '', brand: '', model: '', color: '' });
  const [loading, setLoading] = useState(true);
  const [addCarLoading, setAddCarLoading] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editCarData, setEditCarData] = useState({ id: '', plateNumber: '', brand: '', model: '', color: '' });
  const [actionLoading, setActionLoading] = useState({});
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const location = useLocation();
  const parkingArea = location.state?.parkingArea;

  useEffect(() => {
    if (!parkingArea) {
      navigate('/scan-qr', { replace: true });
      return;
    }
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cars`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      setAddCarLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCar)
      });
      if (res.ok) {
        setNewCar({ plateNumber: '', brand: '', model: '', color: '' });
        setShowAddCar(false);
        fetchCars();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to add car');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddCarLoading(false);
    }
  };

  const handleEditClick = (e, car) => {
    e.stopPropagation();
    setEditingCar(car.id);
    setEditCarData(car);
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      setActionLoading({ ...actionLoading, [editCarData.id]: true });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cars/${editCarData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editCarData)
      });
      if (res.ok) {
        setEditingCar(null);
        fetchCars();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to update car');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading({ ...actionLoading, [editCarData.id]: false });
    }
  };

  const handleDeleteCar = async (e, carId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      setActionLoading({ ...actionLoading, [carId]: true });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cars/${carId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCars();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to delete car');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading({ ...actionLoading, [carId]: false });
    }
  };

  if (!parkingArea) return null;

  return (
    <div className="select-car">
      <h2>Select Your Car</h2>
      <p style={{ marginBottom: '24px' }}>Parking at: <strong>{parkingArea.name}</strong></p>

      <button onClick={() => setShowAddCar(!showAddCar)} className="btn-secondary" style={{ marginBottom: '16px' }}>
        {showAddCar ? 'Cancel' : '+ Add New Car'}
      </button>

      {showAddCar && (
        <form onSubmit={handleAddCar} className="add-car-form" style={{ marginBottom: '24px' }}>
          <input
            placeholder="Plate Number"
            value={newCar.plateNumber}
            onChange={(e) => setNewCar({...newCar, plateNumber: e.target.value})}
            pattern="^[A-Za-z0-9 -]+$"
            title="Alphanumeric characters only"
            required
          />
          <input
            placeholder="Brand"
            value={newCar.brand}
            onChange={(e) => setNewCar({...newCar, brand: e.target.value})}
            minLength={2}
            required
          />
          <input
            placeholder="Model"
            value={newCar.model}
            onChange={(e) => setNewCar({...newCar, model: e.target.value})}
            minLength={2}
            required
          />
          <input
            placeholder="Color"
            value={newCar.color}
            onChange={(e) => setNewCar({...newCar, color: e.target.value})}
            required
          />
          <button type="submit" className="btn-primary" disabled={addCarLoading}>
            {addCarLoading ? 'Adding...' : 'Add Car'}
          </button>
        </form>
      )}

      <div className="car-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {cars.map(car => (
          editingCar === car.id ? (
            <div key={car.id} className="car-item">
              <form onSubmit={handleUpdateCar} className="add-car-form">
                <input
                  placeholder="Plate Number"
                  value={editCarData.plateNumber}
                  onChange={(e) => setEditCarData({...editCarData, plateNumber: e.target.value})}
                  pattern="^[A-Za-z0-9 -]+$"
                  title="Alphanumeric characters only"
                  required
                />
                <input
                  placeholder="Brand"
                  value={editCarData.brand}
                  onChange={(e) => setEditCarData({...editCarData, brand: e.target.value})}
                  minLength={2}
                  required
                />
                <input
                  placeholder="Model"
                  value={editCarData.model}
                  onChange={(e) => setEditCarData({...editCarData, model: e.target.value})}
                  minLength={2}
                  required
                />
                <input
                  placeholder="Color"
                  value={editCarData.color}
                  onChange={(e) => setEditCarData({...editCarData, color: e.target.value})}
                  required
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" className="btn-primary" disabled={actionLoading[car.id]}>
                    {actionLoading[car.id] ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => setEditingCar(null)} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div key={car.id} className="car-item" onClick={() => navigate('/payment', { state: { parkingArea, car } })} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4>{car.brand} {car.model}</h4>
                  <p style={{ marginTop: '4px' }}>{car.plateNumber} • {car.color}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={(e) => handleEditClick(e, car)} 
                    style={{ padding: '4px 8px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => handleDeleteCar(e, car.id)} 
                    style={{ padding: '4px 8px', background: 'transparent', border: '1px solid #ff4d4f', color: '#ff4d4f', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    disabled={actionLoading[car.id]}
                  >
                    {actionLoading[car.id] ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default SelectCar;
