 async updateBookingSchedule(
    bookingUuid: string,
    dto: UpdateBookingScheduleDto,
    customerUuid: string,
  ): Promise<DraftBookingResponseDto> {
    const booking = await this.getBookingByUuidOrThrow(bookingUuid);
    if (
      booking.bookingStatus !== PrismaBookingStatus.DRAFT &&
      booking.bookingStatus !== PrismaBookingStatus.PENDING_CONFIRMATION
    ) {
      throw new BadRequestException(
        `Booking cannot be scheduled. Current Status ${booking.bookingStatus}`,
      );
    }

    const customer = await this.prisma.user.findUnique({
      where: { uuid: customerUuid },
    });

    if (!customer) {
      throw new NotFoundException(`Customer not found.`);
    }

    if (booking.customerId !== customer.id) {
      throw new BadRequestException(
        'You are not authorized to update this booking.',
      );
    }

    const scheduleDate = new Date(dto.scheduledDatetime);
    if (scheduleDate <= new Date()) {
      throw new BadRequestException(
        'Schedule date and time must be in the future.',
      );
    }

    const bestCleaner =
      await this.cleanerMatchingService.findBestCleanerForBooking(bookingUuid);

    let updatedBooking = null;

    if (bestCleaner) {
      console.log(
        `Best cleaner found: ${bestCleaner.firstname} (ID: ${bestCleaner.id})`,
      );
      // Step 3: If a cleaner is found, assign them to the booking
      updatedBooking = await this.prisma.customerBooking.update({
        where: { uuid: bookingUuid },
        data: {
          assignedCleanerId: bestCleaner.id,
          assignedAt: new Date(),
          bookingStatus: 'ASSIGNED', // Update status to ASSIGNED
        },
      });
    } else {
      updatedBooking = await this.prisma.customerBooking.update({
        where: { uuid: bookingUuid },
        data: {
          scheduledDatetime: scheduleDate,
          bookingStatus: PrismaBookingStatus.PENDING_CONFIRMATION,
        },
      });
    }

    return {
      id: updatedBooking.id,
      uuid: updatedBooking.uuid,
      bookingStatus: updatedBooking.bookingStatus as BookingStatus,
      customerId: updatedBooking.customerId,
      createdAt: updatedBooking.createdAt,
    };
  }