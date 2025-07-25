/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { BookingFormData, initialBookingFormData } from '@/lib/types/booking';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress'; // We might replace this with a visual stepper
import { useRouter, useSearchParams } from 'next/navigation';
import { useHydratedGuestBookingStore } from '@/lib/store/use-hydrad-guest-booking-store';
import { useBooking } from '@/lib/hooks/use-booking';
import { Loader2 } from 'lucide-react';
import { Step0ServiceArea, Step1CleanType, Step2PropertyDetails, Step3AddOns, Step4CleanerLevel, Step5ReviewConfirmQuote, Step6Schedule, Step7CheckoutWithStripe, Step8Confirmation } from '@/components/booking';
import * as bookingApi from '@/lib/api/booking';

// Import the new Stepper component
import Stepper from '@/components/ui/stepper'; // Adjust the path as needed

export default function BookingPage() {
  const router = useRouter();
  const bookingHook = useBooking();
  const searchParams = useSearchParams()
  const resume = searchParams.get('resume')
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1); // Keep this state
  const [bookingUuid, setBookingUuid] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState<Partial<BookingFormData>>(initialBookingFormData);
  const { stepOne, stepTwo, stepThree, stepFour, stepSix, resetGuestBooking } = useHydratedGuestBookingStore();

  const createDraftBookingMutation = bookingHook.createDraftBooking;
  const updateStep1Mutation = bookingHook.useUpdateBookingStep(bookingApi.updateStep1);
  const updateStep2Mutation = bookingHook.useUpdateBookingStep(bookingApi.updateStep2);
  const updateStep3Mutation = bookingHook.useUpdateBookingStep(bookingApi.updateStep3);
  const updateStep4Mutation = bookingHook.useUpdateBookingStep(bookingApi.updateStep4);
  const updateScheduleMutation = bookingHook.useUpdateBookingStep(bookingApi.updateSchedule);

  const totalActionSteps = 8; // Adjust this if you include 'Finalize' as a distinct content step // Your actual steps with content are 1-8
  const totalDisplaySteps = 8; // If you want your visual stepper to show 8 circles

  // The progressPercentage should ideally be based on `totalActionSteps` if it represents actual data submission/form completion
  const progressPercentage = currentStep > 0 && currentStep <= totalActionSteps ? ((currentStep) / totalActionSteps) * 100 : 0;

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const updateLocalBookingData = (stepData: any) => {
    setBookingFormData(prev => ({ ...prev, ...stepData }));
  };
  // Prevent duplicate executions
  const transferAttempted = useRef(false);
  const [isTransferringBooking, setIsTransferringBooking] = useState(false);

  // This effect runs when currentStep changes, specifically after step 6 (now Step 7)
  useEffect(() => {
    // If we transition to Step 7 (CheckoutWithStripe), check authentication
    if (currentStep === 7) { // This corresponds to Step7CheckoutWithStripe based on your 'steps' array below
      if (!isAuthenticated) {
        localStorage.setItem('postLoginRedirect', '/booking?resume=true');
        router.push('/login?source=booking');
      }
    }
  }, [currentStep, isAuthenticated, router]);

  const handleTransferGuestBooking = useCallback(async () => {
    try {
      const draftBookingResponse = await createDraftBookingMutation.mutateAsync(undefined);
      if (!draftBookingResponse?.uuid) {
        throw new Error('Failed to create draft booking.');
      }

      if (draftBookingResponse && draftBookingResponse.uuid) {
        const newBookingUuid = draftBookingResponse.uuid;
        setBookingUuid(newBookingUuid);

        // @ts-expect-error // Consider refining types if possible
        await updateStep1Mutation.mutateAsync({ uuid: newBookingUuid, payload: { ...stepOne } }, {
          onSuccess: (data) => console.log('[success] Step 1:', data),
          onError: (error) => console.log('[error] Step 1:', error),
        });

        // @ts-expect-error // Consider refining types if possible
        await updateStep2Mutation.mutateAsync({ uuid: newBookingUuid, payload: { ...stepTwo } }, {
          onSuccess: (data) => console.log('[success] Step 2:', data),
          onError: (error) => console.log('[error] Step 2:', error),
        });

        await updateStep3Mutation.mutateAsync({ uuid: newBookingUuid, payload: { ...stepThree } }, {
          onSuccess: (data) => console.log('[success] Step 3:', data),
          onError: (error) => console.log('[error] Step 3:', error),
        });

        // @ts-expect-error // Consider refining types if possible
        await updateStep4Mutation.mutateAsync({ uuid: newBookingUuid, payload: { ...stepFour } }, {
          onSuccess: (data) => console.log('[success] Step 4:', data),
          onError: (error) => console.log('[error] Step 4:', error),
        });

        // @ts-expect-error // Consider refining types if possible
        await updateScheduleMutation.mutateAsync({ uuid: newBookingUuid, payload: { ...stepSix } }, {
          onSuccess: (data) => console.log('[success] Step 6 Schedule:', data),
          onError: (error) => console.log('[error] Step 6 Schedule:', error),
        });

        resetGuestBooking();

        // Clear the resume flag from URL
        localStorage.removeItem('postLoginRedirect');

        // Navigate to checkout
        router.push(`/customer/booking?checkout=true&bookingId=${draftBookingResponse.uuid}`);
      }
    } catch (error) {
      console.error('Error transferring guest booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to transfer your booking. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [createDraftBookingMutation, resetGuestBooking, router, stepFour, stepOne, stepSix, stepThree, stepTwo, toast, updateScheduleMutation, updateStep1Mutation, updateStep2Mutation, updateStep3Mutation, updateStep4Mutation]);

  // Function to handle resuming booking after login
  useEffect(() => {
    if (resume === 'true' && isAuthenticated && user && !transferAttempted.current) {
      transferAttempted.current = true;
      setIsTransferringBooking(true);
      console.log("Attempting to transfer guest booking...");
      handleTransferGuestBooking().then(() => {
        console.log("Guest booking transfer successfully initiated.");
      }).catch((error) => {
        console.error("Guest booking transfer failed:", error);
        setIsTransferringBooking(false);
      }).finally(() => {
          setIsTransferringBooking(false);
        });
    }
  }, [resume, isAuthenticated, user, handleTransferGuestBooking]);

  // Define steps for the visual stepper.
  // Note: Your `currentStep` starts from 1, and your `steps` array is 0-indexed.
  // The first element `title: 'Start Booking'` seems like an internal step 0,
  // so `currentStep` 1 aligns with `Step0ServiceArea`.
  const displaySteps = [
    { id: 1, label: 'Service Area' },
    { id: 2, label: 'Service Type' },
    { id: 3, label: 'Property Details' },
    { id: 4, label: 'Add-Ons' },
    { id: 5, label: 'Cleaner Level' },
    { id: 6, label: 'Review Quote' },
    { id: 7, label: 'Schedule & Address' },
    { id: 8, label: 'Checkout' },
    // Step 8 'Confirmation' is handled as a separate return block, not part of the main flow
  ];


  // This maps the currentStep (1-indexed) to the correct component to render
  const stepComponents: { [key: number]: React.ComponentType<any> } = {
    1: Step0ServiceArea,
    2: Step1CleanType,
    3: Step2PropertyDetails,
    4: Step3AddOns,
    5: Step4CleanerLevel,
    6: Step5ReviewConfirmQuote,
    7: Step6Schedule,
    8: Step7CheckoutWithStripe,
  };

  const CurrentStepComponent = stepComponents[currentStep];

  // Determine the card title based on the current step's label
  const cardTitle = displaySteps.find(step => step.id === currentStep)?.label || 'Initializing Booking';


  if (isTransferringBooking) {
    return (
      <div className="container mx-auto p-4 max-w-3xl flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-6 text-xl font-semibold text-gray-700">Transferring your booking...</p>
        <p className="text-md text-muted-foreground">Please wait a moment while we set things up for you.</p>
      </div>
    );
  }

  // Handle Confirmation Page (Step 8 / Final Step)
  // Your `totalActionSteps` is 8 (for steps 1-8).
  // If `currentStep` goes beyond `totalActionSteps`, it means we are at the final confirmation.
  if (currentStep > totalActionSteps) { // If currentStep becomes 9 (after checkout)
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Booking Complete!</CardTitle>
          </CardHeader>
          <Step8Confirmation
            bookingUuid={bookingUuid || ''}
            onNext={handleNext} // This `onNext` might be used for 'Go to dashboard' or similar
            isAuthenticated={isAuthenticated}
          />
        </Card>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto p-4 max-w-3xl flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading page...</p>
      </div>
    }>
      <div className="container mx-auto p-4 max-w-3xl">
        <Card className="shadow-lg">
          <CardHeader className="pb-4"> {/* Add some padding bottom to CardHeader */}
            {/* Visual Stepper */}
            <Stepper
              steps={displaySteps}
              currentStep={currentStep}
              totalSteps={totalDisplaySteps}
            />
            <CardTitle className="text-2xl text-center mt-4">{cardTitle}</CardTitle>
            <CardDescription className="text-center pt-1">
              Step {currentStep} of {totalActionSteps}
            </CardDescription>
          </CardHeader>

          {/* Render the current step component only if it exists */}
          {CurrentStepComponent && (
            <div className="p-6"> {/* Add padding around the content */}
              <CurrentStepComponent
                bookingUuid={bookingUuid || ''}
                onNext={handleNext}
                onBack={currentStep > 1 ? handleBack : undefined}
                setBookingData={updateLocalBookingData}
                bookingData={bookingFormData}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </Card>
      </div>
    </Suspense>
  );
}