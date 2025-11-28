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
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Door Access Issue Reports - RoomingKos</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: #fef7f7;
            background-image: 
              radial-gradient(circle at 25% 25%, rgba(195, 60, 60, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(195, 60, 60, 0.03) 0%, transparent 50%);
            padding: 24px;
            min-height: 100vh;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(195, 60, 60, 0.08);
            overflow: hidden;
            border: 1px solid #fecaca;
          }
          .header {
            background: linear-gradient(135deg, #C33C3C 0%, #9A2E2E 100%);
            color: white;
            padding: 28px 32px;
          }
          .logo {
            display: inline-block;
            background: rgba(255,255,255,0.15);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }
          .header h1 {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 6px;
          }
          .header p {
            opacity: 0.9;
            font-size: 14px;
          }
          .stats {
            background: #fef2f2;
            padding: 16px 32px;
            border-bottom: 1px solid #fecaca;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }
          .stats-item {
            color: #9A2E2E;
            font-weight: 500;
          }
          .stats-label {
            font-weight: 600;
            margin-right: 6px;
          }
          .stats-value {
            background: #C33C3C;
            color: white;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 14px;
          }
          .table-container {
            overflow-x: auto;
            padding: 24px 32px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            padding: 14px 16px;
            text-align: left;
            font-weight: 600;
            color: #9A2E2E;
            border-bottom: 2px solid #fecaca;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #fee2e2;
            color: #374151;
            font-size: 14px;
          }
          tr:hover {
            background: #fef7f7;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .empty {
            text-align: center;
            padding: 64px 24px;
            color: #9A2E2E;
          }
          .empty-icon {
            font-size: 48px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          .download-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #C33C3C 0%, #9A2E2E 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(195, 60, 60, 0.25);
          }
          .download-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(195, 60, 60, 0.35);
          }
          .download-btn svg {
            width: 16px;
            height: 16px;
          }
          @media (max-width: 768px) {
            body { padding: 16px; }
            .header { padding: 20px; }
            .stats { padding: 12px 20px; }
            .table-container { padding: 16px; }
            th, td {
              padding: 10px 12px;
              font-size: 13px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">RoomingKos</div>
            <h1>Door Access Issue Reports</h1>
            <p>Keycard access issue submission log</p>
          </div>

          <div class="stats">
            <div class="stats-item">
              <span class="stats-label">Total Reports:</span>
              <span class="stats-value">${submissions.length}</span>
            </div>
            <a href="/api/data/csv" class="download-btn">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download CSV
            </a>
          </div>

          <div class="table-container">
            ${submissions.length === 0 ? `
              <div class="empty">
                <div class="empty-icon">📋</div>
                <p>No submissions yet.</p>
              </div>
            ` : `
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Submitted At</th>
                    <th>Unit Number</th>
                    <th>Name</th>
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
