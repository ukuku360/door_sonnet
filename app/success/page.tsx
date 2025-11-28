import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-roomingkos-500 px-4 py-2 rounded-lg">
              <span className="text-white text-lg font-bold tracking-wide">
                <span className="opacity-70 font-normal text-sm mr-0.5">S</span>
                RoomingKos
              </span>
            </div>
          </div>

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
            Submission Complete!
          </h1>

          <p className="text-gray-700 mb-2">
            Your information has been submitted successfully.
          </p>

          <p className="text-gray-700 mb-6">
            Management will review and take action promptly.
          </p>

          <p className="text-gray-600 text-sm mb-8">
            Thank you.
          </p>

          <Link
            href="/"
            className="inline-block w-full py-3 px-4 bg-roomingkos-500 hover:bg-roomingkos-600 active:bg-roomingkos-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Submit Another Entry
          </Link>

          <p className="mt-6 text-roomingkos-500 font-medium text-sm">© RoomingKos</p>
        </div>
      </div>
    </main>
  );
}
