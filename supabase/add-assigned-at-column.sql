-- missions 테이블에 assigned_at 컬럼 추가
-- 이 파일은 Supabase SQL Editor에서 실행하세요.

-- assigned_at 컬럼 추가 (nullable)
ALTER TABLE missions ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;

-- 기존 completed 상태인 미션들의 assigned_at을 created_at으로 설정 (선택사항)
-- UPDATE missions SET assigned_at = created_at WHERE status = 'completed' AND assigned_at IS NULL;

