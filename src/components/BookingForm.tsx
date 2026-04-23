import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Service {
  id: number;
  name: string;
  price: number;
  totalDuration: number;
  description?: string | null;
}

interface SlotOption {
  value: string;
  label: string;
}

export default function BookingForm() {
  const router = useRouter();
  const { serviceId } = router.query;
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (serviceId) {
      fetch(`/api/services/${serviceId}`)
        .then((res) => res.json())
        .then((data) => setService(data));
    }
  }, [serviceId]);

  async function fetchSlots(selectedDate: string) {
    if (!serviceId || !selectedDate) return;
    setLoadingSlots(true);
    setSlots([]);
    const res = await fetch(`/api/slots?serviceId=${serviceId}&date=${selectedDate}`);
    const data = await res.json();
    const options = data.map((iso: string) => {
      const d = new Date(iso);
      const label = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return { value: iso, label };
    });
    setSlots(options);
    setLoadingSlots(false);
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDate(value);
    fetchSlots(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !date || !selectedSlot) return;
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: Number(serviceId),
        date,
        startTime: selectedSlot,
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    }
  };

  if (!service) return <p>Cargando servicio...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-accent mb-4">Reserva para {service.name}</h2>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-800 rounded-md">Su cita ha sido reservada correctamente.</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          {date && (
            <div>
              <label className="block text-sm font-medium mb-1">Hora</label>
              {loadingSlots ? (
                <p>Cargando disponibilidad...</p>
              ) : (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Seleccione una hora</option>
                  {slots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-accent/90"
          >
            Confirmar cita
          </button>
        </form>
      )}
    </div>
  );
}