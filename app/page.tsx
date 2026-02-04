
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-16 text-center">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
          Reconnect
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          A digital gallery of games and ideas designed to bring people closer together.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card for Color Majority */}
        <Link
          href="/games/color-majority"
          className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-48 bg-gradient-to-br from-yellow-900 to-red-900 group-hover:from-yellow-800 group-hover:to-red-800 transition-colors flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Color Majority</h2>
            <p className="text-gray-400">
              A game of social deduction and risky reveals. sway the crowd to your color to win the pot.
            </p>
          </div>
        </Link>

        {/* Placeholder for future games */}
        <div className="border border-gray-800 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-gray-600 min-h-[300px]">
          <span className="text-4xl mb-4">🚧</span>
          <p>More Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
