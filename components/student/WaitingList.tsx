'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface WaitingStudent {
  student_name: string;
  created_at: string;
}

export default function WaitingList() {
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

        // 중복 제거 (같은 학생이 여러 번 있을 수 있으므로)
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
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">실시간 대기 명단</h2>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">실시간 대기 명단</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">실시간 대기 명단</h2>
      {waitingStudents.length === 0 ? (
        <p className="text-gray-600">대기 중인 학생이 없습니다.</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <ul className="space-y-2">
            {waitingStudents.map((student, index) => (
              <li
                key={`${student.student_name}-${index}`}
                className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-gray-900 font-medium">
                  {student.student_name}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(student.created_at).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

