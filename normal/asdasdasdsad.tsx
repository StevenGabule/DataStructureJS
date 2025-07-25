/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CleanType,
  DiscountValidationResponse,
  RecurringFrequency,
  StepProps,
  UpdateBookingStep1Payload,
} from '@/lib/types/booking';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/lib/hooks/use-booking';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as bookingApi from '@/lib/api/booking';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { AxiosError } from 'axios';
import { useHydratedGuestBookingStore } from '@/lib/store/use-hydrad-guest-booking-store';

const step1Schema = z.object({
  cleanTypeId: z.string().min(1, 'Please select a clean type.'), // Will be string from Select, convert to number on submit
  recurringFrequencyId: z.string().optional(),
  discountCode: z.string().optional(),
}).refine((data: any) => {
  console.log({ data });
  return true;
}, {
  message: 'Recurring frequency is required for this clean type.',
  path: ['recurringFrequencyId'],
});

type Step1FormData = z.infer<typeof step1Schema>;

// Step 1: Clean Type & Discount
export const Step1CleanType: React.FC<StepProps> = ({
  bookingUuid,
  onNext,
  bookingData,
  setBookingData,
  isAuthenticated,
}) => {
  const { toast } = useToast();
  const { setCleanType, stepOne, hydrated } = useHydratedGuestBookingStore();
  const updateBookingStepMutation = useBooking().useUpdateBookingStep;
  const validateDiscountCodeMutation = useBooking().useValidateDiscountCode;
  const [discountValidationResult, setDiscountValidationResult] = useState<DiscountValidationResponse | null>(null);

  const form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      cleanTypeId: bookingData?.cleanTypeId?.toString() || stepOne.cleanTypeId?.toString() || '',
      recurringFrequencyId: bookingData?.recurringFrequencyId?.toString() || stepOne.recurringFrequencyId || '',
      discountCode: bookingData?.discountCode || stepOne.discountCode || '',
    },
  });

  const { data: cleanTypesData = [], isLoading: isLoadingCleanTypesArray } = useQuery<
    CleanType[],
    Error,
    CleanType[],
    readonly ['cleanTypesData']
  >({
    queryKey: ['cleanTypesData'],
    queryFn: async (): Promise<CleanType[]> => bookingApi.getCleanTypes(),
  });

  const { data: recurringFrequencyArray = [], isLoading: isLoadingFreq } = useQuery<
    RecurringFrequency[],
    Error,
    RecurringFrequency[],
    readonly ['recurringFrequencyArray']
  >({
    queryKey: ['recurringFrequencyArray'],
    queryFn: async (): Promise<RecurringFrequency[]> => bookingApi.getRecurringFrequencies(),
  });

  const selectedCleanTypeId = form.watch('cleanTypeId');
  const watchedDiscountCode = form.watch('discountCode');
  const selectedCleanType = useMemo(() => cleanTypesData?.find((ct: any) => ct.id.toString() === selectedCleanTypeId), [cleanTypesData, selectedCleanTypeId]);
  const watchedRecurringFrequencyId = form.watch('recurringFrequencyId');

  useEffect(() => {
    // Reset frequency if clean type changes and doesn't support recurring
    if (selectedCleanType && !selectedCleanType.isRecurringOption) {
      form.setValue('recurringFrequencyId', '');
    }
  }, [selectedCleanType, form]);

  useEffect(() => {
    if (!watchedDiscountCode?.trim()) {
      setDiscountValidationResult(null);
      validateDiscountCodeMutation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDiscountCode]);

  const updateStep1Mutation = updateBookingStepMutation(bookingApi.updateStep1);

  const onSubmit: SubmitHandler<Step1FormData> = async (formData) => {
    if (!selectedCleanType) {
      toast({ title: 'Validation Error', description: 'Please select a clean type.', variant: 'destructive' });
      return;
    }

    const codeToSubmit = (discountValidationResult?.isValid && discountValidationResult.code === formData.discountCode?.trim())
      ? formData.discountCode?.trim()
      : (formData.discountCode?.trim() && !discountValidationResult) // if user typed something but didn't hit apply
        ? formData.discountCode?.trim()
        : undefined;

    const payload: UpdateBookingStep1Payload = {
      cleanTypeId: parseInt(formData.cleanTypeId),
      // @ts-expect-error err
      recurringFrequencyId: selectedCleanType?.isRecurringOption && formData.recurringFrequencyId ? parseInt(formData.recurringFrequencyId) : undefined,
      discountCode: codeToSubmit,
    };

    try {
      if (!isAuthenticated) {
        setCleanType({
          cleanTypeId: parseInt(formData.cleanTypeId),
          // @ts-expect-error err
          recurringFrequencyId: selectedCleanType?.isRecurringOption && formData.recurringFrequencyId ? parseInt(formData.recurringFrequencyId) : undefined,
          discountCode: codeToSubmit,
        });
      } else {
        await updateStep1Mutation.mutateAsync({ uuid: bookingUuid, payload });
        setBookingData?.(payload);
      }

      toast({ title: 'Step 1 Saved!', description: 'Proceed to the next step.' });
      onNext();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save step 1.',
        variant: 'destructive',
      });
    }
  };

  const handleApplyDiscount = async () => {
    const code = form.getValues('discountCode')?.trim();
    if (!code) {
      toast({ title: 'No Code', description: 'Please enter a discount code to apply.', variant: 'default' });
      setDiscountValidationResult(null); // Clear previous validation
      return;
    }
    try {
      const result = await validateDiscountCodeMutation.mutateAsync(code);
      setDiscountValidationResult(result);
      if (result.isValid) {
        toast({ title: 'Discount Applied!', description: result.message }); // , className: "bg-green-100 text-green-700" }
      } else {
        toast({ title: 'Invalid Discount', description: result.message, variant: 'destructive' });
      }
    } catch (error: any) {
      const defaultMessage = 'Could not validate discount code. Please try again.';
      setDiscountValidationResult({ isValid: false, message: defaultMessage, code });
      toast({ title: 'Validation Error', description: error.message || defaultMessage, variant: 'destructive' });
    }
  };

  if (isLoadingCleanTypesArray || isLoadingFreq || !hydrated) {
    return (
      <CardContent className={'space-y-6'}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className={'h-48 w-full'} />)}
        </div>
        <Skeleton className={'h-10 w-1/2'} />
        <Skeleton className={'h-10 w-full'} />
        <Skeleton className={'h-10 w-full'} />
      </CardContent>
    );
  }

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cleanTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What type of clean do you need?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {cleanTypesData.map((ct) => (
                        <Card key={ct.id} onClick={() => {
                          form.setValue('cleanTypeId', ct.id.toString(), { shouldValidate: true });
                        }} className={`cursor-pointer transition-all hover:shadow-lg ${selectedCleanTypeId === ct.id.toString()
                            ? 'border-2 border-green-600 ring-2 ring-green-600 shadow-xl' :
                            'border'
                          }`}>
                          <CardHeader className={'relative'}>
                            <CardTitle className={'mb-2 text-center'}>{ct.name}</CardTitle>
                            <CardDescription className={'text-xs overflow-hidden text-center'}>
                              {ct.description}
                            </CardDescription>
                            {selectedCleanTypeId === ct.id.toString() && (
                              <CheckCircle2 className={'absolute -top-2 right-3 h-6 w-6 text-green-600'} />
                            )}
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </FormControl>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedCleanType?.isRecurringOption && (
            <FormField
              control={form.control}
              name="recurringFrequencyId"
              render={() => (
                <FormItem>
                  <FormLabel className="font-semibold mb-2">
                    How often would you like this service?
                  </FormLabel>
                  <FormControl>
                    {/* Card-based selection for recurring frequencies */}
                    <div className="flex pt-1 pb-1 flex-col gap-3">
                      {recurringFrequencyArray?.map(rf =>
                        <Card
                          key={rf.id}
                          onClick={() => {
                            form.setValue('recurringFrequencyId', rf.id.toString(), { shouldValidate: true });
                          }}
                          // Added min-w-[value] or w-[value] for better horizontal layout control
                          className={`cursor-pointer transition-all hover:shadow-lg flex flex-col w-full py-2 gap-0 ${watchedRecurringFrequencyId === rf.id.toString()
                              ? 'border-2 border-green-600 ring-2 ring-green-600 shadow-md'
                              : 'border'
                            }`}
                        >
                          <CardHeader className=" relative">
                            <CardTitle className="text-sm md:text-base flex items-center justify-between">
                              <span>{rf.name}</span>

                              {rf.discountPercentage && parseFloat(rf.discountPercentage) > 0 ? (
                                <p className="text-xs font-semibold text-green-600 mr-8 translate-3">
                                  {rf.discountPercentage}% OFF
                                </p>
                              ) : (
                                <p className="text-xs text-muted-foreground">Standard Rate</p>
                              )}

                            </CardTitle>
                            {watchedRecurringFrequencyId === rf.id.toString() && (
                              <CheckCircle2 className="absolute top-4 right-4 h-4 w-4 md:h-5 md:w-5 text-primary" />
                            )}
                          </CardHeader>
                          <CardContent className=" pt-0"> {/* Adjusted padding */}

                            <p className="text-xs text-muted-foreground mt-1">
                              Every {rf.intervalDays === 7 ? 'week' : `${rf.intervalDays / 7} weeks`}
                            </p>
                          </CardContent>
                        </Card>,
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Discount Code Input with Apply Button and Feedback */}
          <FormField
            control={form.control}
            name="discountCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount/Referral Code (Optional)</FormLabel>
                <div className="flex items-start space-x-2">
                  <FormControl>
                    <Input
                      placeholder="Enter code"
                      {...field}
                      value={field.value || ''}
                      onChange={e => {
                        field.onChange(e.target.value.toUpperCase());
                        setDiscountValidationResult(null);
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyDiscount}
                    disabled={validateDiscountCodeMutation.isPending || !watchedDiscountCode?.trim()}
                  >
                    {validateDiscountCodeMutation.isPending ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                <FormMessage />
                {/* Display validation result */}
                {validateDiscountCodeMutation.isSuccess && discountValidationResult && (
                  <div className={`mt-2 text-sm p-3 rounded-md flex items-center gap-2 ${discountValidationResult.isValid
                      ? 'bg-green-50 text-green-700 border border-green-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {discountValidationResult.isValid
                      ? <Sparkles className="h-5 w-5 text-green-500" /> :
                      <AlertCircle className="h-5 w-5 text-red-500" />}
                    <span>
                      {discountValidationResult.message}
                    </span>
                  </div>
                )}
                {validateDiscountCodeMutation.isError && (
                  <div
                    className="mt-2 text-sm p-3 rounded-md flex items-center gap-2 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>
                      {(validateDiscountCodeMutation.error as AxiosError<any>)?.response?.data?.message ||
                        'Error validating discount.'}
                    </span>
                  </div>
                )}
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={updateStep1Mutation.isPending || validateDiscountCodeMutation.isPending}
            className="w-full">
            {updateStep1Mutation.isPending ?
              'Saving...' :
              'Next: Property Details'
            }
          </Button>
        </form>
      </Form>
    </CardContent>
  );
};
