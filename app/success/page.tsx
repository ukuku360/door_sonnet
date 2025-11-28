import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            제출 완료!
          </h1>

          <p className="text-gray-700 mb-2">
            정보가 성공적으로 제출되었습니다.
          </p>

          <p className="text-gray-700 mb-6">
            관리자가 확인 후 빠르게 조치하겠습니다.
          </p>

          <p className="text-gray-600 text-sm mb-8">
            감사합니다.
          </p>

          <Link
            href="/"
            className="inline-block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            다른 정보 제출하기
          </Link>
        </div>
      </div>
    </main>
  );
}
