'use client';

import { useState } from 'react';

interface MissionAssignmentProps {
  selectedStudents: string[];
  onAssignmentComplete: () => void;
}

const MISSION_CATEGORIES = ['학습', '생활', '봉사'] as const;

export default function MissionAssignment({
  selectedStudents,
  onAssignmentComplete,
}: MissionAssignmentProps) {
  const [category, setCategory] = useState<string>('학습');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      setMessage({ type: 'error', text: '학생을 선택해주세요.' });
      return;
    }

    if (!content.trim()) {
      setMessage({ type: 'error', text: '세부 내용을 입력해주세요.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/missions/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentNames: selectedStudents,
          category,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || '미션 부여에 실패했습니다.' });
        return;
      }

      setMessage({ type: 'success', text: '미션이 성공적으로 부여되었습니다!' });
      setContent('');
      onAssignmentComplete();
      
      // 미션 부여 후 잠시 대기하여 Realtime 업데이트가 반영되도록 함
      setTimeout(() => {
        // 부모 컴포넌트에서 대기 명단을 새로고침하도록 트리거
        window.dispatchEvent(new Event('missions-updated'));
      }, 500);
    } catch (error) {
      setMessage({ type: 'error', text: '미션 부여 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">미션 부여</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
          >
            {MISSION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            세부 내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-green-500"
            placeholder="미션 세부 내용을 입력해주세요"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            선택된 학생: {selectedStudents.length}명
          </p>
          {selectedStudents.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map((name) => (
                <span
                  key={name}
                  className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
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
        <button
          type="submit"
          disabled={loading || selectedStudents.length === 0}
          className="w-full rounded-lg bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? '부여 중...' : '미션 부여하기'}
        </button>
      </form>
    </div>
  );
}

