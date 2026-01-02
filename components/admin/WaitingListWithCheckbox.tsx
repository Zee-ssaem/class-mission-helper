'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface WaitingStudent {
  student_name: string;
  created_at: string;
}

interface WaitingListWithCheckboxProps {
  selectedStudents: string[];
  onSelectionChange: (students: string[]) => void;
}

export default function WaitingListWithCheckbox({
  selectedStudents,
  onSelectionChange,
}: WaitingListWithCheckboxProps) {
  const [waitingStudents, setWaitingStudents] = useState<WaitingStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // 초기 데이터 로드
    const fetchWaitingStudents = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('missions')
          .select('student_name, created_at')
          .eq('status', 'pending')
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        // 중복 제거
        const uniqueStudents = Array.from(
          new Map(data?.map((s) => [s.student_name, s]) || []).values()
        );

        setWaitingStudents(uniqueStudents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching waiting students:', err);
        setError('대기 명단을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchWaitingStudents();

    // 커스텀 이벤트 리스너 추가 (미션 부여 후 명시적 새로고침)
    const handleMissionsUpdated = () => {
      fetchWaitingStudents();
    };
    window.addEventListener('missions-updated', handleMissionsUpdated);

    // Realtime 구독 설정 (모든 변경사항 감지)
    const channel = supabase
      .channel('missions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'missions',
        },
        (payload) => {
          // status가 변경되거나 삽입/삭제될 때마다 새로고침
          console.log('Missions table changed:', payload);
          fetchWaitingStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('missions-updated', handleMissionsUpdated);
    };
  }, []);

  const handleCheckboxChange = (studentName: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedStudents, studentName]);
    } else {
      onSelectionChange(selectedStudents.filter((name) => name !== studentName));
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === waitingStudents.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(waitingStudents.map((s) => s.student_name));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">대기 명단</h2>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">대기 명단</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">대기 명단</h2>
        {waitingStudents.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {selectedStudents.length === waitingStudents.length
              ? '전체 해제'
              : '전체 선택'}
          </button>
        )}
      </div>
      {waitingStudents.length === 0 ? (
        <p className="text-gray-600">대기 중인 학생이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <ul className="divide-y divide-gray-200">
            {waitingStudents.map((student, index) => {
              const isChecked = selectedStudents.includes(student.student_name);
              return (
                <li
                  key={`${student.student_name}-${index}`}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    id={`student-${index}`}
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(student.student_name, e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`student-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="text-gray-900 font-medium">
                      {student.student_name}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(student.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      {new Date(student.created_at).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

