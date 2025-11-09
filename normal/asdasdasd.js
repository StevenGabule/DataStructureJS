  private async transitionToMatchedAcceptance(
    bookingUuid: string,
    matchedIds: number[],
  ): Promise<CustomerBooking> {
    return this.prisma.customerBooking.update({
      where: { uuid: bookingUuid },
      data: {
        bookingStatus: 'AWAITING_MATCHED_ACCEPTANCE',
        assignedCleanerId: null,
        matchedCleanerIds: matchedIds,
        assignmentDeadline: moment().add(4, 'hours').toDate(), // Note: moment-business-time plugin needed for real business hours
      },
    });
  }
	
	
  private async findInitialProviderMatch(booking: any): Promise<Cleaner[]> {
    const dayOfWeek = moment(booking.scheduledDatetime)
      .format('dddd')
      .toLowerCase();
    const requiredAddOnIds = booking.additionalServices.map(
      (service: any) => service.additionalService.id,
    );

    const where: Prisma.CleanerWhereInput = {
      blocked: false,
      onboardingStatus: 'COMPLETED',
      cleanerSubscriptionLevelId: booking.requestedCleanerSubscriptionLevelId,
      cleanerCleanTypes: {
        some: {
          cleanTypeId: booking.cleanTypeId,
        },
      },
      availability: {
        [`isAvailable${this.capitalize(dayOfWeek)}`]: true,
      },
      location: {
        isNot: null,
      },
      ...(booking.recurringFrequencyId
        ? {
            cleaner: {},
          }
        : {}),
    };

    if (requiredAddOnIds.length > 0) {
      where.cleanerAddOns = {
        every: {
          addOnId: { in: requiredAddOnIds },
        },
      };
    }

    const potentialCleaners = await this.prisma.cleaner.findMany({
      where,
      include: {
        location: true,
        availability: true,
        reviewsAsCleaner: true,
        assignedBookings: true,
      },
    });

    const cleanersInArea = potentialCleaners.filter((cleaner) => {
      if (!cleaner.location?.latitude || !cleaner.location?.longitude)
        return false;
      const distance = this.calculateDistance(
        booking.serviceLatitude,
        booking.serviceLongitude,
        cleaner.location.latitude,
        cleaner.location.longitude,
      );
      const maxDistance = this.getDistanceForTravelLevel(
        cleaner.location.travelLevel,
      );
      return distance <= maxDistance;
    });

    return await this.filterCleanersByWeeklyHours(cleanersInArea, booking);
  }
		
		
		