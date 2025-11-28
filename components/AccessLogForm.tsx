'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormInput from './FormInput';
import LoadingSpinner from './LoadingSpinner';
import type { FormErrors } from '@/lib/types';

const STORAGE_KEY = 'door_log_submissions';
const MAX_SUBMISSIONS = 3;

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
      newErrors.unitNumber = '유닛 넘버를 입력해 주세요';
    } else if (isNaN(unitNum)) {
      newErrors.unitNumber = '유닛 넘버는 숫자만 입력 가능합니다';
    } else if (unitNum < 1 || unitNum > 9999) {
      newErrors.unitNumber = '유닛 넘버는 1-9999 범위 내여야 합니다';
    }

    // Validate first name
    if (!firstName.trim()) {
      newErrors.firstName = '이름을 입력해 주세요';
    } else if (firstName.trim().length > 50) {
      newErrors.firstName = '이름은 50자 이내로 입력해 주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Check submission limit
    if (submissionCount >= MAX_SUBMISSIONS) {
      setGeneralError('이미 3회 제출하셨습니다. 관리자에게 직접 연락해 주세요.');
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
          setGeneralError(data.message || '이미 3회 제출하셨습니다. 관리자에게 직접 연락해 주세요.');
          // Update local count
          const newCount = MAX_SUBMISSIONS;
          localStorage.setItem(STORAGE_KEY, newCount.toString());
          setSubmissionCount(newCount);
        } else if (response.status === 400) {
          setGeneralError(data.message || '입력한 정보를 확인해 주세요.');
        } else {
          setGeneralError(data.message || '제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      setGeneralError('네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLimitReached = submissionCount >= MAX_SUBMISSIONS;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <FormInput
        label="유닛 넘버"
        name="unitNumber"
        type="number"
        value={unitNumber}
        onChange={(e) => setUnitNumber(e.target.value)}
        error={errors.unitNumber}
        required
        placeholder="예: 101"
      />

      <FormInput
        label="이름"
        name="firstName"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={errors.firstName}
        required
        placeholder="예: 홍길동"
      />

      {generalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {generalError}
        </div>
      )}

      {isLimitReached ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
          제출 한도에 도달했습니다. 추가 지원이 필요하시면 관리자에게 직접 연락해 주세요.
        </div>
      ) : (
        <>
          {submissionCount > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              {submissionCount}/{MAX_SUBMISSIONS}회 제출 완료
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-4 rounded-lg font-medium text-white
              transition-colors duration-200
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }
            `}
          >
            {isSubmitting ? <LoadingSpinner /> : '제출하기'}
          </button>
        </>
      )}

      <p className="mt-4 text-sm text-gray-500 text-center">
        * 필수 항목
      </p>
    </form>
  );
}
