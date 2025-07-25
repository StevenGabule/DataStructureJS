import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you have a PrismaService
import { CustomerBooking, Cleaner, Prisma } from '@prisma/client';
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

    // 1. Find all potentially available cleaners
    const availableCleaners = await this.findAvailableCleaners(booking);
    if (availableCleaners.length === 0) {
      console.log('No cleaners available based on initial filters.');
      return null;
    }

    // 2. Filter out cleaners who have conflicting bookings
    const trulyAvailableCleaners = await this.filterCleanersWithConflictingBookings(
      availableCleaners,
      booking,
    );
     if (trulyAvailableCleaners.length === 0) {
      console.log('All potential cleaners have conflicting bookings.');
      return null;
    }

    // 3. Rank the remaining cleaners
    const rankedCleaners = this.rankCleaners(trulyAvailableCleaners, booking);

    // 4. Return the top-ranked cleaner
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
   * Filters cleaners based on general availability, skills, level, and location.
   * @param booking The customer booking object.
   */
  private async findAvailableCleaners(booking: any): Promise<Cleaner[]> {
    const dayOfWeek = moment(booking.scheduledDatetime).format('dddd').toLowerCase(); // e.g., 'monday'
    const requiredAddOnIds = booking.additionalServices.map(
      (service) => service.additionalService.id,
    );

    const where: Prisma.CleanerWhereInput = {
      blocked: false,
      onboardingStatus: 'COMPLETED',
      cleanerSubscriptionLevelId: booking.requestedCleanerSubscriptionLevelId,
      // Check for the basic clean type skill
      cleanerCleanTypes: {
        some: {
          cleanTypeId: booking.cleanTypeId,
        },
      },
      // Check for general availability on the specific day
      availability: {
        [`isAvailable${this.capitalize(dayOfWeek)}`]: true,
      },
      // Check for location and willingness to travel
      // This is a simplified location filter. For production, use a geospatial index.
      location: {
        isNot: null
      }
    };

    // If there are add-ons, ensure the cleaner has all required skills
    if (requiredAddOnIds.length > 0) {
       where.cleanerAddOns = {
           every: { // Use 'every' if cleaner must have all add-ons
               addOnId: { in: requiredAddOnIds }
           }
       };
    }

    return this.prisma.cleaner.findMany({
      where,
      include: {
        location: true,
        availability: true,
        reviewsAsCleaner: true, // For ranking
      },
    });
  }

    /**
     * Filters a list of cleaners by checking for scheduling conflicts.
     * @param cleaners The list of cleaners to check.
     * @param booking The current booking request.
     */
    private async filterCleanersWithConflictingBookings(cleaners: Cleaner[], booking: any): Promise<Cleaner[]> {
        const bookingStartTime = moment(booking.scheduledDatetime);
        const bookingEndTime = bookingStartTime.clone().add(booking.estimatedDurationMinutes, 'minutes');

        const cleanerIds = cleaners.map(c => c.id);

        // Find all bookings for the potentially available cleaners that might overlap
        const conflictingBookings = await this.prisma.customerBooking.findMany({
            where: {
                assignedCleanerId: { in: cleanerIds },
                bookingStatus: { in: ['CONFIRMED', 'ASSIGNED', 'IN_PROGRESS'] },
                // Check for bookings that overlap with the new booking's time window
                scheduledDatetime: {
                    // Existing booking starts before the new one ends AND new one starts before existing one ends
                    lt: bookingEndTime.toDate(),
                },
                // This is a simplified overlap check. A more robust check is needed.
                // A proper check needs to find bookings where:
                // (StartA <= EndB) and (EndA >= StartB)
            }
        });

        // Create a set of cleaner IDs that have conflicts
        const cleanersWithConflicts = new Set<number>();
        conflictingBookings.forEach(existingBooking => {
            const existingBookingStartTime = moment(existingBooking.scheduledDatetime);
            const existingBookingEndTime = existingBookingStartTime.clone().add(existingBooking.estimatedDurationMinutes, 'minutes');

            // More accurate overlap check
            if (bookingStartTime.isBefore(existingBookingEndTime) && bookingEndTime.isAfter(existingBookingStartTime)) {
                 if(existingBooking.assignedCleanerId) {
                    cleanersWithConflicts.add(existingBooking.assignedCleanerId);
                 }
            }
        });

        // Return only the cleaners who are NOT in the conflict set
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

      // 1. Proximity Score (higher score for closer cleaners)
      if (cleaner.location && booking.serviceLatitude && booking.serviceLongitude) {
        const distance = this.calculateDistance(
          booking.serviceLatitude,
          booking.serviceLongitude,
          cleaner.location.latitude,
          cleaner.location.longitude,
        );
        // This is a simple linear score. You can make this more sophisticated.
        if (distance < 5) score += 50;
        else if (distance < 15) score += 30;
        else if (distance < 30) score += 10;
      }

      // 2. Rating Score (higher score for better-rated cleaners)
      const avgRating = this.getAverageRating(cleaner.reviewsAsCleaner);
      if (avgRating > 0) {
        score += avgRating * 10; // e.g., a 4.5 avg rating adds 45 points
      }

      // 3. Experience Score
      score += (cleaner.rangeOfExperience || 1) * 2;


      return { ...cleaner, score };
    });

    // Sort by score in descending order
    return ranked.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculates the average rating for a cleaner.
   */
  private getAverageRating(reviews: any[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + (review.ratingByCustomer || 0), 0);
    return total / reviews.length;
  }

  /**
   * Helper to calculate the distance between two lat/lon points (Haversine formula).
   * @returns Distance in kilometers.
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
