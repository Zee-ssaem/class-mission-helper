'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 4자리 입력 시 자동 로그인
  useEffect(() => {
    if (password.length === 4 && !loading) {
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const handleLogin = async () => {
    if (password.length !== 4) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const endpoint = isAdmin ? '/api/auth/admin/login' : '/api/auth/student';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다.');
        setPassword('');
        return;
      }

      // 로그인 성공 시 리다이렉트
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
      router.refresh();
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleNumberClick = (num: string) => {
    if (password.length < 4) {
      setPassword((prev) => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPassword((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPassword('');
    setError('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            교실 미션 해결사
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            비밀번호를 입력해주세요
          </p>
        </div>

        {/* 관리자 모드 체크박스 */}
        <div className="flex items-center justify-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => {
                setIsAdmin(e.target.checked);
                setPassword('');
                setError('');
              }}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              관리자 모드
            </span>
          </label>
        </div>

        {/* 비밀번호 표시 */}
        <div className="space-y-2">
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`h-16 w-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  password.length > index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                }`}
              >
                {password.length > index ? '●' : ''}
              </div>
            ))}
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-center">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          {loading && (
            <div className="text-center">
              <p className="text-sm text-gray-600">로그인 중...</p>
            </div>
          )}
        </div>

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              disabled={loading || password.length >= 4}
              className="h-16 rounded-lg bg-gray-100 text-2xl font-bold text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleClear}
            disabled={loading}
            className="h-16 rounded-lg bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            지우기
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            disabled={loading || password.length >= 4}
            className="h-16 rounded-lg bg-gray-100 text-2xl font-bold text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            disabled={loading || password.length === 0}
            className="h-16 rounded-lg bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
