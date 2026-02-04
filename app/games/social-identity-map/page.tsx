
import Link from 'next/link';

export default function GameIntro() {
    return (
        <div className="min-h-screen bg-neutral-900 text-white font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-neutral-900 py-24 px-8 text-center">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6">Social Identity Map</h1>
                    <p className="text-2xl text-blue-200 mb-10 leading-relaxed italic">
                        "การถูกมองเห็นคิอการถูกรู้จัก การถูกรู้จักคือการถูกเข้าใจ"
                    </p>
                    <Link
                        href="/games/social-identity-map/play"
                        className="inline-block bg-white text-blue-900 font-bold text-xl px-12 py-4 rounded-full hover:bg-blue-100 transform hover:scale-105 transition-all shadow-lg"
                    >
                        เริ่มสร้างพื้นที่ของคุณ
                    </Link>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Philosophy Section */}
            <div className="max-w-3xl mx-auto py-16 px-8 prose prose-invert prose-lg">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    ปรัชญา
                </h2>
                <p>
                    เรามักจะมีปฏิสัมพันธ์กันเพียงแค่ผิวเผิน มองเห็นเพียงสิ่งที่ปรากฏชัดเจน แต่ทุกคนล้วนมีสถาปัตยกรรมแห่งเลเยอร์ที่ซับซ้อน บางอย่างได้รับมา และบางอย่างถูกสร้างขึ้นมาอย่างพิถีพิถัน
                </p>
                <p>
                    **Social Identity Map** เป็นเครื่องมือสำหรับการใคร่ครวญที่ออกแบบมาเพื่อช่วยให้คุณนำเลเยอร์ภายในออกมาสู่ภายนอก ด้วยการระบุสิ่งที่ **ถูกให้มา (Given)** กับคุณ สิ่งที่คุณ **เลือก (Chosen)** ด้วยตัวเอง และสิ่งที่อยู่เป็น **แกนกลาง (Core)** ของคุณ คุณจะสร้างภาษาภาพสำหรับตัวตนของคุณ
                </p>
                <p>
                    ในพื้นที่นี้ไม่มีการแข่งขัน เงื่อนไขของ "ชัยชนะ" คือช่วงเวลาที่เกิดความกังวานเมื่อคุณแบ่งปันแผนที่ของคุณและใครบางคนพูดว่า *“ฉันเห็นคุณแล้ว”*
                </p>

                <h2 className="mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    วิธีการทำงาน
                </h2>
                <div className="space-y-6 text-gray-300">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 font-bold shrink-0">1</div>
                        <p><strong>ระบุเลเยอร์ของคุณ:</strong> ใช้เครื่องมือแก้ไขเพื่อเพิ่มลักษณะลงในวงแหวน สิ่งที่ถูกให้มา (Given - วงนอก), สิ่งที่เลือก (Chosen - วงกลาง) และ แกนกลาง (Core - วงใน)</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold shrink-0">2</div>
                        <p><strong>สะท้อนถึงผู้อื่น:</strong> เลือกสร้างแผนที่ให้ผู้อื่นในห้องเพื่อแบ่งปันว่าคุณรับรู้ถึงความซับซ้อนที่สวยงามของพวกเขาอย่างไร</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-300 font-bold shrink-0">3</div>
                        <p><strong>วงล้อมแห่งการแบ่งปัน:</strong> สลับกันนำเสนอแผนที่ของคุณ ใช้ฟีเจอร์ "แบ่งปัน (Share)" เพื่อนำทางความสนใจของทุกคนไปยังเรื่องราวในรูปแบบภาพของคุณ</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-8 text-center text-gray-500">
                <Link href="/" className="hover:text-white transition-colors text-sm uppercase tracking-widest">
                    ← กลับสู่ Reconnect
                </Link>
            </footer>
        </div>
    );
}
