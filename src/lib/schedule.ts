import { addMinutes, isBefore, max, min, format, parseISO } from 'date-fns';
import prisma from './prisma';
import type { Service, ServicePhase, BookingBlock } from '@prisma/client';

// Define salon operating hours. In a real application these values
// would be stored in the database and configurable via the admin panel.
export const OPENING_HOUR = 9; // 9:00
export const CLOSING_HOUR = 19; // 19:00 (7pm)

/**
 * Compute available start times for a service on a given date for the given
 * professional. This naive implementation retrieves existing booking blocks
 * on the date and subtracts them from the day schedule. It then tests
 * whether the service phases fit into free windows. If `professionalId`
 * is undefined, the function considers any professional able to perform
 * the service (requires additional logic to filter by specialties).
 */
export async function getAvailableSlots(
  serviceId: number,
  date: Date,
  professionalId?: number
): Promise<Date[]> {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { phases: true },
  });
  if (!service) return [];
  // Flatten service phases into durations and exclusivity flags
  const phases = service.phases.sort((a, b) => a.order - b.order);
  const totalDuration = phases.reduce((acc, p) => acc + p.duration, 0);
  const prep = service.preparationTime || 0;
  const requiredDuration = totalDuration + prep;

  // Determine day boundaries
  const dayStart = new Date(date);
  dayStart.setHours(OPENING_HOUR, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(CLOSING_HOUR, 0, 0, 0);

  // Fetch existing booking blocks for this professional or service
  const bookingBlocks: BookingBlock[] = await prisma.bookingBlock.findMany({
    where: {
      booking: {
        date: date,
        ...(professionalId ? { professionalId } : {}),
      },
    },
  });
  // Sort blocks by start time
  bookingBlocks.sort((a, b) => (a.start < b.start ? -1 : 1));

  // Build list of free intervals between bookings
  const freeIntervals: { start: Date; end: Date }[] = [];
  let currentStart = dayStart;
  for (const block of bookingBlocks) {
    if (isBefore(currentStart, block.start)) {
      freeIntervals.push({ start: new Date(currentStart), end: new Date(block.start) });
    }
    currentStart = max([currentStart, block.end]);
  }
  if (isBefore(currentStart, dayEnd)) {
    freeIntervals.push({ start: new Date(currentStart), end: dayEnd });
  }

  // For each free interval, test if the service fits, including exclusive
  // considerations. A more sophisticated scheduler would also ensure
  // compatibility with non-exclusive phases across bookings but this sample
  // keeps it simple.
  const availableSlots: Date[] = [];
  for (const interval of freeIntervals) {
    let slotStart = new Date(interval.start);
    while (isBefore(addMinutes(slotStart, requiredDuration), interval.end)) {
      // Check exclusive conflicts: ensure there are no blocks overlapping
      // phases marked as exclusive in other bookings during this slot.
      const conflict = bookingBlocks.some((block) => {
        // Only compare blocks marked exclusive. Non-exclusive blocks allow overlaps.
        if (!block.exclusive) return false;
        const slotEnd = addMinutes(slotStart, requiredDuration);
        return block.start < slotEnd && block.end > slotStart;
      });
      if (!conflict) {
        availableSlots.push(new Date(slotStart));
      }
      // Move forward in 15 minute increments
      slotStart = addMinutes(slotStart, 15);
    }
  }
  return availableSlots;
}