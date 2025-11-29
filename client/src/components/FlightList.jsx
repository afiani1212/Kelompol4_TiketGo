import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api/flights';

function FlightList() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk carousel manual
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Gagal memuat data');
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAirlineName = (flightNumber) => {
    if (flightNumber.startsWith('GH')) return 'Scot';
    if (flightNumber.startsWith('CD')) return 'AirAsia';
    return 'Maskapai';
  };

  const getAirportCode = (city) => {
    const codes = { Jakarta: 'CGK', Bali: 'DPS', Medan: 'MES', Bandung: 'BDO' };
    return codes[city] || city;
  };

  // Daftar gambar banner
  const banners = [
    { id: 1, image: '/images/pulau2.jpg', title: 'Gunung Bromo Adventure', subtitle: 'Book your epic sunrise trek today!' },
    { id: 2, image: '/images/pulau3.jpg', title: 'Bali Paradise', subtitle: 'Relax on the beach and enjoy the culture.' },
    { id: 3, image: '/images/pulau4.jpg', title: 'Labuan Bajo', subtitle: 'Explore the Komodo National Park.' }
  ];

  // Fungsi untuk mengganti slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative h-[70vh] w-full overflow-hidden"> {/* 🔹 Ubah tinggi banner menjadi 60% dari layar */}
        <div className="relative w-full h-full">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center object-cover" // 🔹 Tambahkan object-cover
                style={{ backgroundImage: `url('${banner.image}')` }}
              ></div>
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-xl text-white">{banner.subtitle}</p>
              </div>
            </div>
          ))}

          {/* Tombol Navigasi */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-70"
          >
            →
          </button>

          {/* Pagination */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Daftar Penerbangan */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl text-blue-500 font-bold mb-6 text-center">Jadwal Penerbangan Tersedia</h2>
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : flights.length === 0 ? (
          <p className="text-center">Tidak ada penerbangan tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <p className="font-medium text-sm text-gray-600">{getAirlineName(flight.flight_number)}</p>
                <p className="text-lg font-semibold">
                  {flight.departure_city} ({getAirportCode(flight.departure_city)}) → {flight.arrival_city} ({getAirportCode(flight.arrival_city)})
                </p>
                <p className="text-sm text-gray-500 mt-1">{formatDate(flight.departure_time)}</p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-blue-600 font-bold">{formatPrice(flight.price)}</p>
                  <Link
                    to={`/flights/${flight.id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Lihat →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FlightList;