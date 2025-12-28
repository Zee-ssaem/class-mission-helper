'use client';

import { useState } from 'react';

export default function MissionApplication() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApply = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/missions/apply', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '신청에 실패했습니다.' });
        return;
      }

      setMessage({ type: 'success', text: '미션 신청이 완료되었습니다!' });
    } catch (error) {
      setMessage({ type: 'error', text: '신청 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">미션 신청하기</h2>
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? '신청 중...' : '미션 신청하기'}
      </button>
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  );
}

