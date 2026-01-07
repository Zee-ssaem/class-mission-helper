import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth/session';

export async function GET() {
  try {
    // 교사 인증 확인
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    const supabase = await createClient();

    // student_mission_stats 뷰에서 데이터 조회
    const { data, error } = await supabase
      .from('student_mission_stats')
      .select('*')
      .order('completed_count', { ascending: false });

    if (error) {
      console.error('Fetch mission stats error:', error);
      return NextResponse.json(
        { error: '미션 통계를 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stats: data || [] });
  } catch (error) {
    console.error('Get mission stats error:', error);
    return NextResponse.json(
      { error: '미션 통계를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

