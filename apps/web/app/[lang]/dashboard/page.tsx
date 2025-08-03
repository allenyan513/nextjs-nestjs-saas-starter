'use client';
import { api } from '@repo/shared/api-client';
import { UserEntity } from '@repo/shared/types';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Page(props: { params: Promise<{ lang: string }> }) {
  useEffect(() => {
    api.auth.getSession().then((user: UserEntity | null) => {
      if (!user) {
        return redirect(`/auth/signin`);
      } else {
        return redirect(`/dashboard/overview`);
      }
    });
  }, []);
  return null;
}
