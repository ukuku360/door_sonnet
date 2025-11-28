import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/storage';
import { formatInTimeZone } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

/**
 * GET /api/data/csv - Download CSV file directly
 */
export async function GET() {
  try {
    const submissions = await getAllSubmissions();

    // BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';

    // CSV header
    let csv = BOM + 'No,Submitted At,Unit Number,Name\n';

    // CSV data (newest first)
    submissions.reverse().forEach((entry, index) => {
      const escapedName = entry.firstName.replace(/"/g, '""');
      csv += `${index + 1},"${entry.timestamp}","${entry.unitNumber}","${escapedName}"\n`;
    });

    // Include current date in filename
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

