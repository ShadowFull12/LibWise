
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Library, Upload, ShieldCheck, Bookmark, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/logo';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/library', icon: Library, label: 'Library' },
  { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { href: '/my-submissions', icon: FileText, label: 'My Submissions' },
  { href: '/upload', icon: Upload, label: 'Upload' },
];

const adminNavItems = [
    { href: '/admin', icon: ShieldCheck, label: 'Admin' },
];

export function MainNav() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Libwise</h1>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {userProfile?.role === 'admin' && adminNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
