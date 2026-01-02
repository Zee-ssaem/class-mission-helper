import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { setStudentSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // profile 테이블에서 비밀번호로 이름 조회
    const { data, error } = await supabase
      .from('profile')
      .select('name')
      .eq('password', password)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: `데이터베이스 오류: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      console.log('No data found for password:', password);
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 세션 설정
    await setStudentSession(data.name);

    return NextResponse.json({ success: true, name: data.name });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

