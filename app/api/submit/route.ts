import { NextRequest, NextResponse } from 'next/server';
import { AccessLogSchema } from '@/lib/validation';
import { hasExceededLimit, incrementSubmissionCount } from '@/lib/rateLimit';
import { addSubmission } from '@/lib/storage';
import { sendAdminNotification } from '@/lib/emailNotification';
import type { ApiResponse } from '@/lib/types';

/**
 * Extract IP address from request
 */
function getClientIp(request: NextRequest): string {
  // Try various headers for IP address (for different hosting environments)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  // Fallback
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Extract client IP
    const clientIp = getClientIp(request);

    // Check rate limit
    if (hasExceededLimit(clientIp)) {
      const response: ApiResponse = {
        success: false,
        message: '이미 3회 제출하셨습니다. 관리자에게 직접 연락해 주세요.',
      };
      return NextResponse.json(response, { status: 429 });
    }

    // Parse request body
    const body = await request.json();

    // Validate input with Zod
    const validationResult = AccessLogSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      const response: ApiResponse = {
        success: false,
        message: firstError.message || '입력한 정보를 확인해 주세요.',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const data = validationResult.data;

    // Increment submission count for this IP
    incrementSubmissionCount(clientIp);

    // Track successes and failures
    let storageSuccess = false;
    let emailSuccess = false;
    const warnings: string[] = [];

    // Attempt to save to local storage
    try {
      await addSubmission(data);
      storageSuccess = true;
    } catch (error) {
      console.error('Failed to save to storage:', error);
      warnings.push('데이터 저장에 실패했습니다.');
    }

    // Attempt to send email notification
    try {
      await sendAdminNotification(data);
      emailSuccess = true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      warnings.push('이메일 알림 전송에 실패했습니다.');
    }

    // Determine response based on results
    if (storageSuccess && emailSuccess) {
      // Complete success
      const response: ApiResponse = {
        success: true,
        message: '정보가 성공적으로 제출되었습니다.',
      };
      return NextResponse.json(response, { status: 200 });
    } else if (storageSuccess || emailSuccess) {
      // Partial success
      const response: ApiResponse = {
        success: true,
        message: '정보가 제출되었습니다.',
        warnings,
      };
      return NextResponse.json(response, { status: 207 }); // Multi-Status
    } else {
      // Both failed
      const response: ApiResponse = {
        success: false,
        message: '제출 중 오류가 발생했습니다. 관리자에게 직접 연락해 주세요.',
      };
      return NextResponse.json(response, { status: 500 });
    }
  } catch (error) {
    console.error('Unexpected error in /api/submit:', error);
    const response: ApiResponse = {
      success: false,
      message: '서버 오류가 발생했습니다. 다시 시도해 주세요.',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// Reject non-POST requests
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
