"use client";

// ---------------------------------------------------------------------------
// RootProviders — client-side composition root.
// Order matters: ScrollProvider (Lenis) and ThemeProvider wrap everything;
// the custom cursor mounts once, globally. This client component is imported
// by the server <RootLayout> so `metadata` can still be exported there.
// ---------------------------------------------------------------------------

import { ThemeProvider, themeScript } from "./ThemeProvider";
import { ScrollProvider } from "./ScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ScrollProvider>
        {/* Anti-FOUC theme bootstrap — runs before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Preloader />
        <CustomCursor />
        <Nav />
        {children}
        <Footer />
      </ScrollProvider>
    </ThemeProvider>
  );
}