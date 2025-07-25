// In your existing prisma.schema file

// Add new statuses to your BookingStatus enum
enum BookingStatus {
  DRAFT
  PENDING_CONFIRMATION // Step 4: Offer to Preferred Provider
  AWAITING_SHORTLIST_ACCEPTANCE // Step 5: Offer to entire shortlist (first-come, first-served)
  AWAITING_MATCHED_ACCEPTANCE // Step 6: Offer to all matched providers (first-come, first-served)
  NEEDS_MANUAL_ASSIGNMENT // Step 7: Admin intervention required
  CONFIRMED // Final state after cleaner is assigned and has acknowledged/accepted
  IN_PROGRESS
  COMPLETED
  CANCELLED_BY_USER
  CANCELLED_BY_SYSTEM
  RESCHEDULED
  AWAITING_CAPTURE
}


model CustomerBooking {
  // ... existing fields
  id                   Int    @id @default(autoincrement())
  uuid                 String @unique @default(uuid())
  // ...
  
  // --- UPDATED FIELDS FOR STEPS 5-7 ---
  bookingStatus           BookingStatus @default(DRAFT)
  assignmentDeadline      DateTime?     // A single field to track the deadline for the current step
  shortlistedProviderRank Int?          @default(0) // The current index in the shortlist (for Step 4)
  shortlistedCleanerIds   Json?         // Stores the ranked list of cleaner IDs for Step 4 & 5
  matchedCleanerIds       Json?         // Stores the full list of matched cleaner IDs for Step 6

  // ... rest of the fields
  assignedCleanerId  Int?
  assignedAt         DateTime?
  cancellationReason String?
  // ...
  
  // --- NEW RELATION ---
  timeProposals TimeProposal[] // Relation for Step 6

  @@map("CustomerBooking")
}

// --- NEW MODEL FOR STEP 6 ---

model TimeProposal {
  id                Int      @id @default(autoincrement())
  uuid              String   @unique @default(uuid())
  customerBookingId Int
  cleanerId         Int
  proposedDatetime  DateTime @db.Timestamptz
  status            String   @default("PENDING") // PENDING, ACCEPTED, REJECTED
  createdAt         DateTime @default(now())

  booking CustomerBooking @relation(fields: [customerBookingId], references: [id], onDelete: Cascade)
  cleaner Cleaner         @relation(fields: [cleanerId], references: [id], onDelete: Cascade)

  @@unique([customerBookingId, cleanerId]) // A cleaner can only propose one new time per booking
  @@map("TimeProposal")
}

model Cleaner {
    // ... existing fields
    // --- NEW RELATION ---
    timeProposals TimeProposal[]
    //...
}
