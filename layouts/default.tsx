import WaveAnimatedBackgroundLayout  from '@/layouts/background';
import { Head } from "@/layouts/head";

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <WaveAnimatedBackgroundLayout>
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">        
      </footer>
    </div>
    </WaveAnimatedBackgroundLayout>
    </section>
  );
}
