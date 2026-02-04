
import Link from 'next/link';

export default function GameIntro() {
    return (
        <div className="min-h-screen bg-neutral-900 text-white font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-neutral-900 py-24 px-8 text-center">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6">Social Identity Map</h1>
                    <p className="text-2xl text-blue-200 mb-10 leading-relaxed italic">
                        "To be seen is to be known. To be known is to be understood."
                    </p>
                    <Link
                        href="/games/social-identity-map/play"
                        className="inline-block bg-white text-blue-900 font-bold text-xl px-12 py-4 rounded-full hover:bg-blue-100 transform hover:scale-105 transition-all shadow-lg"
                    >
                        Start Creating
                    </Link>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Philosophy Section */}
            <div className="max-w-3xl mx-auto py-16 px-8 prose prose-invert prose-lg">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    The Philosophy
                </h2>
                <p>
                    We often interact on the surface, seeing only what is immediately visible. But every individual is a complex architecture of layers,
                    some inherited and some meticulously crafted.
                </p>
                <p>
                    The <strong>Social Identity Map</strong> is a meditative tool designed to help you externalize your internal layers. By mapping out what was <strong>Given</strong> to you, what you have <strong>Chosen</strong> for yourself, and what lies at your <strong>Core</strong>, you create a visual language for your identity.
                </p>
                <p>
                    In this space, there is no competition. The "win" condition is the moment of resonance when you share your map and someone says, <em>"I see you."</em>
                </p>

                <h2 className="mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    How it works
                </h2>
                <div className="space-y-6 text-gray-300">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 font-bold shrink-0">1</div>
                        <p><strong>Map Your Layers:</strong> Use the editor to add traits to your Given (outer), Chosen (middle), and Core (inner) rings.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold shrink-0">2</div>
                        <p><strong>Reflect on Others:</strong> Optionally, create maps for others in the room to share how you perceive their beautiful complexity.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-300 font-bold shrink-0">3</div>
                        <p><strong>The Sharing Circle:</strong> Take turns presenting your maps. Use the "Share" feature to guide everyone's attention to your visual story.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-8 text-center text-gray-500">
                <Link href="/" className="hover:text-white transition-colors text-sm uppercase tracking-widest">
                    ← Back to Reconnect
                </Link>
            </footer>
        </div>
    );
}
