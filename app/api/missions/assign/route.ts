import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // 교사 인증 확인
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    const { studentNames, category, content } = await request.json();

    if (!studentNames || !Array.isArray(studentNames) || studentNames.length === 0) {
      return NextResponse.json(
        { error: '학생을 선택해주세요.' },
        { status: 400 }
      );
    }

    if (!category || !content) {
      return NextResponse.json(
        { error: '카테고리와 세부 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 각 학생에 대해 미션 업데이트
    // pending 상태인 미션을 찾아서 completed로 변경하고 내용 업데이트
    const updatePromises = studentNames.map(async (studentName: string) => {
      // 해당 학생의 pending 미션 찾기
      const { data: pendingMissions, error: findError } = await supabase
        .from('missions')
        .select('id')
        .eq('student_name', studentName)
        .eq('status', 'pending');

      if (findError) {
        throw findError;
      }

      if (!pendingMissions || pendingMissions.length === 0) {
        // pending 미션이 없으면 새로 생성
        const { error: insertError } = await supabase
          .from('missions')
          .insert({
            student_name: studentName,
            category,
            content,
            status: 'completed',
            assigned_at: new Date().toISOString(), // 미션 부여 시간 저장
          });

        if (insertError) throw insertError;
      } else {
        // pending 미션들을 completed로 업데이트
        const { data: updatedMissions, error: updateError } = await supabase
          .from('missions')
          .update({
            category,
            content,
            status: 'completed',
            assigned_at: new Date().toISOString(), // 미션 부여 시간 저장
          })
          .eq('student_name', studentName)
          .eq('status', 'pending')
          .select();

        if (updateError) {
          console.error(`Update error for ${studentName}:`, updateError);
          throw updateError;
        }

        if (!updatedMissions || updatedMissions.length === 0) {
          console.warn(`No pending missions found for ${studentName}`);
        }
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `${studentNames.length}명의 학생에게 미션이 부여되었습니다.`,
    });
  } catch (error) {
    console.error('Assign mission error:', error);
    return NextResponse.json(
      { error: '미션 부여 중 오류가 발생했습니다. 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}

