-- profile 테이블: 학생 프로필 정보 (비밀번호 포함)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- students 테이블: 학생 추가 정보
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- missions 테이블: 미션 정보
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('학습', '생활', '봉사', '대기')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- mission_applications 테이블: 하루 1회 신청 제한용
CREATE TABLE IF NOT EXISTS mission_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_name, application_date)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_missions_student_name ON missions(student_name);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_mission_applications_student_date ON mission_applications(student_name, application_date);
CREATE INDEX IF NOT EXISTS idx_profile_name ON profile(name);

-- Realtime 활성화 (missions 테이블)
ALTER PUBLICATION supabase_realtime ADD TABLE missions;

-- RLS (Row Level Security) 정책 설정
-- profile 테이블: 모든 사용자가 읽기 가능 (로그인용)
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to profile" ON profile
  FOR SELECT
  USING (true);

-- students 테이블: 모든 사용자가 읽기 가능
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to students" ON students
  FOR SELECT
  USING (true);

-- missions 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to missions" ON missions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- mission_applications 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE mission_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to mission_applications" ON mission_applications
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 샘플 데이터 (선택사항)
-- INSERT INTO profile (name, password) VALUES ('홍길동', 'password123');
-- INSERT INTO students (profile_id) SELECT id FROM profile WHERE name = '홍길동';

