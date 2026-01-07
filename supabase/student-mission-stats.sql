-- 학생별 미션 완료 횟수 뷰 생성
-- 이 파일은 Supabase SQL Editor에서 실행하세요.

-- 학생별 미션 완료 횟수를 보여주는 뷰 생성
CREATE OR REPLACE VIEW student_mission_stats AS
SELECT 
  student_name,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_count,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
  COUNT(*) AS total_count,
  MAX(created_at) FILTER (WHERE status = 'completed') AS last_completed_at,
  MAX(assigned_at) FILTER (WHERE status = 'completed') AS last_assigned_at
FROM missions
GROUP BY student_name;

-- 뷰에 대한 인덱스는 필요 없지만, 기본 테이블에 인덱스가 있으므로 성능은 보장됩니다.

-- RLS 정책 설정 (뷰는 기본 테이블의 정책을 상속받지만, 명시적으로 설정)
-- 뷰는 읽기 전용이므로 SELECT 정책만 필요합니다.
-- 실제로는 기본 missions 테이블의 정책을 따릅니다.

-- 뷰에 대한 주석 추가
COMMENT ON VIEW student_mission_stats IS '학생별 미션 완료 횟수 및 통계 정보를 제공하는 뷰';

