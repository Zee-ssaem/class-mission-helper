import { cookies } from 'next/headers';

export const SESSION_KEYS = {
  STUDENT_NAME: 'student_name',
  ADMIN: 'admin',
} as const;

export async function setStudentSession(studentName: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEYS.STUDENT_NAME, studentName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24시간
  });
}

export async function getStudentSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_KEYS.STUDENT_NAME)?.value || null;
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEYS.STUDENT_NAME);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEYS.ADMIN, 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24시간
  });
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_KEYS.ADMIN)?.value === 'true';
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEYS.ADMIN);
}

