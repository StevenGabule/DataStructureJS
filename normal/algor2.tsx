import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CleanerMatchingService } from './cleaner-matching.service';
import * as moment from 'moment-timezone';
import { CustomerBooking } from '@prisma/client';

@Injectable()
export class BookingAvailabilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cleanerMatchingService: CleanerMatchingService,
  ) {}

  /**
   * Gets all available time slots for a given booking within a date range.
   * A slot is available if at least one pre-matched cleaner is free.
   *
   * @param bookingId The ID of the DRAFT booking.
   * @param startDate The start of the date range to check.
   * @param endDate The end of the date range to check.
   * @returns An array of available date-time strings in ISO format.
   */
  public async getAvailableTimeSlots(
    bookingId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<string[]> {
    const booking = await this.cleanerMatchingService['getBookingDetails'](bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
    }

    // 1. Get the list of all cleaners who are generally eligible for the job.
    const eligibleCleaners = await this.cleanerMatchingService['findInitialProviderMatch'](booking);
    if (eligibleCleaners.length === 0) {
      return []; // No eligible cleaners means no availability.
    }
    const eligibleCleanerIds = eligibleCleaners.map(c => c.id);

    // 2. Fetch all existing bookings for these cleaners within the given date range.
    const existingBookings = await this.prisma.customerBooking.findMany({
      where: {
        assignedCleanerId: { in: eligibleCleanerIds },
        bookingStatus: { in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
        scheduledDatetime: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 3. Generate all possible start slots within the date range (e.g., every 30 mins).
    const allPossibleSlots = this.generateTimeSlots(startDate, endDate, booking.estimatedDurationMinutes);

    // 4. For each slot, determine which cleaners are available.
    const availableSlots: string[] = [];
    for (const slot of allPossibleSlots) {
      const slotStart = moment(slot);
      const slotEnd = slotStart.clone().add(booking.estimatedDurationMinutes, 'minutes');
      const dayOfWeek = slotStart.format('dddd').toLowerCase();

      // Find cleaners who are free during this specific slot.
      const availableCleanersForSlot = eligibleCleaners.filter(cleaner => {
        // Check general day/time availability from their profile.
        const isGenerallyAvailable = this.isCleanerGenerallyAvailable(cleaner, dayOfWeek, slotStart, slotEnd);
        if (!isGenerallyAvailable) {
          return false;
        }

        // Check for specific booking conflicts.
        const hasConflict = existingBookings.some(existingBooking => {
          if (existingBooking.assignedCleanerId !== cleaner.id) {
            return false;
          }
          const existingStart = moment(existingBooking.scheduledDatetime);
          const existingEnd = existingStart.clone().add(existingBooking.estimatedDurationMinutes, 'minutes');
          // Return true if there is an overlap.
          return slotStart.isBefore(existingEnd) && slotEnd.isAfter(existingStart);
        });

        return !hasConflict;
      });

      // If at least one cleaner is available for this slot, add it to the list.
      if (availableCleanersForSlot.length > 0) {
        availableSlots.push(slot);
      }
    }

    return availableSlots;
  }

  /**
   * Generates a list of potential time slots between a start and end date.
   * Respects business hours (7am - 7pm).
   */
  private generateTimeSlots(startDate: Date, endDate: Date, durationMinutes: number): string[] {
    const slots: string[] = [];
    const intervalMinutes = 30; // Check availability every 30 minutes.
    let current = moment(startDate).startOf('day');

    while (current.isBefore(moment(endDate).endOf('day'))) {
      const dayStart = current.clone().hour(7).minute(0).second(0);
      const dayEnd = current.clone().hour(19).minute(0).second(0);

      let slotTime = dayStart.clone();
      while (slotTime.isBefore(dayEnd)) {
        // Ensure the full duration of the booking fits within business hours
        if (slotTime.clone().add(durationMinutes, 'minutes').isSameOrBefore(dayEnd)) {
          slots.push(slotTime.toISOString());
        }
        slotTime.add(intervalMinutes, 'minutes');
      }
      current.add(1, 'day');
    }
    return slots;
  }

   /**
    * Checks if a cleaner is generally available based on their weekly schedule.
    */
   private isCleanerGenerallyAvailable(cleaner: any, dayOfWeek: string, slotStart: moment.Moment, slotEnd: moment.Moment): boolean {
    if (!cleaner.availability) return false;

    const isAvailableFlag = cleaner.availability[`isAvailable${this.capitalize(dayOfWeek)}`];
    if (!isAvailableFlag) return false;

    const availabilityStartStr = cleaner.availability[`${dayOfWeek}StartTime`]; // e.g., '09:00:00'
    const availabilityEndStr = cleaner.availability[`${dayOfWeek}EndTime`]; // e.g., '17:00:00'

    if (!availabilityStartStr || !availabilityEndStr) return true; // No time constraints means available all day.

    const availabilityStart = moment(availabilityStartStr, 'HH:mm:ss').year(slotStart.year()).month(slotStart.month()).date(slotStart.date());
    const availabilityEnd = moment(availabilityEndStr, 'HH:mm:ss').year(slotStart.year()).month(slotStart.month()).date(slotStart.date());

    return slotStart.isSameOrAfter(availabilityStart) && slotEnd.isSameOrBefore(availabilityEnd);
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
