import React, { useState } from 'react';
import { Shield, GitBranch, Cpu, Code2, Users, HardDrive, HelpCircle } from 'lucide-react';

export default function SRSView() {
  const [activeTab, setActiveTab] = useState<'srs' | 'architecture' | 'solid'>('srs');

  return (
    <div className="glass p-6 rounded-2xl" id="srs-architecture-view">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-accent" />
            1 &amp; 2. Software Requirements &amp; System Architecture
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            สถาปัตยกรรมระดับองค์กร (Enterprise Architecture) และข้อกำหนดระบบจัดการผู้สร้างสรรค์เนื้อหาแบบ Multi-Account
          </p>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex gap-1 bg-bg-dark/60 p-1 rounded-xl border border-teal-muted/15">
          <button
            onClick={() => setActiveTab('srs')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'srs'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            SRS (ข้อกำหนด)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'architecture'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab('solid')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'solid'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            SOLID Principles
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="text-xs leading-relaxed text-text-secondary">
        {activeTab === 'srs' && (
          <div className="space-y-4 animate-fade-in" id="srs-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
                <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-accent" />
                  Functional Requirements (FR)
                </h4>
                <ul className="space-y-2 list-disc pl-4 text-text-secondary">
                  <li>
                    <strong className="text-white">Multi-Account Isolation:</strong> ระบบต้องแยกประวัติ คุกกี้ และค่า Fingerprints ผ่านกลไก Sandboxed Proxy ของ ixBrowser หรือ Anti-detect Browser
                  </li>
                  <li>
                    <strong className="text-white">Workflow Scheduler Service:</strong> ตารางคิวแบบลำดับความสำคัญ (Priority Queue) ควบคุมเวลาโพสต์วิดีโอ การมีปฏิสัมพันธ์ และการจำลองพฤติกรรมมนุษย์โดยสับหลีกช่วงเวลาไม่ให้ซ้อนทับกัน
                  </li>
                  <li>
                    <strong className="text-white">Relational Persistence (SQLite):</strong> การจัดเก็บบัญชีผู้ใช้ ประวัติตารางเวลา คอนฟิก และบันทึกกิจกรรมอย่างมีโครงสร้างและเชื่อมโยงกันอย่างปลอดภัยบน Local Storage 100%
                  </li>
                  <li>
                    <strong className="text-white">Secure Local Backup:</strong> ฟังก์ชันสำรองข้อมูลระบบออกเป็น Schema-safe JSON/SQL Dump และกู้คืนกลับสู่สถานะเดิมได้ทันทีโดยไม่มีการสูญหายของข้อมูล
                  </li>
                </ul>
              </div>

              <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
                <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-accent" />
                  Non-Functional Requirements (NFR)
                </h4>
                <ul className="space-y-2 list-disc pl-4 text-text-secondary">
                  <li>
                    <strong className="text-white">Performance Target:</strong> GUI ต้องตอบสนองภายใน 100ms. การรันคิวจำลองงานเบื้องหลังต้องไม่ดึง CPU ของเครื่องผู้ใช้เกิน 5%
                  </li>
                  <li>
                    <strong className="text-white">Security &amp; Encryption:</strong> บันทึกรหัสผ่าน คุกกี้ และ API Keys ทั้งหมดจะต้องถูกเข้ารหัสในระดับความจุ AES-256-GCM ก่อนเขียนลงสู่ SQLite database ด้วยค่าเกลือ (Salt) ที่สร้างเฉพาะแต่ละเครื่อง
                  </li>
                  <li>
                    <strong className="text-white">Zero Cost Architecture:</strong> ทุกองค์ประกอบต้องพึ่งพาสแต็กที่เป็น Opensource หรือแพลนฟรี 100% (Electron, React, SQLite, Tailwind, Lucide) โดยไม่มีเงื่อนไขค่าใช้จ่ายแอบแฝง
                  </li>
                  <li>
                    <strong className="text-white">Off-grid Resiliency:</strong> ระบบต้องสามารถเปิดทำงานออฟไลน์ได้อย่างสมบูรณ์แบบโดยไม่ต้องพึ่งพาคลาวด์ภายนอกในการจัดเก็บโครงสร้างสเตตงาน
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-teal-accent/5 border border-teal-accent/25 p-4 rounded-xl">
              <h4 className="font-bold text-white text-sm mb-1">🎯 จุดประสงค์และเป้าหมายผู้สร้างแอปพลิเคชัน (Creator's Goal)</h4>
              <p>
                ออกแบบขึ้นเพื่อปลดล็อกขีดจำกัดของครีเอเตอร์และฟาร์มบัญชี โดยการรวบรวมฟังก์ชันการสลับ IP อัตโนมัติ (Dynamic Network Rotation), การจำลอง Fingerprint โปรไฟล์ และการคุมจังหวะความถี่ในการอัปโหลดเนื้อหา ให้ทำงานสอดประสานกันภายใน Desktop Application ตัวเดียว ซึ่งช่วยลดขั้นตอนซับซ้อน ป้องกันบัญชีถูกแบน และสร้างการเติบโตอย่างมั่นคงแบบไร้ต้นทุน
              </p>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-4 animate-fade-in" id="architecture-content">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
              <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-teal-accent" />
                Clean Architecture Design (4-Layers Boundary)
              </h4>
              
              {/* Architecture diagram visualization */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center my-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
                  <span className="font-black text-emerald-400 block mb-1 uppercase tracking-wider text-[10px]">1. Entities</span>
                  <p className="text-[10px] text-text-secondary">
                    แกนกลางโมเดลทางธุรกิจ ไร้การพึ่งพาทุกเลเยอร์ภายนอก (e.g. CreatorAccount, PublishWorkflow)
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                  <span className="font-black text-blue-400 block mb-1 uppercase tracking-wider text-[10px]">2. Use Cases</span>
                  <p className="text-[10px] text-text-secondary">
                    กฎและเวิร์กโฟลว์ทางธุรกิจ (e.g. AccountRepository, WorkflowSchedulerService)
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg">
                  <span className="font-black text-amber-400 block mb-1 uppercase tracking-wider text-[10px]">3. Interface Adapters</span>
                  <p className="text-[10px] text-text-secondary">
                    ตัวแปลงข้อมูลเชื่อมระหว่าง UI และ Core Logic (e.g. SQLite Controllers, IPC Routers)
                  </p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg">
                  <span className="font-black text-purple-400 block mb-1 uppercase tracking-wider text-[10px]">4. Frameworks &amp; Drivers</span>
                  <p className="text-[10px] text-text-secondary">
                    เครื่องมือภายนอก, GUI และฐานข้อมูล (e.g. Electron GUI, SQLite Driver, React Components)
                  </p>
                </div>
              </div>

              <p className="mt-2 text-text-secondary">
                ในสถาปัตยกรรมนี้ <strong>Dependency Rule</strong> จะชี้เข้าสู่ด้านในเสมอ เลเยอร์ภายในจะไม่รู้จักเครื่องมือของเลเยอร์ภายนอก เช่น ยูสเคสบริหารบัญชีจะไม่รู้จักคำสั่ง SQL หรือไลบรารี Electron UI โดยตรง แต่จะสื่อสารผ่านพอร์ตอินเตอร์เฟส (Repository Interface) ทำให้เราสามารถเปลี่ยนผ่านไลบรารีฐานข้อมูลหรือพอร์ต UI ได้โดยไม่รบกวน Core Business Logic ของระบบ
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
                <h5 className="font-bold text-white mb-2 flex items-center gap-1">
                  <HardDrive className="w-4 h-4 text-teal-accent" />
                  Electron Context Isolation &amp; IPC Bridge
                </h5>
                <p>
                  เพื่อความปลอดภัยขั้นสูงสุดของแอปพลิเคชัน Desktop ระบบจะใช้ <strong>Context Isolation</strong> แยกสเตจหน่วยความจำระหว่าง Main Process (Node.js/SQLite) และ Renderer Process (React GUI) อย่างเด็ดขาด โดย Renderer จะเรียกฟังก์ชันผ่านการส่งสารแบบปลอดภัยทางช่องทาง <strong>IPC (Inter-Process Communication)</strong> ที่ถูกเปิดเผยผ่านพรีโหลดสคริปต์ (Preload Script) เท่านั้น
                </p>
              </div>

              <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
                <h5 className="font-bold text-white mb-2 flex items-center gap-1">
                  <Code2 className="w-4 h-4 text-teal-accent" />
                  Inversion of Control (IoC)
                </h5>
                <p>
                  ระบบใช้กลไกการสลับทิศทางควบคุมการทำงานผ่านพอร์ตอินเตอร์เฟส โดยการลงทะเบียน Repository ลงในระบบเมื่อรัน และป้อนเข้าสู่ Service Layer (Dependency Injection) ซึ่งจะช่วยลดการผูกมัดโค้ดอย่างแนบแน่น (Decoupled Classes) ช่วยให้การเขียน Unit Test ด้วย Mock Classes ทำงานได้อย่างง่ายดายโดยไม่ต้องต่อฐานข้อมูลจริง
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'solid' && (
          <div className="space-y-4 animate-fade-in" id="solid-content">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-3 rounded-xl">
                <span className="font-black text-teal-accent text-sm block mb-1 font-mono">S</span>
                <span className="font-bold text-white block mb-1">Single Responsibility</span>
                <p className="text-[10px] text-text-secondary">
                  คลาสหรือไฟล์มีหน้าที่เพียงอย่างเดียว เช่น <code>SQLiteDatabaseEngine</code> มีหน้าที่คุยกับไดรเวอร์ SQLite เท่านั้น และจะไม่มีส่วนร่วมในการคำนวณหรือจัดการหน้าต่าง UI
                </p>
              </div>
              
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-3 rounded-xl">
                <span className="font-black text-teal-accent text-sm block mb-1 font-mono">O</span>
                <span className="font-bold text-white block mb-1">Open/Closed</span>
                <p className="text-[10px] text-text-secondary">
                  เปิดให้ขยาย แต่ปิดไม่ให้แก้ไข เช่น คลาสการจำลอง engagement <code>ActionExecutor</code> สามารถขยายฟังก์ชันพฤติกรรมใหม่ๆ (เช่น การกดติดตาม) ได้ผ่านการสืบทอดโดยไม่ต้องเข้าไปแก้โค้ดโครงหลักเดิม
                </p>
              </div>

              <div className="bg-bg-dark/40 border border-teal-muted/15 p-3 rounded-xl">
                <span className="font-black text-teal-accent text-sm block mb-1 font-mono">L</span>
                <span className="font-bold text-white block mb-1">Liskov Substitution</span>
                <p className="text-[10px] text-text-secondary">
                  คลาสลูกต้องใช้แทนคลาสแม่ได้ทุกมิติ เช่น <code>MockAccountRepository</code> ต้องสามารถถูกแทนที่ด้วย <code>SQLiteAccountRepository</code> ภายใต้ Use Case เดิมได้โดยไม่มีบั๊กหรือสเตตล้มเหลว
                </p>
              </div>

              <div className="bg-bg-dark/40 border border-teal-muted/15 p-3 rounded-xl">
                <span className="font-black text-teal-accent text-sm block mb-1 font-mono">I</span>
                <span className="font-bold text-white block mb-1">Interface Segregation</span>
                <p className="text-[10px] text-text-secondary">
                  อินเตอร์เฟสควรแยกส่วนไม่ให้คลาสต้องรับกรรมสืบทอดฟังก์ชันที่ไม่ได้ใช้ เช่น แยกอินเตอร์เฟสการบันทึกประวัติ (Loggable) ออกจากคลาสจัดการสเตตข้อมูลบัญชีหลัก
                </p>
              </div>

              <div className="bg-bg-dark/40 border border-teal-muted/15 p-3 rounded-xl">
                <span className="font-black text-teal-accent text-sm block mb-1 font-mono">D</span>
                <span className="font-bold text-white block mb-1">Dependency Inversion</span>
                <p className="text-[10px] text-text-secondary">
                  คลาสระดับสูงต้องไม่พึ่งพาคลาสระดับต่ำ แต่ต้องพึ่งพาสิ่งที่เป็นนามธรรม (Abstraction) เช่น คลาสหน้าจอจะอ้างอิงถึง <code>IAccountRepository</code> (อินเตอร์เฟส) แทนที่จะพึ่งพา <code>SQLiteConnection</code> โดยตรง
                </p>
              </div>
            </div>

            <div className="bg-[#1f2833]/50 p-4 border border-teal-muted/20 rounded-xl flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-teal-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">💡 ความคุ้มค่าทางวิศวกรรมสถาปัตยกรรม (Architectural Engineering Payoff)</p>
                <p className="mt-1">
                  การปฏิบัติตาม SOLID และ Clean Architecture ในโครงสร้าง Electron + React + SQLite นี้ ช่วยให้สามารถพัฒนาโมดูลแบบคู่ขนานกันได้โดยไม่มีการบล็อกสเตตการพัฒนา คาร์ดแสดงสถิติและตัวจัดตารางเวลาจะทำงานโดยตัดขาดจากโครงสร้างเซสชันของ Browser ทำให้การอัปเกรดระบบในอนาคตทำได้อย่างคล่องตัว รวดเร็ว และทนทานต่อการขยายตัวสูงสุด
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
