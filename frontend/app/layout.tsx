import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TalkingBI — Talk to your data',
  description: 'Upload a CSV and instantly get dashboards, insights, and a conversational analytics interface powered by AI.',
  keywords: ['business intelligence', 'CSV analytics', 'AI analytics', 'data dashboard'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-50 antialiased min-h-screen">
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#27272a',
              border: '1px solid #3f3f46',
              color: '#fafafa',
            },
          }}
        />
      </body>
    </html>
  );
}
