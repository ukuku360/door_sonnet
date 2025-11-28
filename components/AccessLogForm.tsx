'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './FormInput';
import LoadingSpinner from './LoadingSpinner';
import type { FormErrors } from '@/lib/types';

const STORAGE_KEY = 'door_log_submissions';
const MAX_SUBMISSIONS = 20;

export default function AccessLogForm() {
  const router = useRouter();
  const [unitNumber, setUnitNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);

  // Check localStorage for submission count on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const count = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
      setSubmissionCount(count);
    }
  }, []);

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate unit number
    const unitNum = parseInt(unitNumber);
    if (!unitNumber) {
      newErrors.unitNumber = 'Please enter your unit number';
    } else if (isNaN(unitNum)) {
      newErrors.unitNumber = 'Unit number must be numeric';
    } else if (unitNum < 1 || unitNum > 9999) {
      newErrors.unitNumber = 'Unit number must be between 1-9999';
    }

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = 'Please enter your name';
    } else if (firstName.trim().length > 50) {
      newErrors.firstName = 'Name must be 50 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Check submission limit
    if (submissionCount >= MAX_SUBMISSIONS) {
      setGeneralError('You have reached the submission limit. Please contact management directly.');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitNumber: parseInt(unitNumber),
          firstName: firstName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Increment submission count in localStorage
        const newCount = submissionCount + 1;
        localStorage.setItem(STORAGE_KEY, newCount.toString());
        setSubmissionCount(newCount);

        // Redirect to success page
        router.push('/success');
      } else {
        if (response.status === 429) {
          setGeneralError(data.message || 'You have reached the submission limit. Please contact management directly.');
          // Update local count
          const newCount = MAX_SUBMISSIONS;
          localStorage.setItem(STORAGE_KEY, newCount.toString());
          setSubmissionCount(newCount);
        } else if (response.status === 400) {
          setGeneralError(data.message || 'Please check the information you entered.');
        } else {
          setGeneralError(data.message || 'An error occurred during submission. Please try again.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setGeneralError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLimitReached = submissionCount >= MAX_SUBMISSIONS;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <FormInput
        label="Unit Number"
        name="unitNumber"
        type="number"
        value={unitNumber}
        onChange={(e) => setUnitNumber(e.target.value)}
        error={errors.unitNumber}
        required
        placeholder="e.g. 101"
      />

      <FormInput
        label="Name"
        name="firstName"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={errors.firstName}
        required
        placeholder="e.g. John"
      />

      {generalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {generalError}
        </div>
      )}

      {isLimitReached ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          You have reached the submission limit. Please contact management directly for further assistance.
        </div>
      ) : (
        <>
          {submissionCount > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              {submissionCount}/{MAX_SUBMISSIONS} submissions completed
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold text-white
              transition-all duration-200 shadow-md
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-roomingkos-500 hover:bg-roomingkos-600 active:bg-roomingkos-700 hover:shadow-lg'
              }
            `}
          >
            {isSubmitting ? <LoadingSpinner /> : 'Submit'}
          </button>
        </>
      )}

      <p className="mt-4 text-sm text-gray-500 text-center">
        * Required fields
      </p>
    </form>
  );
}
