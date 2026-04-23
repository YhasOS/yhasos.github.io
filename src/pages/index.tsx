import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="Inicio">
      <div className="text-center py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-accent mb-6">Bienvenida al Salón Belleza</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-700 mb-8">
          Descubre una experiencia de belleza única. Nuestro equipo profesional
          ofrece servicios personalizados de peluquería, estética y bienestar
          para realzar tu belleza natural.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/services"
            className="bg-accent text-white px-6 py-3 rounded-md font-medium hover:bg-accent/80"
          >
            Ver servicios
          </Link>
          <Link
            href="/booking"
            className="bg-transparent border-2 border-accent text-accent px-6 py-3 rounded-md font-medium hover:bg-accent hover:text-white"
          >
            Reservar cita
          </Link>
        </div>
      </div>
    </Layout>
  );
}