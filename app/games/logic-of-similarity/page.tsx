
import Link from 'next/link';

export default function GameIntro() {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-purple-900 to-gray-900 py-24 px-8 text-center">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6">Logic of Similarity</h1>
                    <p className="text-2xl text-purple-200 mb-10 leading-relaxed">
                        "The truth isn't what is dealt to you.<br />It's what you choose to reveal."
                    </p>
                    <Link
                        href="/games/logic-of-similarity/play"
                        className="inline-block bg-white text-purple-900 font-bold text-xl px-12 py-4 rounded-full hover:bg-purple-100 transform hover:scale-105 transition-all shadow-lg"
                    >
                        Play Now
                    </Link>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Philosophy Section */}
            <div className="max-w-3xl mx-auto py-16 px-8 prose prose-invert prose-lg">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    The Philosophy
                </h2>
                <p>
                    In life, we often hold cards close to our chest. We think power comes from having the best hand.
                    But in <strong>Logic of Similarity</strong>, having the cards means nothing if you don't show them.
                </p>
                <p>
                    The "winning" color isn't determined by chance—it's determined by the collective bravery of the players.
                    If everyone reveals Red, Red wins. But if you hold back your Blue cards hoping for a Blue victory,
                    you doom yourself.
                </p>
                <p>
                    It is a game about coordination, trust, and the risk of being the first to speak up.
                </p>

                <h2 className="mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">
                    How to Play
                </h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>You are dealt <strong>4 cards</strong> of random colors.</li>
                    <li>On your turn, you can <strong>Reveal</strong> cards of one color, or <strong>Skip</strong>.</li>
                    <li>The game ends when everyone skips.</li>
                    <li>The color with the <strong>most revealed cards</strong> wins.</li>
                    <li>Winners split the pot (funded by the losers' penalties).</li>
                </ul>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
                <Link href="/" className="hover:text-white transition-colors">
                    ← Back to Reconnect Gallery
                </Link>
            </footer>
        </div>
    );
}
