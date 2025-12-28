import { redirect } from 'next/navigation';
import { getStudentSession } from '@/lib/auth/session';
import MissionApplication from '@/components/student/MissionApplication';
import MyMissionList from '@/components/student/MyMissionList';
import WaitingList from '@/components/student/WaitingList';

export default async function StudentDashboard() {
  const studentName = await getStudentSession();

  if (!studentName) {
    redirect('/login');
  }

  const handleLogout = async () => {
    'use server';
    const { clearStudentSession } = await import('@/lib/auth/session');
    await clearStudentSession();
    redirect('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              교실 미션 해결사
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">안녕하세요, {studentName}님</span>
              <form action={handleLogout}>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  로그아웃
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽 영역: 개인 영역 */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <MissionApplication />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <MyMissionList />
            </div>
          </div>

          {/* 오른쪽 영역: 공유 영역 */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <WaitingList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

