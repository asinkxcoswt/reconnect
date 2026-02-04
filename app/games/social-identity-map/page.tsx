
import Link from 'next/link';

export default function GameIntro() {
    return (
        <div className="min-h-screen bg-neutral-900 text-white pb-24">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-neutral-900 py-24 px-8 text-center">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold mb-6">Social Identity Map</h1>
                    <p className="text-2xl text-blue-200 mb-10 leading-relaxed italic">
                        "ถ้าถอดบทบาทออกไป คุณเป็นใคร"
                    </p>
                    <Link
                        href="/games/social-identity-map/play"
                        className="inline-block bg-white text-blue-900 font-bold text-xl px-12 py-4 rounded-full hover:bg-blue-100 transform hover:scale-105 transition-all shadow-lg"
                    >
                        เริ่มแนะนำให้โลกรู้จักคุณ
                    </Link>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Philosophy Section */}
            <div className="max-w-4xl mx-auto py-8 px-8 flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 prose prose-invert prose-lg">
                    <h2 className="mb-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        คุณเป็นใคร
                    </h2>
                    <p className='mb-4'>ใครบางคนที่พาคุณมาที่นี่ คงอยากรู้จักคุณมากขึ้น <br /> มากกว่าแค่เพื่อนร่วมงาน หัวหน้า-ลูกน้อง ครู-นักเรียน หรือคนแปลกหน้า</p>
                    <p className='mb-4'>เขาไม่ได้อยากจะสัมพันธ์กับ<b>บทบาท</b>ที่น่าอึดอัดเหล่านั้น <br /> แต่อยากจะอยู่กับคุณได้โดยที่ไม่ต้องกลัว ไม่ต้องแข่งขัน และอยากให้คุณไม่กลัวเขาเช่นกัน</p>
                    <p className='mb-4'>มีอะไรบ้างไหมที่คุณอยากเป็น แต่เป็นไม่ค่อยได้? <br /> หรือมีอะไรบ้างไหมที่คุณเป็นบ่อยๆ ทั้งที่ไม่ค่อยอยากเป็น? <br /> อะไรทำให้คุณอาย กลัว หรือภาคภูมิใจ?</p>
                    <p className='mb-4 italic text-purple-300'>คุณคิดว่าคนอื่นมองคุณเป็นอย่างไร และอยากรู้ไหมว่าที่จริงแล้ว เขามองคุณอย่างไรกันแน่?</p>

                    <p className='mb-4'>
                        <b>Social Identity Map</b> เป็นเครื่องมือสำหรับการใคร่ครวญที่จะทำให้เรารู้จักกันมากกว่าบทบาทและ stereotype
                    </p>
                    <p>
                        ในพื้นที่นี้ไม่มีการแข่งขัน เงื่อนไขของ "ชัยชนะ" คือช่วงเวลาที่คุณแบ่งปันตัวตนของคุณ และรู้สึกโล่งใจว่าคุณเป็นตัวของตัวเองได้ในพื้นที่แห่งนี้
                    </p>
                </div>
                <div className="w-80 shrink-0 flex items-center justify-center">
                    <img
                        src="/social-identity-concept.png"
                        alt="Layers of Identity"
                        className="rounded-lg shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                    />
                </div>

            </div>
            <div className="max-w-4xl mx-auto px-8">

                <h2 className="mb-4 mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    วิธีการใช้งาน
                </h2>
                <div className="space-y-6 text-gray-300">
                    <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 font-bold shrink-0">1</div>
                        <p><strong>วาดแผนที่ของคุณ:</strong> ใช้เครื่องมือแก้ไขเพื่อเพิ่มลักษณะลงในวงแหวน สิ่งที่ถูกให้มา (Given - วงนอก), สิ่งที่เลือก (Chosen - วงกลาง) และ แกนกลาง (Core - วงใน)</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold shrink-0">2</div>
                        <p><strong>สะท้อนถึงผู้อื่น:</strong> เลือกสร้างแผนที่ให้ผู้อื่นในห้องเพื่อแบ่งปันว่าคุณรับรู้ถึงความซับซ้อนที่สวยงามของพวกเขาอย่างไร</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-300 font-bold shrink-0">3</div>
                        <p><strong>วงล้อมแห่งการแบ่งปัน:</strong> สลับกันนำเสนอแผนที่ของคุณ ใช้ฟีเจอร์ "แบ่งปัน (Share)" เพื่อนำทางความสนใจของทุกคนไปยังเรื่องราวในแผนภาพของคุณ</p>
                    </div>
                </div>

                <h2 className="mb-4 mt-12 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    แหล่งที่มา
                </h2>
                <div className="space-y-6 text-gray-300">
                    <Link className='py-2 px-4 bg-blue-600/60 rounded-lg' href="https://www.countyhealthrankings.org/sites/default/files/media/document/resources/Social%20Identity%20Mapping.pdf">
                        countyhealthrankings.org
                    </Link>
                </div>
            </div>

        </div>
    );
}
