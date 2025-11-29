import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:5000/api/flights';

function FlightManagement() {
  const { user, token, logout } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFlight, setNewFlight] = useState({
   flight_number: '',
   departure_city: '',
   arrival_city: '',
   departure_time: '', 
   arrival_time: '',
   price: '' 
});

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchFlights();
    }
  }, [user]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Gagal memuat daftar penerbangan');
      const data = await response.json();
      setFlights(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Tambahkan Penerbangan Baru
  const handleCreateFlight = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newFlight),
      });
      if (!res.ok) throw new Error('Gagal menambah penerbangan');
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Penerbangan baru berhasil ditambahkan.',
        timer: 2000,
        showConfirmButton: false
      });

      setNewFlight({ flight_number: '', departure_city: '', arrival_city: '', departure_time: '', arrival_time: '', price: '' });
      fetchFlights();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal!',
        text: err.message,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Mulai Edit
  const startEditing = (flight) => {
    setEditingId(flight.id);
    setEditForm({
      flight_number: flight.flight_number,
      departure_city: flight.departure_city,
      arrival_city: flight.arrival_city,
      departure_time: new Date(flight.departure_time).toISOString().slice(0, 16),
      arrival_time: new Date(flight.arrival_time).toISOString().slice(0, 16),
      price: flight.price
    });
  };

  // ✅ Batal Edit
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  // ✅ Simpan Perubahan (Update)
  const handleUpdateFlight = async (id) => {
    const result = await Swal.fire({
      title: 'Simpan Perubahan?',
      text: 'Apakah Anda yakin ingin menyimpan perubahan jadwal ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Simpan',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(editForm),
        });
        if (!res.ok) throw new Error('Gagal memperbarui penerbangan');

        Swal.fire({
          icon: 'success',
          title: 'Disimpan!',
          text: 'Jadwal penerbangan berhasil diperbarui.',
          timer: 2000,
          showConfirmButton: false
        });

        setEditingId(null);
        setEditForm({});
        fetchFlights();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.message,
        });
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Hapus Penerbangan
  const handleDeleteFlight = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Penerbangan?',
      text: 'Tindakan ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE',
          headers: authHeaders,
        });
        if (!res.ok) throw new Error('Gagal menghapus penerbangan');

        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Penerbangan berhasil dihapus.',
          timer: 2000,
          showConfirmButton: false
        });

        fetchFlights();
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: err.message,
        });
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-10 text-center">Akses ditolak.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Penerbangan</h1>
      </div>

      {error && <div className="p-4 mb-4 text-red-500 bg-red-100 rounded">Error: {error}</div>}

      {/* Form Tambah */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Penerbangan Baru</h2>
        <form onSubmit={handleCreateFlight} className="space-y-4">
          <input
            type="text"
            name="flight_number"
            placeholder="Nomor Penerbangan"
            value={newFlight.flight_number}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="departure_city"
            placeholder="Kota Keberangkatan"
            value={newFlight.departure_city}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="arrival_city"
            placeholder="Kota Tujuan"
            value={newFlight.arrival_city}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="datetime-local"
            name="departure_time"
            value={newFlight.departure_time}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="datetime-local"
            name="arrival_time"
            value={newFlight.arrival_time}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Harga"
            value={newFlight.price}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Penerbangan
          </button>
        </form>
      </div>

      {/* Daftar Penerbangan */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Penerbangan</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {flights.map((flight) => (
              <li key={flight.id} className="p-4 border border-gray-200 rounded">
                {editingId === flight.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="flight_number"
                      value={editForm.flight_number || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      name="departure_city"
                      value={editForm.departure_city || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      name="arrival_city"
                      value={editForm.arrival_city || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="datetime-local"
                      name="departure_time"
                      value={editForm.departure_time || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="datetime-local"
                      name="arrival_time"
                      value={editForm.arrival_time || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={editForm.price || ''}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => handleUpdateFlight(flight.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-green-600"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p><strong>{flight.flight_number}</strong></p>
                    <p>{flight.departure_city} → {flight.arrival_city}</p>
                    <p>Keberangkatan: {new Date(flight.departure_time).toLocaleString('id-ID')}</p>
                    <p>Harga: Rp {new Intl.NumberFormat('id-ID').format(flight.price)}</p>
                    <div className="mt-3">
                      <button
                        onClick={() => startEditing(flight)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFlight(flight.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FlightManagement;