import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentSession } from '@/lib/auth/session';

export async function GET() {
  try {
    const studentName = await getStudentSession();

    if (!studentName) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // 완료한 미션 목록 조회 (status='completed')
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('student_name', studentName)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch missions error:', error);
      return NextResponse.json(
        { error: '미션 목록을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ missions: data || [] });
  } catch (error) {
    console.error('Get my missions error:', error);
    return NextResponse.json(
      { error: '미션 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

