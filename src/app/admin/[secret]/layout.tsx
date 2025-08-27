// src/app/admin/[secret]/layout.tsx
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

type AdminLayoutProps = {
  children: ReactNode;
  params: {
    secret: string;
  };
};

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  // This is a server-side guard.
  // It checks if the secret in the URL matches the one in the .env file.
  // If they don't match, it renders a 404 page.
  if (params.secret !== process.env.ADMIN_SECRET) {
    notFound();
  }

  return <>{children}</>;
}
