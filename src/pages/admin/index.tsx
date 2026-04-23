import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Booking {
  id: number;
  clientName: string;
  date: string;
  startTime: string;
  service: { name: string };
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      });
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <h1 className="text-3xl font-bold text-accent mb-4">Resumen de citas</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-md">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-2 px-4 text-left">Cliente</th>
              <th className="py-2 px-4 text-left">Servicio</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Hora</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="py-2 px-4">{booking.clientName}</td>
                <td className="py-2 px-4">{booking.service.name}</td>
                <td className="py-2 px-4">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}