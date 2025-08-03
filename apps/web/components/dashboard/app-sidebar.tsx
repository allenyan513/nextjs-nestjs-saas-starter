'use client';

import * as React from 'react';
import {
  IconSettings,
  IconStar,
  IconCode,
  IconTable,
  IconCirclesRelation,
  IconHourglassEmpty,
  IconMail,
  IconClipboardText,
  IconCheckbox,
  IconForbid2,
  IconList,
  IconDashboard,
  IconUser,
  IconRocket,
  IconClipboard,
  IconHeart,
} from '@tabler/icons-react';

import { NavMain, NavMainItem } from '@/components/dashboard/nav-main';
import { NavUser } from '@/components/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@repo/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/dashboard/logo';
import Link from 'next/link';

export function AppSidebar(props: {
  lang: string;
  title: string;
  items: NavMainItem[];
}) {
  const { lang, title, items } = props;
  return (
    <Sidebar collapsible="offcanvas" variant={'inset'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={`${process.env.NEXT_PUBLIC_WEB_URL}`}>
                <Logo />
                <h1 className="text-base font-semibold">{title}</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="justify-between">
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
