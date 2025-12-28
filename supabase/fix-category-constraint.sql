-- missions 테이블의 category 제약조건 수정
-- '대기' 카테고리를 허용하도록 변경

-- 기존 제약조건 제거
ALTER TABLE missions DROP CONSTRAINT IF EXISTS missions_category_check;

-- 새로운 제약조건 추가 ('대기' 포함)
ALTER TABLE missions ADD CONSTRAINT missions_category_check 
  CHECK (category IN ('학습', '생활', '봉사', '대기'));

-- 또는 category를 nullable로 만들고 싶다면:
-- ALTER TABLE missions ALTER COLUMN category DROP NOT NULL;
-- ALTER TABLE missions DROP CONSTRAINT IF EXISTS missions_category_check;
-- ALTER TABLE missions ADD CONSTRAINT missions_category_check 
--   CHECK (category IS NULL OR category IN ('학습', '생활', '봉사'));

