import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have a PrismaService
import { CustomerBooking, Cleaner, Prisma, TravelDistanceLevel } from '@prisma/client';
import * as moment from 'moment-timezone';

// Define a type for a cleaner with their score
type RankedCleaner = Cleaner & { score: number };

@Injectable()
export class CleanerMatchingService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Main public method to find the best cleaner for a given booking.
   * @param bookingId The ID of the CustomerBooking.
   * @returns The best-matched Cleaner or null if none are found.
   */
  public async findBestCleanerForBooking(bookingId: number): Promise<Cleaner | null> {
    const booking = await this.getBookingDetails(bookingId);
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
    }

    // Step 2 (as per user request): Generate the initial "Matched List"
    const matchedCleaners = await this.findInitialProviderMatch(booking);
    if (matchedCleaners.length === 0) {
      console.log('No cleaners available based on initial filters (area, skills, level, weekly hours).');
      return null;
    }

    // Filter out cleaners who have direct scheduling conflicts
    const trulyAvailableCleaners = await this.filterCleanersWithConflictingBookings(
      matchedCleaners,
      booking,
    );
     if (trulyAvailableCleaners.length === 0) {
      console.log('All potential cleaners have conflicting bookings.');
      return null;
    }

    // Rank the remaining cleaners
    const rankedCleaners = this.rankCleaners(trulyAvailableCleaners, booking);

    // Return the top-ranked cleaner
    return rankedCleaners.length > 0 ? rankedCleaners[0] : null;
  }

  /**
   * Fetches the full booking details required for matching.
   * @param bookingId The ID of the booking.
   */
  private async getBookingDetails(bookingId: number): Promise<any> {
    return this.prisma.customerBooking.findUnique({
      where: { id: bookingId },
      include: {
        cleanType: true,
        additionalServices: {
          include: {
            additionalService: true,
          },
        },
        requestedCleanerSubscriptionLevel: true,
      },
    });
  }

  /**
   * Step 2: Filters cleaners based on service level, area, service type, skills, and weekly hours.
   * @param booking The customer booking object.
   */
  private async findInitialProviderMatch(booking: any): Promise<Cleaner[]> {
    const dayOfWeek = moment(booking.scheduledDatetime).format('dddd').toLowerCase();
    const requiredAddOnIds = booking.additionalServices.map(
      (service) => service.additionalService.id,
    );

    const where: Prisma.CleanerWhereInput = {
      blocked: false,
      onboardingStatus: 'COMPLETED',
      // 1. Cleaner Type Match
      cleanerSubscriptionLevelId: booking.requestedCleanerSubscriptionLevelId,
      // 4. Skillset Match (CleanType)
      cleanerCleanTypes: {
        some: {
          cleanTypeId: booking.cleanTypeId,
        },
      },
      availability: {
        [`isAvailable${this.capitalize(dayOfWeek)}`]: true,
      },
      location: {
        isNot: null
      },
      // 3. Service Type Preference (Simplified)
      // NOTE: This is a simplified check. For a robust solution, add a 'preferredServiceTypes' field
      // to the Cleaner model (e.g., an array of enums: ['RECURRING', 'ADHOC', 'BOND']).
      // The current logic assumes cleaners doing recurring jobs also do ad-hoc jobs.
      ...(booking.recurringFrequencyId ? { cleaner: { /* logic for recurring preference */ } } : {}),
    };

    if (requiredAddOnIds.length > 0) {
       // 4. Skillset Match (AddOns)
       where.cleanerAddOns = {
           every: {
               addOnId: { in: requiredAddOnIds }
           }
       };
    }

    const potentialCleaners = await this.prisma.cleaner.findMany({
      where,
      include: {
        location: true,
        availability: true,
        reviewsAsCleaner: true,
        assignedBookings: true, // Needed for weekly hours check
      },
    });

    // 2. Service Area Match (Post-filter)
    const cleanersInArea = potentialCleaners.filter(cleaner => {
        if (!cleaner.location?.latitude || !cleaner.location?.longitude) return false;
        const distance = this.calculateDistance(
            booking.serviceLatitude,
            booking.serviceLongitude,
            cleaner.location.latitude,
            cleaner.location.longitude,
        );
        const maxDistance = this.getDistanceForTravelLevel(cleaner.location.travelLevel);
        return distance <= maxDistance;
    });

    // 5. Maximum Weekly Hours Match
    const cleanersWithinHours = await this.filterCleanersByWeeklyHours(cleanersInArea, booking);

    return cleanersWithinHours;
  }

    /**
     * Filters a list of cleaners to exclude those who would exceed their max weekly hours.
     * @param cleaners The list of cleaners to filter.
     * @param booking The new booking to be added.
     */
    private async filterCleanersByWeeklyHours(cleaners: Cleaner[], booking: any): Promise<Cleaner[]> {
        const bookingWeekStart = moment(booking.scheduledDatetime).startOf('week').toDate();
        const bookingWeekEnd = moment(booking.scheduledDatetime).endOf('week').toDate();
        const newBookingDuration = booking.estimatedDurationMinutes / 60; // Convert to hours

        const cleanerIds = cleaners.map(c => c.id);

        // Get all confirmed bookings for these cleaners in the relevant week
        const weeklyBookings = await this.prisma.customerBooking.findMany({
            where: {
                assignedCleanerId: { in: cleanerIds },
                bookingStatus: { in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
                scheduledDatetime: {
                    gte: bookingWeekStart,
                    lte: bookingWeekEnd,
                }
            }
        });

        // Calculate current weekly hours for each cleaner
        const weeklyHoursMap = new Map<number, number>();
        for (const b of weeklyBookings) {
            const durationHours = b.estimatedDurationMinutes / 60;
            const cleanerId = b.assignedCleanerId;
            if (cleanerId) {
                weeklyHoursMap.set(cleanerId, (weeklyHoursMap.get(cleanerId) || 0) + durationHours);
            }
        }

        // Filter out cleaners who would exceed their max hours
        return cleaners.filter(cleaner => {
            const maxHours = cleaner.availability?.availableHoursPerWeek;
            if (maxHours === null || maxHours === undefined) return true; // No limit set, so they are eligible

            const currentHours = weeklyHoursMap.get(cleaner.id) || 0;
            return (currentHours + newBookingDuration) <= maxHours;
        });
    }


    /**
     * Filters a list of cleaners by checking for direct scheduling conflicts.
     * @param cleaners The list of cleaners to check.
     * @param booking The current booking request.
     */
    private async filterCleanersWithConflictingBookings(cleaners: Cleaner[], booking: any): Promise<Cleaner[]> {
        const bookingStartTime = moment(booking.scheduledDatetime);
        const bookingEndTime = bookingStartTime.clone().add(booking.estimatedDurationMinutes, 'minutes');

        const cleanerIds = cleaners.map(c => c.id);

        const conflictingBookings = await this.prisma.customerBooking.findMany({
            where: {
                assignedCleanerId: { in: cleanerIds },
                bookingStatus: { in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
                scheduledDatetime: {
                    lt: bookingEndTime.toDate(),
                },
                // A more robust check is needed for proper overlap:
                // find bookings where (StartA <= EndB) and (EndA >= StartB)
            }
        });

        const cleanersWithConflicts = new Set<number>();
        conflictingBookings.forEach(existingBooking => {
            const existingBookingStartTime = moment(existingBooking.scheduledDatetime);
            const existingBookingEndTime = existingBookingStartTime.clone().add(existingBooking.estimatedDurationMinutes, 'minutes');

            if (bookingStartTime.isBefore(existingBookingEndTime) && bookingEndTime.isAfter(existingBookingStartTime)) {
                 if(existingBooking.assignedCleanerId) {
                    cleanersWithConflicts.add(existingBooking.assignedCleanerId);
                 }
            }
        });

        return cleaners.filter(cleaner => !cleanersWithConflicts.has(cleaner.id));
    }


  /**
   * Ranks cleaners based on a scoring system.
   * @param cleaners The list of available cleaners.
   * @param booking The customer booking.
   */
  private rankCleaners(cleaners: Cleaner[], booking: any): RankedCleaner[] {
    const ranked = cleaners.map((cleaner): RankedCleaner => {
      let score = 0;
      if (cleaner.location && booking.serviceLatitude && booking.serviceLongitude) {
        const distance = this.calculateDistance(
          booking.serviceLatitude,
          booking.serviceLongitude,
          cleaner.location.latitude,
          cleaner.location.longitude,
        );
        if (distance < 5) score += 50;
        else if (distance < 15) score += 30;
        else if (distance < 30) score += 10;
      }
      const avgRating = this.getAverageRating(cleaner.reviewsAsCleaner);
      if (avgRating > 0) {
        score += avgRating * 10;
      }
      score += (cleaner.rangeOfExperience || 1) * 2;

      return { ...cleaner, score };
    });

    return ranked.sort((a, b) => b.score - a.score);
  }

  private getAverageRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + (review.ratingByCustomer || 0), 0);
    return total / reviews.length;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   * Converts TravelDistanceLevel enum to a number in kilometers.
   * @param level The TravelDistanceLevel enum value.
   * @returns Maximum travel distance in KM.
   */
  private getDistanceForTravelLevel(level: TravelDistanceLevel): number {
      switch (level) {
          case 'UNDER_5KM': return 5;
          case 'KM_5_10': return 10;
          case 'KM_10_15': return 15;
          case 'KM_15_20': return 20;
          case 'KM_20_30': return 30;
          case 'KM_30_50': return 50;
          case 'OVER_50KM': return 1000; // Represents a very large distance
          default: return 10; // Default fallback
      }
  }
}
