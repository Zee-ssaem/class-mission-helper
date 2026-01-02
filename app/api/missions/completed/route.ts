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

    // 모든 학생의 완료된 미션 목록 조회 (status='completed')
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch completed missions error:', error);
      return NextResponse.json(
        { error: '미션 목록을 불러오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ missions: data || [] });
  } catch (error) {
    console.error('Get completed missions error:', error);
    return NextResponse.json(
      { error: '미션 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

