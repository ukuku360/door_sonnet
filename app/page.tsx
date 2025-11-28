import AccessLogForm from '@/components/AccessLogForm';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-roomingkos-500 px-6 py-3 rounded-lg shadow-lg">
              <span className="text-white text-2xl font-bold tracking-wide">
                RoomingKos
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Door System Update
          </h1>

          <div className="bg-roomingkos-50 border border-roomingkos-200 rounded-lg p-6 text-left shadow-sm">
            <h2 className="text-xl font-semibold text-roomingkos-700 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Notice
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We are currently updating the building door system, and some residents
              may experience issues accessing the building with their key cards.
              We apologize for the inconvenience.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Please enter your information below so we can resolve the issue promptly.
            </p>
          </div>
        </div>

        <div className="mb-6 max-w-md mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 text-sm font-medium">
              Please tap your keycard before entering your unit number and name
            </p>
          </div>
        </div>

        <AccessLogForm />

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>If you have any questions, please contact the management office.</p>
          <p className="mt-2 text-roomingkos-500 font-medium">© RoomingKos</p>
        </footer>
      </div>
    </main>
  );
}
