'use client';
import '@/app/globals.css';
import { SidebarInset, SidebarProvider } from '@repo/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { use, useState } from 'react';
import { UserProvider } from '@/context/UserProvider';
import ToasterContext from '@/context/ToastContext';
import { SiteHeader } from '@/components/dashboard/site-header';
import {
  IconCheckbox, IconClipboard,
  IconCode,
  IconDashboard,
  IconForbid2, IconHeart,
  IconHourglassEmpty,
  IconList, IconSettings,
  IconStar, IconTable
} from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

export default function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang } = use(props.params);
  const path = usePathname();
  return (
    <>
      <UserProvider>
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 62)',
              '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
          }
        >
          <AppSidebar
            lang={lang}
            title={'Reviewsup.io'}
            items={[
              {
                title: 'Overview',
                url: `/${lang}/dashboard/overview`,
                icon: IconDashboard,
                active: path.includes('/overview'),
              },
            ]}
          />
          <SidebarInset>
            <SiteHeader />
            {props.children}
          </SidebarInset>
        </SidebarProvider>
        <ToasterContext />
      </UserProvider>
    </>
  );
}
