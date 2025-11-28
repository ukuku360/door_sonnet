import { NextRequest, NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/storage';

/**
 * GET /api/data - View all submissions
 * Returns an HTML page with all submissions displayed in a table
 */
export async function GET(request: NextRequest) {
  try {
    const submissions = await getAllSubmissions();

    // Create HTML page
    const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>도어 접근 문제 신고 내역</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
            background-color: #f9fafb;
            padding: 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #2563eb;
            color: white;
            padding: 24px;
          }
          .header h1 {
            font-size: 24px;
            margin-bottom: 8px;
          }
          .stats {
            background: #eff6ff;
            padding: 16px 24px;
            border-bottom: 1px solid #dbeafe;
          }
          .stats-item {
            display: inline-block;
            margin-right: 24px;
            color: #1e40af;
          }
          .stats-label {
            font-weight: bold;
            margin-right: 8px;
          }
          .table-container {
            overflow-x: auto;
            padding: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            color: #1f2937;
          }
          tr:hover {
            background: #f9fafb;
          }
          .empty {
            text-align: center;
            padding: 48px 24px;
            color: #6b7280;
          }
          .download-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-left: 24px;
          }
          .download-btn:hover {
            background: #1d4ed8;
          }
          @media (max-width: 768px) {
            .table-container {
              padding: 12px;
            }
            th, td {
              padding: 8px;
              font-size: 14px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>도어 접근 문제 신고 내역</h1>
            <p>기숙사 키카드 접근 문제 제출 기록</p>
          </div>

          <div class="stats">
            <div class="stats-item">
              <span class="stats-label">총 신고 건수:</span>
              <span>${submissions.length}건</span>
            </div>
            <button class="download-btn" onclick="downloadCSV()">CSV 다운로드</button>
          </div>

          <div class="table-container">
            ${submissions.length === 0 ? `
              <div class="empty">
                <p>아직 제출된 데이터가 없습니다.</p>
              </div>
            ` : `
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제출 시간</th>
                    <th>유닛 넘버</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  ${submissions.map((entry, index) => `
                    <tr>
                      <td>${submissions.length - index}</td>
                      <td>${entry.timestamp}</td>
                      <td>${entry.unitNumber}</td>
                      <td>${entry.firstName}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

        <script>
          function downloadCSV() {
            const data = ${JSON.stringify(submissions)};

            // Create CSV content
            let csv = '제출 시간,유닛 넘버,이름\\n';
            data.forEach(entry => {
              csv += \`"\${entry.timestamp}","\${entry.unitNumber}","\${entry.firstName}"\\n\`;
            });

            // Create blob and download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', \`door-access-log-\${new Date().toISOString().split('T')[0]}.csv\`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
