import { useState, useEffect } from 'react';
import { IPGroupState } from '../types';
import { Network, RefreshCw, Check, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react';
import { getRandomMobileIP } from '../data';

interface GroupControlProps {
  groups: IPGroupState[];
  selectedGroupId: number;
  onSelectGroup: (id: number) => void;
  onRotateIP: (groupId: number, newIP: string) => void;
}

export default function GroupControl({
  groups,
  selectedGroupId,
  onSelectGroup,
  onRotateIP
}: GroupControlProps) {
  const [isRotating, setIsRotating] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [tempIP, setTempIP] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  // เอฟเฟกต์นับถอยหลังในการสลับโหมดเครื่องบิน
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRotating && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isRotating && countdown === 0) {
      // สุ่ม IP ไทยอันใหม่ให้พร้อมกดยืนยัน
      if (!tempIP) {
        setTempIP(getRandomMobileIP());
      }
    }
    return () => clearTimeout(timer);
  }, [isRotating, countdown, tempIP]);

  const handleStartRotation = () => {
    setIsRotating(true);
    setCountdown(10);
    setTempIP('');
  };

  const handleConfirmRotation = () => {
    const finalIP = tempIP || getRandomMobileIP();
    onRotateIP(selectedGroupId, finalIP);
    setIsRotating(false);
  };

  const activeGroup = (groups && groups.length > 0)
    ? (groups.find(g => g.groupId === selectedGroupId) || groups[0])
    : {
        groupId: selectedGroupId,
        isIPRotated: false,
        lastRotatedTime: null,
        currentIP: 'ยังไม่มีการเชื่อมต่อ'
      };

  return (
    <div className="glass p-6 rounded-2xl mb-8" id="group-control-panel">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-accent" />
            การจัดการกลุ่ม IP และโปรไฟล์ไอดี (Group Selector)
          </h2>
          <p className="text-xs text-teal-muted mt-1">
            แบ่ง 40 โปรไฟล์ออกเป็น 8 กลุ่ม (กลุ่มละ 5 ไอดี) เพื่อสลับ IP มือถือผ่าน Airplane Mode ป้องกันการโดนแบนแบบยกแผง
          </p>
        </div>
        
        <button 
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1.5 text-xs text-teal-accent hover:text-white bg-teal-accent/10 hover:bg-teal-accent/20 border border-teal-accent/20 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          {showGuide ? 'ปิดคำอธิบายกลุ่ม IP' : 'ทำไมต้องแบ่งเป็น 8 กลุ่ม?'}
        </button>
      </div>

      {/* คำอธิบายความรู้สำหรับการจัดการกลุ่ม */}
      {showGuide && (
        <div className="bg-[#1f2833]/50 border border-teal-muted/20 p-4 rounded-xl mb-6 text-xs text-text-secondary leading-relaxed transition-all duration-300">
          <p className="font-semibold text-teal-accent mb-1 flex items-center gap-1">
            💡 กลยุทธ์การบริหาร 40 ไอดี ด้วยงบ 0 บาท:
          </p>
          <ul className="list-disc pl-4 space-y-1 mt-1">
            <li>TikTok มีระบบตรวจจับสแปมจาก IP เดียวกัน หากใช้งานทีละเยอะๆ จะถูกแบนหรือลดการมองเห็น (Shadowban)</li>
            <li>อินเทอร์เน็ตมือถือ (Cellular Data) ใช้ระบบ <span className="font-semibold text-teal-accent">CGNAT Dynamic IP</span> ซึ่งค่ายมือถือจะจ่าย IP ใหม่ให้กับเราทุกครั้งที่เชื่อมต่อใหม่</li>
            <li>การแบ่งกลุ่มละ 5 ไอดี หมายถึงเมื่อเราเปิด-ปิดโหมดเครื่องบิน 1 ครั้ง เราจะดูแลเพียง 5 ไอดีนั้นๆ บน IP เดียวกัน ซึ่งเป็นปริมาณปกติที่ปลอดภัยเสมือนคนในบ้านใช้เน็ตเดียวกัน</li>
          </ul>
        </div>
      )}

      {/* แถบเลือกกลุ่ม 1 - 8 */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6" id="group-buttons-grid">
        {groups.map((group) => {
          const isSelected = group.groupId === selectedGroupId;
          return (
            <button
              key={group.groupId}
              id={`group-btn-${group.groupId}`}
              onClick={() => onSelectGroup(group.groupId)}
              className={`p-3.5 rounded-xl border text-center transition-all relative cursor-pointer ${
                isSelected
                  ? 'border-teal-accent bg-teal-accent/10 text-teal-accent ring-2 ring-teal-accent/20 font-bold glow-cyan'
                  : 'border-teal-muted/20 bg-bg-dark/40 text-text-secondary hover:bg-bg-dark/80 hover:border-teal-muted/40'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-muted">กลุ่มที่</div>
              <div className="text-xl font-black mt-0.5 text-white">{group.groupId}</div>
              
              {/* สถานะการหมุนเวียน IP */}
              <div className="absolute bottom-1 right-1">
                {group.isIPRotated ? (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full block shadow-[0_0_5px_rgba(16,185,129,0.5)]" title="สลับ IP สำหรับกลุ่มนี้แล้ววันนี้" />
                ) : (
                  <span className="w-2 h-2 bg-amber-400 rounded-full block animate-pulse shadow-[0_0_5px_rgba(245,158,11,0.5)]" title="ต้องการการสลับ IP ก่อนเข้าใช้" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ควบคุมการสลับ IP ของกลุ่มที่เลือก */}
      <div className="bg-[#0b0c10]/60 border border-teal-muted/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6" id="active-group-status-panel">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className={`p-4 rounded-xl border ${activeGroup.isIPRotated ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            <Network className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">กลุ่มที่ {selectedGroupId} - IP มือถือของคุณ</h3>
              {activeGroup.isIPRotated ? (
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> สลับ IP แล้ววันนี้
                </span>
              ) : (
                <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">
                  ⚠️ แนะนำให้กดสลับ IP ก่อนเริ่มฟาร์ม
                </span>
              )}
            </div>
            
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-xs text-text-secondary font-mono">
                <span className="text-teal-muted font-sans">IP ปัจจุบัน:</span>{' '}
                <span className="bg-bg-dark text-teal-accent border border-teal-muted/25 px-2 py-0.5 rounded text-xs font-semibold">
                  {activeGroup.currentIP}
                </span>
              </p>
              {activeGroup.lastRotatedTime && (
                <p className="text-[11px] text-teal-muted/80">
                  <span className="text-teal-muted">สลับเมื่อ:</span> {new Date(activeGroup.lastRotatedTime).toLocaleTimeString('th-TH')} น.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ปุ่มสลับ IP */}
        <div className="w-full md:w-auto flex-shrink-0">
          <button
            onClick={handleStartRotation}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-teal-accent text-bg-dark font-bold text-sm px-6 py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(102,252,241,0.3)] glow-cyan-hover cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            สลับ IP ด้วยโหมดเครื่องบิน (Airplane Mode)
          </button>
        </div>
      </div>

      {/* Modal / บานหน้าต่างสลับ IP แบบโต้ตอบ */}
      {isRotating && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="ip-rotation-overlay">
          <div className="bg-card-dark rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-teal-muted/30 animate-scale-up">
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-teal-accent animate-spin" />
                กำลังนำคุณสลับ IP มือถือสำหรับ กลุ่มที่ {selectedGroupId}
              </h4>
            </div>

            <div className="space-y-4 text-text-secondary text-sm mb-6">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300 leading-relaxed">
                  <strong>สำคัญมาก:</strong> ห้ามลืมทำขั้นตอนนี้! การเปิด TikTok สองกลุ่มซ้อนกันบน IP เดิม มีความเสี่ยงที่จะทำให้อีกกลุ่มโดนลดการมองเห็นทันที
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-bg-dark border border-teal-muted/25 flex items-center justify-center text-xs font-bold text-teal-muted">1</span>
                  <p>หยิบมือถือที่ปล่อย Hotspot ขึ้นมา</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-teal-accent/20 border border-teal-accent/30 flex items-center justify-center text-xs font-bold text-teal-accent">2</span>
                  <p>เปิด <strong>"โหมดเครื่องบิน" (Airplane Mode)</strong> ทิ้งไว้ 5-10 วินาที</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-bg-dark border border-teal-muted/25 flex items-center justify-center text-xs font-bold text-teal-muted">3</span>
                  <p>ปิด <strong>"โหมดเครื่องบิน"</strong> เพื่อเชื่อมต่อสัญญาณ 4G/5G ใหม่</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-bg-dark border border-teal-muted/25 flex items-center justify-center text-xs font-bold text-teal-muted">4</span>
                  <p>รอระบบ Wi-Fi บนคอมพิวเตอร์เชื่อมเข้ามือถืออีกครั้ง</p>
                </div>
              </div>

              {/* วงเล็บเวลานับถอยหลัง */}
              <div className="bg-bg-dark/80 border border-teal-muted/15 p-4 rounded-xl text-center">
                {countdown > 0 ? (
                  <div>
                    <span className="text-teal-muted text-xs block mb-1">แนะนำให้รอสัญญาณเซ็ตตัว</span>
                    <span className="text-2xl font-black text-teal-accent">{countdown} วินาที</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> ระบบจำลองสแกนเน็ตเวิร์กพร้อมแล้ว!
                    </span>
                    <span className="text-sm text-text-secondary font-semibold font-mono">
                      IP ใหม่ที่จัดสรร: <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">{tempIP}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsRotating(false)}
                className="px-4 py-2 text-xs font-semibold text-teal-muted hover:bg-bg-dark hover:text-white rounded-xl transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              
              <button
                disabled={countdown > 0}
                onClick={handleConfirmRotation}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  countdown > 0
                    ? 'bg-bg-dark text-teal-muted/40 border border-teal-muted/10 cursor-not-allowed'
                    : 'bg-emerald-500 text-bg-dark hover:bg-emerald-400 font-bold shadow-md shadow-emerald-500/10'
                }`}
              >
                ฉันเปิด-ปิดโหมดเครื่องบินเรียบร้อยแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
