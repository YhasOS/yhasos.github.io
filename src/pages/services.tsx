import Layout from '@/components/Layout';
import ServiceCard from '@/components/ServiceCard';
import { useEffect, useState } from 'react';

interface Service {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  totalDuration: number;
  category: { name: string };
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      });
  }, []);

  return (
    <Layout title="Servicios">
      <h1 className="text-3xl font-bold text-accent mb-6">Nuestros Servicios</h1>
      {loading ? (
        <p>Cargando servicios...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </Layout>
  );
}