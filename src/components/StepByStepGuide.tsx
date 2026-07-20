import { useState } from 'react';
import { Chrome, Shield, Smartphone, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function StepByStepGuide() {
  const [activeTab, setActiveTab] = useState<'ixbrowser' | 'ip_hotspot' | 'strategy' | 'human_behavior'>('ixbrowser');

  return (
    <div className="glass p-6 rounded-2xl" id="step-by-step-guide-panel">
      <div className="border-b border-teal-muted/15 pb-4 mb-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-teal-accent" />
          คู่มือกลยุทธ์การฟาร์ม 40 แอคเค้าท์ติ๊กต๊อกแบบปลอดภัย (งบ 0 บาท)
        </h3>
        <p className="text-xs text-teal-muted mt-0.5">
          ศึกษาเทคนิคและตารางเวลาฟาร์มจากผู้เชี่ยวชาญเพื่อหลีกเลี่ยงการโดนแบนเงียบ (Shadowban)
        </p>
      </div>

      {/* แท็บตัวเลือกคู่มือ */}
      <div className="flex flex-wrap gap-1.5 mb-5 border-b border-teal-muted/10 pb-3" id="guide-tabs">
        <button
          onClick={() => setActiveTab('ixbrowser')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ixbrowser'
              ? 'bg-teal-accent text-bg-dark font-extrabold shadow-[0_0_12px_rgba(102,252,241,0.25)]'
              : 'text-teal-muted hover:bg-bg-dark/60 hover:text-white'
          }`}
        >
          <Chrome className="w-4 h-4" />
          1. โปรแกรม ixBrowser
        </button>

        <button
          onClick={() => setActiveTab('ip_hotspot')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ip_hotspot'
              ? 'bg-teal-accent text-bg-dark font-extrabold shadow-[0_0_12px_rgba(102,252,241,0.25)]'
              : 'text-teal-muted hover:bg-bg-dark/60 hover:text-white'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          2. การคุม IP (งบ 0 บาท)
        </button>

        <button
          onClick={() => setActiveTab('strategy')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'strategy'
              ? 'bg-teal-accent text-bg-dark font-extrabold shadow-[0_0_12px_rgba(102,252,241,0.25)]'
              : 'text-teal-muted hover:bg-bg-dark/60 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          3. แผนสมัครและฟาร์ม
        </button>

        <button
          onClick={() => setActiveTab('human_behavior')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'human_behavior'
              ? 'bg-teal-accent text-bg-dark font-extrabold shadow-[0_0_12px_rgba(102,252,241,0.25)]'
              : 'text-teal-muted hover:bg-bg-dark/60 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          4. พฤติกรรมมนุษย์
        </button>
      </div>

      {/* เนื้อหาในแต่ละแท็บ */}
      <div className="text-text-secondary text-xs leading-relaxed" id="guide-tab-content">
        {activeTab === 'ixbrowser' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-teal-accent/10 border border-teal-accent/20 p-4 rounded-xl flex gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h4 className="font-bold text-teal-accent text-sm">ดาวน์โหลด ixBrowser (แนะนำที่สุด)</h4>
                <p className="mt-1">
                  เป็น Anti-detect Browser ตัวเดียวที่เปิดให้ใช้งาน <strong className="text-teal-accent">Free Forever</strong> โดยไม่จำกัดจำนวนโปรไฟล์รวม (Unlimited Profiles) สามารถสับเปลี่ยนเครื่องจำลอง Fingerprint, Canvas, และ User-Agent แยกจากกันได้อย่างอิสระทุกโปรไฟล์
                </p>
                <p className="mt-1 font-mono text-[10px] text-teal-accent/80">เข้าเว็บไซต์อย่างเป็นทางการ: ixbrowser.com</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-dark/40 p-4 rounded-xl border border-teal-muted/15">
                <h5 className="font-bold text-white mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> เงื่อนไขแผนฟรี
                </h5>
                <ul className="list-disc pl-4 space-y-1.5 text-text-secondary">
                  <li>สร้างโปรไฟล์ใหม่ได้สูงสุด <strong className="text-teal-accent">10 โปรไฟล์/วัน</strong> (ทำ 4 วันจะได้ครบ 40 บัญชีตามตาราง)</li>
                  <li>เปิดใช้งานโปรไฟล์ได้วันละ <strong className="text-teal-accent">100 ครั้ง</strong> ซึ่งเหลือเฟือสำหรับการฟาร์ม 40 ไอดี</li>
                  <li>มีช่องสำหรับสวม Proxy แยกรายโปรไฟล์เพื่อเชื่อมต่อ VPN แยกต่างหากได้</li>
                </ul>
              </div>

              <div className="bg-bg-dark/40 p-4 rounded-xl border border-teal-muted/15">
                <h5 className="font-bold text-white mb-2 flex items-center gap-1">
                  ⚠️ ทางเลือกสำรองอื่นๆ
                </h5>
                <ul className="list-disc pl-4 space-y-1.5 text-text-secondary">
                  <li><strong className="text-teal-accent">Donut Browser:</strong> ซอฟต์แวร์ Open-source Anti-detect Browser ฟรี 100% ไม่จำกัดจำนวนโปรไฟล์</li>
                  <li><strong className="text-teal-accent">Brave/Chrome (Multi-Profile):</strong> แยกโปรไฟล์โปรแกรมปกติ + ใส่ Extension คุม Proxy รายโปรไฟล์ เช่น Proxy SwitchyOmega (แนะนำเฉพาะเมื่อเปิด ixBrowser ไม่เสถียร)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ip_hotspot' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3">
              <Smartphone className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-300 text-sm">การแชร์ Hotspot มือถือ + สลับโหมดเครื่องบิน (Airplane Mode)</h4>
                <p className="mt-1">
                  การรัน 40 แอคเค้าท์บนอินเทอร์เน็ตบ้าน (Fixed IP) เสี่ยงต่อการระบุว่าเป็นบอทสแปมและถูกแบนทั้งหมดพร้อมกัน เนื่องจากไอพีไม่มีการเปลี่ยน แต่เราสามารถใช้เทคนิค <strong>Dynamic IP</strong> ของสัญญาณมือถือมาประหยัดค่าใช้จ่ายได้
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-bold text-white text-xs">ขั้นตอนปฏิบัติจริง:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-bg-dark/50 p-3.5 rounded-xl border border-teal-muted/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center font-bold text-[11px] mb-2 border border-teal-accent/30">1</div>
                  <h6 className="font-bold text-white mb-1">แชร์เน็ต Hotspot</h6>
                  <p className="text-text-secondary text-[11px]">แชร์เน็ตจากโทรศัพท์มือถือเข้าคอมพิวเตอร์ของคุณเพื่อใช้ IP หมุนเวียนค่ายมือถือ</p>
                </div>
                <div className="bg-bg-dark/50 p-3.5 rounded-xl border border-teal-muted/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center font-bold text-[11px] mb-2 border border-teal-accent/30">2</div>
                  <h6 className="font-bold text-white mb-1">ทำงานรอบละ 5 บัญชี</h6>
                  <p className="text-text-secondary text-[11px]">เปิดทำความสะอาด/ฟาร์ม บัญชีติ๊กต๊อกในกลุ่มที่เลือกทีละ 5 บัญชีพร้อมกันบน IP นั้น</p>
                </div>
                <div className="bg-bg-dark/50 p-3.5 rounded-xl border border-teal-muted/15 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center font-bold text-[11px] mb-2 border border-teal-accent/30">3</div>
                  <h6 className="font-bold text-white mb-1">สลับโหมดเครื่องบิน</h6>
                  <p className="text-text-secondary text-[11px]">เมื่อเปลี่ยนกลุ่มถัดไป ให้เปิดโหมดเครื่องบินมือถือ 5-10 วินาทีเพื่อรีเซ็ตโครงข่ายรับ IP ใหม่</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> แผนสมัครไอดีแบบปลอดภัย (Staggered Sign-up Schedule)
              </h4>
              <p className="mt-1 text-text-secondary">
                <strong>ห้ามสมัคร 40 ไอดีพร้อมกันในวันเดียวเด็ดขาด!</strong> เพราะติ๊กต๊อกจะจดจำรูปแบบการกระทำที่ผิดปกติและแบนบัญชีของคุณทั้งหมด ควรทยอยสมัครและฟาร์มอย่างใจเย็น
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs">ตารางการจัดสรรเวลาสร้างโปรไฟล์:</h5>
              <div className="border border-teal-muted/15 rounded-xl overflow-hidden font-mono text-[11px]">
                <div className="grid grid-cols-4 bg-bg-dark p-2 text-teal-muted border-b border-teal-muted/15 font-bold">
                  <div>วันทำงาน</div>
                  <div>การสมัครบัญชีใหม่</div>
                  <div>กิจกรรมรายวัน</div>
                  <div>เป้าหมายสะสม</div>
                </div>
                <div className="grid grid-cols-4 p-2.5 border-b border-teal-muted/10">
                  <div className="font-sans text-white font-semibold">วันที่ 1</div>
                  <div className="text-teal-accent">สมัคร 10 ไอดี (กลุ่ม 1-2)</div>
                  <div className="font-sans text-text-secondary">ท่องฟีดเฉยๆ กดไลก์ 2-3 ครั้ง</div>
                  <span className="bg-teal-accent/15 text-teal-accent px-1.5 py-0.5 rounded text-[10px] w-fit border border-teal-accent/20">10 ไอดีในระบบ</span>
                </div>
                <div className="grid grid-cols-4 p-2.5 border-b border-teal-muted/10">
                  <div className="font-sans text-white font-semibold">วันที่ 2</div>
                  <div className="text-teal-accent">สมัคร 10 ไอดี (กลุ่ม 3-4)</div>
                  <div className="font-sans text-text-secondary">ฟาร์มไอดีวันแรกต่อ + เริ่มฟาร์มกลุ่มใหม่</div>
                  <span className="bg-teal-accent/15 text-teal-accent px-1.5 py-0.5 rounded text-[10px] w-fit border border-teal-accent/20">20 ไอดีในระบบ</span>
                </div>
                <div className="grid grid-cols-4 p-2.5 border-b border-teal-muted/10">
                  <div className="font-sans text-white font-semibold">วันที่ 3</div>
                  <div className="text-teal-accent">สมัคร 10 ไอดี (กลุ่ม 5-6)</div>
                  <div className="font-sans text-text-secondary">คุมพฤติกรรมมนุษย์ทุกกลุ่มที่สมัครแล้ว</div>
                  <span className="bg-teal-accent/15 text-teal-accent px-1.5 py-0.5 rounded text-[10px] w-fit border border-teal-accent/20">30 ไอดีในระบบ</span>
                </div>
                <div className="grid grid-cols-4 p-2.5">
                  <div className="font-sans text-white font-semibold">วันที่ 4</div>
                  <div className="text-teal-accent">สมัคร 10 ไอดี (กลุ่ม 7-8)</div>
                  <div className="font-sans text-text-secondary">ไอดีกลุ่มแรกๆ แข็งแรงเริ่มปักตะกร้าลงงาน</div>
                  <span className="bg-teal-accent/15 text-teal-accent px-1.5 py-0.5 rounded text-[10px] w-fit border border-teal-accent/20">ครบ 40 ไอดี!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'human_behavior' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-bg-dark/50 p-4 rounded-xl border border-teal-muted/15 flex gap-3">
              <span className="text-2xl">🧠</span>
              <div>
                <h4 className="font-bold text-white text-sm">เลียนแบบพฤติกรรมมนุษย์ทั่วไป (Human Emulation)</h4>
                <p className="mt-1 text-text-secondary">
                  ความล้มเหลวของการทำแอคเค้าท์สายฟาร์ม มักมาจากการเปิดไอดีเสร็จแล้วโพสต์ขายของทันที ระบบจะระบุว่าเป็น <strong>"บอทขยะสแปม"</strong> และแบนการเข้าถึงวิดีโอ (ยอดวิวเป็น 0) ทันที
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20">
                <h5 className="font-bold text-emerald-400 mb-2">✅ วิธีฟาร์มเพื่อให้ติ๊กต๊อกรัก:</h5>
                <ul className="list-decimal pl-4 space-y-1.5 text-text-secondary">
                  <li><strong>ท่องหน้าฟีด:</strong> ไถดูความเคลื่อนไหว 5-10 นาทีต่อวันเพื่อให้ระบบบันทึกคุกกี้ทั่วไป</li>
                  <li><strong>ดูคลิปจนจบ:</strong> วิดีโอสั้นไหนตลกหรือกำลังดัง ให้ดูจนจบ หรือกดดูซ้ำให้มีพฤติกรรมเป็นผู้เสพเนื้อหาจริง</li>
                  <li><strong>มีปฏิสัมพันธ์ธรรมดา:</strong> กดไลก์ 2-3 วิดีโอที่เกี่ยวกับแนวนิชของคุณ และคอมเมนต์แลกเปลี่ยนแบบคนคุยกัน</li>
                </ul>
              </div>

              <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/20">
                <h5 className="font-bold text-rose-400 mb-2">❌ พฤติกรรมต้องห้ามช่วง 3-5 วันแรก:</h5>
                <ul className="list-decimal pl-4 space-y-1.5 text-text-secondary">
                  <li>สมัครปุ๊บ สแปมโพสต์วิดีโอทันที หรือลงวิดีโอละ 10 คลิปต่อวัน</li>
                  <li>กระหน่ำกดติดตาม (Follow Spams) คราวละ 50-100 บัญชีในเวลาไม่กี่นาที</li>
                  <li>เปิดและปิดไอดีอย่างรวดเร็วโดยไม่มีปฏิสัมพันธ์ใดๆ บนหน้าจอนานเกิน 30 วินาที</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
