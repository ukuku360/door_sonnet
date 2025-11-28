import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/storage';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

/**
 * GET /api/data/csv - CSV 파일 직접 다운로드
 */
export async function GET() {
  try {
    const submissions = await getAllSubmissions();

    // BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';

    // CSV 헤더
    let csv = BOM + '번호,제출 시간,유닛 넘버,이름\n';

    // CSV 데이터 (최신순)
    submissions.reverse().forEach((entry, index) => {
      const escapedName = entry.firstName.replace(/"/g, '""');
      csv += `${index + 1},"${entry.timestamp}","${entry.unitNumber}","${escapedName}"\n`;
    });

    // 파일명에 현재 날짜 포함
    const dateStr = formatInTimeZone(new Date(), TIMEZONE, 'yyyy-MM-dd_HHmmss');
    const filename = `door-access-log_${dateStr}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating CSV:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}

