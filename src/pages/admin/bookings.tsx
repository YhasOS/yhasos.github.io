import AdminLayout from '@/components/AdminLayout';
import { useEffect, useState } from 'react';

interface Booking {
  id: number;
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  service: { name: string };
  professional?: { name: string } | null;
}

export default function AdminBookingsPage() {
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
    <AdminLayout title="Citas">
      <h1 className="text-3xl font-bold text-accent mb-4">Citas programadas</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-md text-sm">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="py-2 px-3 text-left">Cliente</th>
              <th className="py-2 px-3 text-left">Servicio</th>
              <th className="py-2 px-3 text-left">Profesional</th>
              <th className="py-2 px-3 text-left">Fecha</th>
              <th className="py-2 px-3 text-left">Hora</th>
              <th className="py-2 px-3 text-left">Fin</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b">
                <td className="py-2 px-3">{booking.clientName}</td>
                <td className="py-2 px-3">{booking.service.name}</td>
                <td className="py-2 px-3">{booking.professional?.name ?? '—'}</td>
                <td className="py-2 px-3">{new Date(booking.date).toLocaleDateString()}</td>
                <td className="py-2 px-3">{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="py-2 px-3">{new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}