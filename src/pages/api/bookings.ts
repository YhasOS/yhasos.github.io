import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { addMinutes } from 'date-fns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bookings = await prisma.booking.findMany({
      orderBy: { startTime: 'asc' },
      include: {
        service: { select: { name: true } },
        professional: { select: { name: true } },
      },
    });
    return res.status(200).json(bookings);
  }
  if (req.method === 'POST') {
    const { serviceId, date, startTime, name, email, phone, notes, professionalId } = req.body;
    if (!serviceId || !date || !startTime || !name || !email) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { phases: true },
    });
    if (!service) return res.status(400).json({ error: 'Service not found' });
    const start = new Date(startTime);
    // compute end time
    const totalDuration = service.phases.reduce((acc, p) => acc + p.duration, 0) + (service.preparationTime || 0);
    const end = addMinutes(start, totalDuration);
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        notes: notes,
        date: new Date(date),
        startTime: start,
        endTime: end,
        service: { connect: { id: serviceId } },
        professional: professionalId ? { connect: { id: professionalId } } : undefined,
      },
    });
    // Create booking blocks for each phase
    let currentBlockStart = new Date(start);
    for (const phase of service.phases.sort((a, b) => a.order - b.order)) {
      const blockStart = new Date(currentBlockStart);
      const blockEnd = addMinutes(blockStart, phase.duration);
      await prisma.bookingBlock.create({
        data: {
          bookingId: booking.id,
          start: blockStart,
          end: blockEnd,
          exclusive: phase.exclusive,
        },
      });
      currentBlockStart.setTime(blockEnd.getTime());
    }
    return res.status(201).json(booking);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}