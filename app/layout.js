import '@/app/globals.css';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AuthProvider from './auth-provider';

export default async function RootLayout({ children }) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <AuthProvider serverSession={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
