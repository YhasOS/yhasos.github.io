# Salón Belleza – aplicación de reservas

Este proyecto es un ejemplo completo de una aplicación de reservas para un salón de peluquería/estética. Está construido con **Next.js**, **TypeScript**, **Tailwind CSS** y **Prisma**. El objetivo es proporcionar una base profesional y extensible que gestione citas con lógica de agenda avanzada, permitiendo compatibilizar tratamientos con fases de espera y evitando solapamientos indebidos.

## Características principales

- Catálogo de servicios con categorías como peluquería, manicura y estética facial.
- Definición de servicios mediante **fases**, indicando la duración y si cada fase requiere atención exclusiva o puede solaparse.
- Gestión de profesionales y recursos físicos (sillones, mesas, cabinas) modelada en la base de datos.
- Lógica de agenda que calcula la disponibilidad real en función de las fases exclusivas y no exclusivas de los servicios.
- Flujo de reserva sencillo para la clienta: selección de servicio, fecha y hora disponible, introducción de datos y confirmación.
- Panel de administración básico para visualizar citas, con posibilidad de ampliar a gestión de servicios y profesionales.
- Diseño visual premium con **Tailwind** y paleta de colores sofisticada acorde al sector belleza.

## Instalación

1. **Clonar el repositorio** (o copiar estos archivos en tu propio repositorio). Asegúrate de tener instalado Node.js (>=18) y PostgreSQL.

```bash
git clone <tu-repo>
cd salon-app
```

2. **Instalar dependencias**.

```bash
npm install
```

3. **Configurar la base de datos**. Crea un archivo `.env` basado en `.env.example` y actualiza `DATABASE_URL` con la cadena de conexión a tu base de datos PostgreSQL.

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/salon_db?schema=public"
NEXTAUTH_SECRET="alguna-clave"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Inicializar Prisma y la base de datos**.

```bash
npx prisma migrate dev --name init
npm run seed
```

5. **Ejecutar la aplicación en modo desarrollo**.

```bash
npm run dev
```

6. Accede a `http://localhost:3000` en tu navegador para ver la aplicación y a `http://localhost:3000/admin` para el panel de administración (sin autenticación por ahora).

## Próximos pasos y mejoras

- Implementar autenticación para proteger el panel de administración (NextAuth.js).
- Añadir gestión de recursos y profesionales desde el panel admin.
- Permitir que la cliente elija un profesional específico según la disponibilidad y especialidad.
- Integrar pasarelas de pago o depósito para servicios de larga duración.
- Enviar confirmaciones y recordatorios por email, WhatsApp o SMS.
- Mejorar la visualización de la agenda con calendarios interactivos.

## Licencia

MIT