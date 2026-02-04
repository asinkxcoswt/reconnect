
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="mb-16 text-center">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
          Reconnect
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          พื้นที่จัดแสดงเกมและไอเดียดิจิทัลที่ออกแบบมาเพื่อให้ผู้คนใกล้ชิดกันมากขึ้น
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Card for Logic of Similarity */}
        <Link
          href="/games/logic-of-similarity"
          className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-48 bg-gradient-to-br from-yellow-900 to-red-900 group-hover:from-yellow-800 group-hover:to-red-800 transition-colors flex items-center justify-center relative overflow-hidden">
            <Image
              src="/logic-of-similarity-thumbnail.png"
              alt="Logic of Similarity"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Logic of Similarity</h2>
            <p className="text-gray-400">
              เกมแห่งการอนุมานทางสังคมและการเปิดเผยที่มีความเสี่ยง โน้มน้าวกลุ่มคนให้มาเป็นสีของคุณเพื่อชนะเงินรางวัล
            </p>
          </div>
        </Link>

        {/* Card for Social Identity Map */}
        <Link
          href="/games/social-identity-map"
          className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="h-48 bg-gradient-to-br from-blue-900 to-indigo-900 group-hover:from-blue-800 group-hover:to-indigo-800 transition-colors flex items-center justify-center relative overflow-hidden">
            <Image
              src="/social-identity-map-thumbnail.png"
              alt="Social Identity Map"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Social Identity Map</h2>
            <p className="text-gray-400">
              มองเห็นเลเยอร์ของตัวตนที่คุณเป็น แบ่งปันลักษณะที่คุณได้รับมา คุณค่าที่คุณเลือก และความเชื่อที่เป็นแกนกลางของคุณ
            </p>
          </div>
        </Link>

        {/* Placeholder for future games */}
        <div className="border border-gray-800 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-gray-600 min-h-[300px]">
          <span className="text-4xl mb-4">🚧</span>
          <p>เร็วๆ นี้</p>
        </div>
      </div>
    </div>
  );
}
