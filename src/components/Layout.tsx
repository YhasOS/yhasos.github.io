import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  children: ReactNode;
};

export default function Layout({ title, children }: Props) {
  return (
    <div className="min-h-screen bg-primary-light text-text font-sans">
      <Head>
        <title>{title ? `${title} | Salón Belleza` : 'Salón Belleza'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header className="bg-white shadow sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-accent">
            Salón Belleza
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-accent">Inicio</Link>
            <Link href="/services" className="hover:text-accent">Servicios</Link>
            <Link href="/booking" className="hover:text-accent">Reservar</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-primary-dark text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Salón Belleza. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}