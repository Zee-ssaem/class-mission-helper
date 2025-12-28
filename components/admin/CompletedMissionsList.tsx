'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Mission {
  id: string;
  student_name: string;
  category: string;
  content: string;
  status: string;
  created_at: string;
}

export default function CompletedMissionsList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // 초기 데이터 로드
    const fetchCompletedMissions = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('missions')
          .select('*')
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        // 최신순으로 정렬 (created_at 기준 내림차순)
        const sortedMissions = (data || []).sort((a: Mission, b: Mission) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setMissions(sortedMissions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching completed missions:', err);
        setError('완료된 미션 목록을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchCompletedMissions();

    // Realtime 구독 설정 (완료된 미션 변경 감지)
    const channel = supabase
      .channel('completed-missions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'missions',
          filter: 'status=eq.completed',
        },
        (payload) => {
          console.log('Completed missions table changed:', payload);
          fetchCompletedMissions();
        }
      )
      .subscribe();

    // 커스텀 이벤트 리스너 추가 (미션 부여 후 새로고침)
    const handleMissionsUpdated = () => {
      fetchCompletedMissions();
    };
    window.addEventListener('missions-updated', handleMissionsUpdated);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('missions-updated', handleMissionsUpdated);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">해결된 미션 목록</h2>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">해결된 미션 목록</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">해결된 미션 목록</h2>
      {missions.length === 0 ? (
        <p className="text-gray-600">해결된 미션이 없습니다.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {mission.category}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {mission.student_name}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{mission.content}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">미션 부여일:</span>{' '}
                    {new Date(mission.created_at).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

