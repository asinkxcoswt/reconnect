'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationFooter() {
    const pathname = usePathname();

    // Hide on home page
    if (pathname === '/') return null;

    const getNavigationInfo = () => {
        const segments = pathname.split('/').filter(Boolean);

        // Example segments: ['games', 'logic-of-similarity', 'play']
        if (segments[0] === 'games') {
            if (segments.length === 2) {
                // We are at /games/[game-name] (Landing Page)
                return {
                    label: 'กลับสู่ Reconnect Gallery',
                    href: '/',
                };
            } else if (segments.length === 3) {
                // We are at /games/[game-name]/play (Play Page)
                const gameName = segments[1].replace(/-/g, ' ');
                return {
                    label: `กลับสู่ ${gameName.charAt(0).toUpperCase() + gameName.slice(1)} Intro`,
                    href: `/games/${segments[1]}`,
                };
            }
        }

        // Default fallback
        return {
            label: 'กลับสู่ Reconnect',
            href: '/',
        };
    };

    const { label, href } = getNavigationInfo();

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
            <div className="max-w-max mx-auto pointer-events-auto">
                <Link
                    href={href}
                    className="flex items-center gap-2 px-6 py-3 bg-neutral-900/80 backdrop-blur-md border border-neutral-700 rounded-full text-neutral-400 hover:text-white hover:border-neutral-500 transition-all shadow-lg group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
                </Link>
            </div>
        </footer>
    );
}
