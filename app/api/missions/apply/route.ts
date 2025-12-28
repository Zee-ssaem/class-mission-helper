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
    const { data: existingApplications, error: checkError } = await supabase
      .from('mission_applications')
      .select('id')
      .eq('student_name', studentName)
      .eq('application_date', today);

    if (checkError) {
      console.error('Check existing application error:', checkError);
      return NextResponse.json(
        { error: '신청 확인 중 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    if (existingApplications && existingApplications.length > 0) {
      return NextResponse.json(
        { error: '이미 신청되었습니다.' },
        { status: 400 }
      );
    }

    // mission_applications에 신청 기록 추가
    const { data: applicationData, error: applicationError } = await supabase
      .from('mission_applications')
      .insert({
        student_name: studentName,
        application_date: today,
      })
      .select();

    if (applicationError) {
      console.error('Application error:', applicationError);
      return NextResponse.json(
        { error: `신청 중 오류가 발생했습니다: ${applicationError.message}` },
        { status: 500 }
      );
    }

    if (!applicationData || applicationData.length === 0) {
      console.error('Application data not returned');
      return NextResponse.json(
        { error: '신청 기록이 저장되지 않았습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // missions 테이블에 pending 상태로 미션 생성
    // category는 교사가 미션을 부여할 때 설정되므로, 신청 시에는 '대기' 사용
    const { data: missionData, error: missionError } = await supabase
      .from('missions')
      .insert({
        student_name: studentName,
        category: '대기', // 신청 대기 상태
        content: '미션 신청 대기 중',
        status: 'pending',
      })
      .select();

    if (missionError) {
      console.error('Mission creation error:', missionError);
      // mission_applications는 저장되었지만 missions는 실패한 경우 롤백 고려
      return NextResponse.json(
        { error: `미션 생성 중 오류가 발생했습니다: ${missionError.message}` },
        { status: 500 }
      );
    }

    if (!missionData || missionData.length === 0) {
      console.error('Mission data not returned');
      return NextResponse.json(
        { error: '미션이 생성되지 않았습니다. 다시 시도해주세요.' },
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

