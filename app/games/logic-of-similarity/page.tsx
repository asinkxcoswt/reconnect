
import Link from 'next/link';

export default function GameIntro() {
    return (
        <div className="min-h-screen bg-gray-900 text-white pb-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-purple-900 to-gray-900 py-24 px-8 text-center">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6">Logic of Similarity</h1>
                    <p className="text-2xl text-purple-200 mb-10 leading-relaxed">
                        "เมื่อความจริงไม่ใช่ไพ่บนมือ แต่เป็นไพ่ที่คุณเลือกจะเผย"
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
            <div className="max-w-4xl mx-auto py-8 px-8 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 prose prose-invert prose-lg">
                    <h2 className="mb-4 text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                        ความจริงที่คุณเลือกเผย
                    </h2>

                    <p className='mb-4'>ตรรกะเหตุผลเป็นเครื่องมือสำคัญที่เราต้องใช้ในการตัดสินใจเลือกวิธีแก้ปัญหาร่วมกัน โดยเฉพาะในบริบทของการทำงาน</p>

                    <p className='mb-4'>หนังสือยอดมนุษย์นักสื่อสาร (supercommunicators) กล่าวถึงสองรูปแบบของการใช้เหตุผลที่คนเรามักมองข้าม</p>

                    <ul className="list-disc pl-4 mb-4">
                        <li>Logic of Cost & Benefits</li>
                        <li>Logic of Similarity</li>
                    </ul>

                    <p className='mb-4'>หลายคนเป็นคนคิดเก่ง สามารถมองเห็นและตัดสินใจเลือกสิ่งที่ดีที่สุดในเชิง Cost & Benefits ได้ดีเยี่ยม แต่กลับล้มเหลวในการทำงานเป็นทีม เพราะเขาไม่รู้ว่าในทุกๆ การเจรจานั้น...</p>

                    <p className='mb-4 italic text-purple-300'>"คนเราไม่ได้ถกเถียงกันเพื่อกลั่นกรองความจริงของจักรวาล แต่เพื่อหยั่งและรักษาพลวัตทางสังคม"</p>

                    <p className='mb-4'>Logic of Similarity คืออวัจนภาษาที่กระซิบแผ่วเบา แต่มีน้ำหนักมหาศาลในพื้นที่ที่อำนาจในการตัดสินใจไม่ได้เป็นของคนคนเดียว</p>

                    <p className="italic text-purple-300">"คนที่ได้ยินเสียงกระซิบนี้ จึงไม่รีบร้อนเปิดเผยความจริงของตัวเอง แต่รู้จักเฝ้ารอและสังเกตจังหวะที่โลกต้องการมัน"</p>

                </div>
                <div className="w-full md:w-64 shrink-0">
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
                            <li>คุณจะได้รับการ์ดสีต่างๆ 5 ใบ</li>
                            <li>ในแต่ละตา คุณสามารถเลือก <strong>"เปิดเผย" (Reveal)</strong> การ์ดสีเดียวกัน หรือ <strong>"ข้าม" (Skip)</strong></li>
                            <li>คุณแค่ต้องตอบคำถาม "ฉันคือสีอะไร?"</li>
                            <li>เกมจะจบลงเมื่อทุกคนเลือกข้ามติดต่อกัน</li>
                        </ul>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">เป้าหมาย</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>สีที่มีการเปิดเผย <strong>มากที่สุด</strong> จะเป็นสีที่ชนะ</li>
                            <li>ผู้ที่ถือสีนั้นจะได้รับผลตอบแทนจากกองกลาง ตามสัดส่วนจำนวนไพ่ที่เปิดเผย</li>
                            <li>ผู้ที่ถือเผยสีอื่นจะถูกหักเงินเข้ากองกลาง ตามสัดส่วนจำนวนไพ่ที่เปิดเผย</li>
                            <li>ผู้ที่ไม่เผยอะไรเลยจะถูกปรับเงินเข้ากองกลาง ครึ่งหนึ่งของที่มี</li>
                        </ul>

                    </div>

                </div>
                <p className="mt-4 italic text-purple-300 text-center">คุณจะเล่นเพื่อชนะ หรือเพื่อไม่มีใครต้องแพ้?</p>
            </div>

        </div>
    );
}
