
import Link from 'next/link';

export default function GameIntro() {
    return (
        <div className="min-h-screen bg-gray-900 text-white pb-8">
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
            <div className="max-w-4xl mx-auto py-16 px-8 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 prose prose-invert prose-lg">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                        แนวคิดเบื้องหลังเกม
                    </h2>
                    <p>
                        แรงบันดาลใจของเกมนี้มาจากหนังสือ <strong>"Supercommunicators"</strong> ของ Charles Duhigg
                        ที่พูดถึงความแตกต่างระหว่าง <strong>"Logic of Cost and Benefit"</strong> และ <strong>"Logic of Similarity"</strong>
                    </p>
                    <p>
                        บ่อยครั้งที่การสื่อสารล้มเหลวเพราะเรามองข้าม "สิ่งที่เรากำลังคุยกันจริงๆ"
                        คนทั่วไปมักโฟกัสที่เหตุผลและผลประโยชน์ (Facts & Logic) โดยไม่ทันสังเกตความรู้สึกหรือบริบททางสังคม
                        ซึ่งนำไปสู่ความไม่เข้าใจกัน (Misalignment)
                    </p>
                    <p>
                        ในโลกของการเจรจา ยอดนักสื่อสาร (Supercommunicators)
                        มักจะใช้วิธีดึงทุกคนเข้ามาอยู่ใน "เกมเดียวกัน" สร้างความเหมือน (Similarity)
                        เพื่อให้ทุกคนรู้สึกว่าเป็นส่วนหนึ่งของกลุ่ม ก่อนที่จะเริ่มถกเถียงเรื่องเหตุผล
                    </p>
                    <p className="italic text-purple-300">
                        "ความจริงไม่ใช่แค่สิ่งที่คุณถืออยู่ในมือ แต่มันคือสิ่งที่คุณเลือกจะเปิดเผยเพื่อสร้างความเชื่อมโยง"
                    </p>
                </div>
                <div className="w-full md:w-64 flex-shrink-0">
                    <img
                        src="https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1702893819i/157981748.jpg"
                        alt="Supercommunicators Book"
                        className="rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* How to Play Section */}
            <div className="max-w-4xl mx-auto py-16 px-8 border-t border-gray-800">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 mb-8">
                    ลองมาสัมผัสด้วยตัวเอง
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-300">
                    <div className="bg-gray-800/50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">กฎกติกาคร่าวๆ</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>คุณจะได้รับการ์ดสีต่างๆ 4 ใบ</li>
                            <li>ในแต่ละตา คุณสามารถเลือก <strong>"เปิดเผย" (Reveal)</strong> การ์ดสีเดียวกัน หรือ <strong>"ข้าม" (Skip)</strong></li>
                            <li>เกมจะจบลงเมื่อทุกคนเลือกข้ามติดต่อกัน</li>
                        </ul>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">เป้าหมาย</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>สีที่มีการเปิดเผย <strong>มากที่สุด</strong> จะเป็นสีที่ชนะ</li>
                            <li>ผู้ที่ถือสีนั้นจะได้รับผลตอบแทนจากกองกลาง</li>
                            <li>คุณจะใช้เหตุผลเพื่อเอาชนะ หรือจะสร้างความสอดคล้องเพื่อให้กลุ่มไปต่อได้?</li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}
