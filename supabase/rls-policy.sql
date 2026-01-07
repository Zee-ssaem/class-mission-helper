-- RLS (Row Level Security) 정책 설정
-- 이 파일은 Supabase SQL Editor에서 실행하세요.

-- profile 테이블: 모든 사용자가 읽기 가능 (로그인용)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to profile" ON profile;
CREATE POLICY "Allow public read access to profile" ON profile
  FOR SELECT
  USING (true);

-- students 테이블: 모든 사용자가 읽기 가능
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to students" ON students;
CREATE POLICY "Allow public read access to students" ON students
  FOR SELECT
  USING (true);

-- missions 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to missions" ON missions;
CREATE POLICY "Allow public access to missions" ON missions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- mission_applications 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE mission_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public access to mission_applications" ON mission_applications;
CREATE POLICY "Allow public access to mission_applications" ON mission_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- student_mission_stats 뷰: missions 테이블의 RLS 정책을 상속받습니다.
-- 뷰는 읽기 전용이므로 별도의 RLS 정책 설정이 필요 없습니다.
-- missions 테이블의 SELECT 정책이 뷰에도 적용됩니다.

