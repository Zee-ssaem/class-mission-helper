import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 대기 중인 학생 목록 조회 (status='pending')
    const { data, error } = await supabase
      .from('missions')
      .select('student_name, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Fetch waiting students error:', error);
      return NextResponse.json(
        { error: '대기 명단을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 중복 제거
    const uniqueStudents = Array.from(
      new Map(data?.map((s) => [s.student_name, s]) || []).values()
    );

    return NextResponse.json({ students: uniqueStudents });
  } catch (error) {
    console.error('Get waiting students error:', error);
    return NextResponse.json(
      { error: '대기 명단을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

