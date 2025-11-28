import AccessLogForm from '@/components/AccessLogForm';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            RoomingKos Door Update
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
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

        <AccessLogForm />

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>If you have any questions, please contact the management office.</p>
        </footer>
      </div>
    </main>
  );
}
