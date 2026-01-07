'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface StudentStats {
  student_name: string;
  completed_count: number;
  pending_count: number;
  total_count: number;
  last_completed_at: string | null;
  last_assigned_at: string | null;
}

export default function StudentMissionStats() {
  const [stats, setStats] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // 초기 데이터 로드
    const fetchStats = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('student_mission_stats')
          .select('*')
          .order('completed_count', { ascending: false });

        if (fetchError) throw fetchError;

        setStats(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching mission stats:', err);
        setError('미션 통계를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchStats();

    // Realtime 구독 설정 (missions 테이블 변경 감지)
    const channel = supabase
      .channel('mission-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'missions',
        },
        (payload) => {
          console.log('Missions table changed, refreshing stats:', payload);
          fetchStats();
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
        <h2 className="text-2xl font-bold text-gray-800">학생별 미션 완료 횟수</h2>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">학생별 미션 완료 횟수</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">학생별 미션 완료 횟수</h2>
      {stats.length === 0 ? (
        <p className="text-gray-600">통계 데이터가 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  학생 이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  완료 횟수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  대기 중
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  총 미션 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  마지막 완료일
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stats.map((stat) => (
                <tr key={stat.student_name} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {stat.student_name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      {stat.completed_count}회
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {stat.pending_count}개
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {stat.total_count}개
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {stat.last_completed_at
                      ? new Date(stat.last_completed_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

