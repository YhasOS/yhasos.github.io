import Link from 'next/link';

type Service = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  totalDuration: number;
  category: { name: string };
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow">
      <div>
        <h3 className="text-xl font-semibold text-accent mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{service.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold">€{service.price.toFixed(2)}</span>
          <span className="ml-2 text-sm text-gray-500">{service.totalDuration} min</span>
        </div>
        <Link
          href={`/booking?serviceId=${service.id}`}
          className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Reservar
        </Link>
      </div>
    </div>
  );
}