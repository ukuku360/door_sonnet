import AccessLogForm from '@/components/AccessLogForm';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            기숙사 도어 접근 문제 신고
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              안내사항
            </h2>
            <p className="text-gray-700 leading-relaxed">
              현재 빌딩 도어 시스템 업데이트 중으로 일부 거주자분들께서
              키카드로 건물에 접근하실 수 없는 문제가 발생하고 있습니다.
              불편을 드려 죄송합니다.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              문제 해결을 위해 아래 정보를 입력해 주시면 빠르게 조치하겠습니다.
            </p>
          </div>
        </div>

        <AccessLogForm />

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>문의사항이 있으시면 관리실로 연락해 주세요.</p>
        </footer>
      </div>
    </main>
  );
}
