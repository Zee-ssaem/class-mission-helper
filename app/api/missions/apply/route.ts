import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const studentName = await getStudentSession();

    if (!studentName) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // 오늘 날짜 기준으로 이미 신청했는지 확인
    const today = new Date().toISOString().split('T')[0];
    const { data: existingApplication } = await supabase
      .from('mission_applications')
      .select('id')
      .eq('student_name', studentName)
      .eq('application_date', today)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: '이미 신청되었습니다.' },
        { status: 400 }
      );
    }

    // mission_applications에 신청 기록 추가
    const { error: applicationError } = await supabase
      .from('mission_applications')
      .insert({
        student_name: studentName,
        application_date: today,
      });

    if (applicationError) {
      console.error('Application error:', applicationError);
      return NextResponse.json(
        { error: '신청 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // missions 테이블에 pending 상태로 미션 생성
    const { error: missionError } = await supabase
      .from('missions')
      .insert({
        student_name: studentName,
        category: '대기',
        content: '미션 신청 대기 중',
        status: 'pending',
      });

    if (missionError) {
      console.error('Mission creation error:', missionError);
      return NextResponse.json(
        { error: '미션 생성 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Apply mission error:', error);
    return NextResponse.json(
      { error: '신청 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

