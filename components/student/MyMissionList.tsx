'use client';

import { useEffect, useState } from 'react';

interface Mission {
  id: string;
  student_name: string;
  category: string;
  content: string;
  status: string;
  created_at: string;
}

export default function MyMissionList() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/missions/my-missions');
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '미션 목록을 불러오는 중 오류가 발생했습니다.');
        return;
      }

      // 최신순으로 정렬 (created_at 기준 내림차순)
      const sortedMissions = (data.missions || []).sort((a: Mission, b: Mission) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setMissions(sortedMissions);
    } catch (err) {
      setError('미션 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">나의 미션 목록</h2>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">나의 미션 목록</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">나의 미션 목록</h2>
      {missions.length === 0 ? (
        <p className="text-gray-600">완료한 미션이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {mission.category}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium">{mission.content}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(mission.created_at).toLocaleDateString('ko-KR')}
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

