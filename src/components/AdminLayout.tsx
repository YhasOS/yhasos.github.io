import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export default function AdminLayout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title ? `${title} | Panel Admin` : 'Panel Admin'}</title>
      </Head>
      <div className="flex">
        <aside className="w-60 bg-white shadow-md min-h-screen p-4">
          <h2 className="text-2xl font-bold text-accent mb-6">Admin</h2>
          <nav className="space-y-4">
            <Link href="/admin" className="block hover:text-accent">Dashboard</Link>
            <Link href="/admin/bookings" className="block hover:text-accent">Citas</Link>
            <Link href="/admin/services" className="block hover:text-accent">Servicios</Link>
            <Link href="/admin/professionals" className="block hover:text-accent">Profesionales</Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}