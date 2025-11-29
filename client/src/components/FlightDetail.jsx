// client/src/components/FlightDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // 🔹 Impor SweetAlert2

const API_BASE_URL = 'http://localhost:5000/api/flights';

function FlightDetail() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlightDetail();
  }, [id]);

  const fetchFlightDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('Penerbangan tidak ditemukan');
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setFlight(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setFlight(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fungsi untuk menangani klik "Book Now"
  const handleBookNow = () => {
    Swal.fire({
      icon: 'success',
      title: 'Booking Berhasil!',
      text: `Anda telah berhasil memesan tiket untuk penerbangan ${flight?.flight_number}.`,
      confirmButtonText: 'OK',
      timer: 3000,
      timerProgressBar: true
    });
  };

  if (loading) return <div className="text-center p-10">Memuat detail penerbangan...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!flight) return <div className="text-center p-10">Penerbangan tidak ditemukan.</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Link to="/flights" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Kembali ke Daftar Penerbangan
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Detail Penerbangan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Nomor Penerbangan:</strong> {flight.flight_number}</p>
            <p><strong>Kota Keberangkatan:</strong> {flight.departure_city}</p>
            <p><strong>Kota Tujuan:</strong> {flight.arrival_city}</p>
          </div>
          <div>
            <p><strong>Waktu Berangkat:</strong> {new Date(flight.departure_time).toLocaleString('id-ID')}</p>
            <p><strong>Waktu Tiba:</strong> {new Date(flight.arrival_time).toLocaleString('id-ID')}</p>
            <p><strong>Harga:</strong> Rp {new Intl.NumberFormat('id-ID').format(flight.price)}</p>
          </div>
        </div>

        {/* 🔹 Tombol Book Now dengan notifikasi */}
        <div className="mt-6">
          <button
            onClick={handleBookNow}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlightDetail;