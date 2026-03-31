import { useState, useEffect } from 'react';

function Cars() {
  const [cars, setCars] = useState([]);
  const [showAddCar, setShowAddCar] = useState(false);
  const [newCar, setNewCar] = useState({ plateNumber: '', brand: '', model: '', color: '' });
  const [loading, setLoading] = useState(true);
  const [addCarLoading, setAddCarLoading] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editCarData, setEditCarData] = useState({ id: '', plateNumber: '', brand: '', model: '', color: '' });
  const [actionLoading, setActionLoading] = useState({});
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchCars();
  }, [token]);

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

  const handleEditClick = (car) => {
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

  const handleDeleteCar = async (carId) => {
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

  return (
    <div className="section-container">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>My Cars</h2>
        <button onClick={() => setShowAddCar(!showAddCar)} className="btn-primary">
          {showAddCar ? 'Cancel' : '+ Add New Car'}
        </button>
      </div>

      {showAddCar && (
        <div className="glass-panel" style={{ marginBottom: '24px', padding: '24px' }}>
          <h3>Add New Car</h3>
          <form onSubmit={handleAddCar} className="admin-form" style={{ maxWidth: '100%', padding: 0 }}>
            <div className="form-group">
              <label>Plate Number</label>
              <input
                placeholder="Ex: ABC-1234"
                value={newCar.plateNumber}
                onChange={(e) => setNewCar({...newCar, plateNumber: e.target.value})}
                pattern="^[A-Za-z0-9 -]+$"
                title="Alphanumeric characters only"
                required
              />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input
                placeholder="Ex: Toyota"
                value={newCar.brand}
                onChange={(e) => setNewCar({...newCar, brand: e.target.value})}
                minLength={2}
                required
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input
                placeholder="Ex: Camry"
                value={newCar.model}
                onChange={(e) => setNewCar({...newCar, model: e.target.value})}
                minLength={2}
                required
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                placeholder="Ex: Silver"
                value={newCar.color}
                onChange={(e) => setNewCar({...newCar, color: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={addCarLoading}>
              {addCarLoading ? 'Adding...' : 'Add Car'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading your cars...</div>
      ) : (
        <div className="car-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {cars.length === 0 && <p className="text-secondary">No cars found. Add one to get started!</p>}
          {cars.map(car => (
            editingCar === car.id ? (
              <div key={car.id} className="glass-panel" style={{ padding: '24px' }}>
                <form onSubmit={handleUpdateCar} className="admin-form" style={{ maxWidth: '100%', padding: 0 }}>
                  <div className="form-group">
                    <label>Plate Number</label>
                    <input
                      value={editCarData.plateNumber}
                      onChange={(e) => setEditCarData({...editCarData, plateNumber: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input
                      value={editCarData.brand}
                      onChange={(e) => setEditCarData({...editCarData, brand: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input
                      value={editCarData.model}
                      onChange={(e) => setEditCarData({...editCarData, model: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      value={editCarData.color}
                      onChange={(e) => setEditCarData({...editCarData, color: e.target.value})}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
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
              <div key={car.id} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{car.brand} {car.model}</h3>
                    <p style={{ margin: '8px 0', opacity: 0.8 }}>{car.plateNumber} • {car.color}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button onClick={() => handleEditClick(car)} className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCar(car.id)} className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px', color: '#ff4d4f', borderColor: '#ff4d4f' }} disabled={actionLoading[car.id]}>
                    {actionLoading[car.id] ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default Cars;
