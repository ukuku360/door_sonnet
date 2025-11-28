import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '기숙사 도어 접근 문제 신고',
  description: '키카드 접근 문제 신고 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
