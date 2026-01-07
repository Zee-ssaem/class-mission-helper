'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WaitingListWithCheckbox from '@/components/admin/WaitingListWithCheckbox';
import MissionAssignment from '@/components/admin/MissionAssignment';
import CompletedMissionsList from '@/components/admin/CompletedMissionsList';
import StudentMissionStats from '@/components/admin/StudentMissionStats';

export default function AdminDashboard() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAssignmentComplete = () => {
    setSelectedStudents([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              교사 관리 페이지
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 왼쪽: 대기 명단 (체크박스) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <WaitingListWithCheckbox
                selectedStudents={selectedStudents}
                onSelectionChange={setSelectedStudents}
              />
            </div>

            {/* 오른쪽: 미션 부여 폼 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <MissionAssignment
                selectedStudents={selectedStudents}
                onAssignmentComplete={handleAssignmentComplete}
              />
            </div>
          </div>

          {/* 아래: 학생별 미션 완료 횟수 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <StudentMissionStats />
          </div>

          {/* 아래: 해결된 미션 목록 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CompletedMissionsList />
          </div>
        </div>
      </main>
    </div>
  );
}

