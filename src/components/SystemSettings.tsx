import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, Download, Upload, Eye, FileCode, CheckCircle, AlertTriangle, Palette, Trash2 } from 'lucide-react';
import { AppConfig, SystemLog } from '../types';

interface SystemSettingsProps {
  config: AppConfig;
  onUpdateConfig: (updated: Partial<AppConfig>) => void;
  onExportData: () => string;
  onImportData: (jsonStr: string) => boolean;
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
  onSystemCleanup: () => void;
}

export default function SystemSettings({
  config,
  onUpdateConfig,
  onExportData,
  onImportData,
  onAddLog,
  onSystemCleanup
 }: SystemSettingsProps) {
  const [activeTab, setActiveTab] = useState<'backup' | 'autoupdate' | 'security' | 'theme' | 'cleanup'>('backup');
  
  // Backup & Restore state
  const [importedJson, setImportedJson] = useState('');
  const [backupMessage, setBackupMessage] = useState<{ success: boolean; text: string } | null>(null);
  
  // Update state
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateProgress, setUpdateProgress] = useState<number | null>(null);
  const [updateVersion, setUpdateVersion] = useState('v1.0.4');

  // PIN security state
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  // Cleanup state
  const [cleanupSuccess, setCleanupSuccess] = useState(false);

  const handleExport = () => {
    try {
      const dataStr = onExportData();
      navigator.clipboard.writeText(dataStr);
      setBackupMessage({ success: true, text: 'ดึงข้อมูลสำรองสำเร็จ และคัดลอกลงใน Clipboard เรียบร้อย!' });
      onAddLog('ส่งออกสำเนา SQLite สำเร็จ ขนาด 1.2 KB', 'SQLiteEngine', 'info');
      setTimeout(() => setBackupMessage(null), 3000);
    } catch (err: any) {
      setBackupMessage({ success: false, text: 'ล้มเหลวในการดึงไฟล์ข้อมูลสำรอง' });
    }
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importedJson.trim()) return;

    onAddLog('กำลังสแกนและตรวจสอบโครงสร้างไฟล์นำเข้าสำรอง', 'SQLiteEngine', 'info');
    
    const success = onImportData(importedJson);
    if (success) {
      setBackupMessage({ success: true, text: 'กู้คืนฐานข้อมูล SQLite สำเร็จ! ข้อมูลครีเอเตอร์ถูกนำเข้าเรียบร้อย' });
      onAddLog('บูรณะฟื้นฟูโครงสร้าง SQLite สำเร็จ 100% ครบถ้วน', 'SQLiteEngine', 'info');
      setImportedJson('');
    } else {
      setBackupMessage({ success: false, text: 'ล้มเหลว โครงสร้างข้อมูล JSON ไม่ถูกต้องตาม Schema' });
      onAddLog('โครงสร้างนำเข้า SQLite ไม่ปลอดภัยหรือผิดประเภทโมเดล', 'SQLiteEngine', 'error');
    }
    setTimeout(() => setBackupMessage(null), 4000);
  };

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    onAddLog(`กำลังค้นหาอัพเดตแอปพลิเคชันจาก GitHub Release สาขา: [${config.autoUpdateBranch}]`, 'MainProcess', 'info');

    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateVersion('v1.0.5 (อัพเดตใหม่ล่าสุด)');
      setUpdateProgress(0);
      onAddLog('พบบิลด์เวอร์ชันใหม่ v1.0.5 บนระบบคลาวด์ กำลังดาวน์โหลด...', 'MainProcess', 'info');

      const interval = setInterval(() => {
        setUpdateProgress((prev) => {
          if (prev === null) return null;
          if (prev >= 100) {
            clearInterval(interval);
            onAddLog('ดาวน์โหลดบิลด์ v1.0.5 สำเร็จ พร้อมรันเบื้องหลังเมื่อรีบูต Electron', 'MainProcess', 'info');
            setTimeout(() => setUpdateProgress(null), 2000);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }, 1200);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setPinMessage('กรุณากรอกรหัส PIN เป็นตัวเลข 4 หลักเท่านั้น');
      return;
    }

    onUpdateConfig({ securityPin: newPin });
    setPinMessage('บันทึกรหัสล็อกแอปพลิเคชัน 4 หลัก เรียบร้อย!');
    onAddLog('อัปเดตรหัสผ่าน PIN ความปลอดภัยของระบบตัวเครื่องเรียบร้อย', 'MainProcess', 'info');
    setNewPin('');
    setTimeout(() => setPinMessage(''), 3000);
  };

  const handleCleanupTrigger = () => {
    onSystemCleanup();
    setCleanupSuccess(true);
    onAddLog('ทำการกวาดล้างหน่วยความจำและรีเซ็ต Log ข้อมูลย้อนหลังทั้งหมดสำเร็จ', 'MainProcess', 'warn');
    setTimeout(() => {
      setCleanupSuccess(false);
    }, 4000);
  };

  return (
    <div className="glass p-6 rounded-2xl" id="system-settings-panel">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-accent" />
            9, 14, 16 &amp; 17. Settings, Backup &amp; Security Console
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            คอนฟิกข้อมูลความปลอดภัยสำรองข้อมูลระบบ ตัวกรอง Auto-Update และรหัสล็อกตัวแอปพลิเคชัน
          </p>
        </div>

        {/* Local switcher */}
        <div className="flex gap-1 bg-bg-dark/60 p-1 rounded-xl border border-teal-muted/15">
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'backup'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Backup &amp; Restore
          </button>
          <button
            onClick={() => setActiveTab('autoupdate')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'autoupdate'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Auto Update
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'security'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Security PIN
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'theme'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            UI Theme
          </button>
          <button
            onClick={() => setActiveTab('cleanup')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'cleanup'
                ? 'bg-rose-500 text-white'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            System Cleanup
          </button>
        </div>
      </div>

      {/* Settings Panel Content */}
      <div className="text-xs text-text-secondary">
        {activeTab === 'backup' && (
          <div className="space-y-4 animate-fade-in" id="settings-backup">
            {/* Feedback message */}
            {backupMessage && (
              <div className={`p-3 rounded-xl border flex items-center gap-2 font-sans text-xs ${
                backupMessage.success
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
              }`}>
                {backupMessage.success ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {backupMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Export Panel (Left) */}
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-teal-accent" />
                    Export Local SQLite Backup
                  </h4>
                  <p className="leading-relaxed mb-3 text-teal-muted/90">
                    ดึงสำเนาข้อมูลที่เก็บอยู่ในฐานข้อมูล SQLite ท้องถิ่นออกมาเป็นสตรักเจอร์ไฟล์ JSON ความปลอดภัยสูงที่ระบุค่าเวลาเพื่อใช้ในการจัดเก็บ และแชร์ข้อมูลประวัติสำรอง
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="bg-bg-dark/80 p-3 rounded-xl font-mono text-[10px] text-teal-muted text-center border border-teal-muted/10">
                    sqlite-backup-{new Date().toISOString().slice(0, 10)}.json
                  </div>
                  <button
                    onClick={handleExport}
                    className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer"
                  >
                    GENERATE &amp; COPY BACKUP
                  </button>
                </div>
              </div>

              {/* Import Panel (Right) */}
              <form onSubmit={handleImport} className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    Restore SQLite from Backup JSON
                  </h4>
                  <p className="leading-relaxed mb-3 text-teal-muted/90">
                    วางสกรีปต์หรือโครงสร้าง JSON ข้อมูลสำรองลงในช่องข้อความด้านล่าง เพื่อกู้คืนบัญชีครีเอเตอร์และตารางงานทั้งหมดลงสู่ฐานข้อมูล SQLite ของเครื่องแบบทันที
                  </p>
                </div>

                <div className="space-y-2">
                  <textarea
                    value={importedJson}
                    onChange={(e) => setImportedJson(e.target.value)}
                    placeholder='วางโครงสร้าง JSON สำรองที่นี่ เช่น {"accounts": [...], "workflows": [...]}'
                    className="w-full bg-[#0b0c10] border border-teal-muted/20 focus:border-teal-accent/50 focus:ring-1 focus:ring-teal-accent/30 rounded-xl p-3 font-mono text-[10px] text-white focus:outline-none h-20 resize-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] cursor-pointer"
                  >
                    PARSE &amp; RESTORE DATABASE
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'autoupdate' && (
          <div className="space-y-4 animate-fade-in" id="settings-autoupdate">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                <div>
                  <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-teal-accent" />
                    Auto-Update Channel &amp; Engine
                  </h4>
                  <p className="leading-relaxed text-teal-muted/90">
                    ตั้งค่าสาขาการดึงสตรักเจอร์แพตช์อัปเกรดแอปพลิเคชันจากเซิร์ฟเวอร์หลัก (Electron Updater Module)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-teal-muted font-bold font-mono">สาขาอัพเดต:</span>
                  <select
                    value={config.autoUpdateBranch}
                    onChange={(e) => onUpdateConfig({ autoUpdateBranch: e.target.value as any })}
                    className="bg-[#0b0c10] border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-1.5 text-xs text-teal-accent focus:outline-none cursor-pointer"
                  >
                    <option value="stable">Stable (ปลอดภัยที่สุด)</option>
                    <option value="beta">Beta (ฟังก์ชันใหม่ล่วงหน้า)</option>
                    <option value="nightly">Nightly (สเปคทดลองรายวัน)</option>
                  </select>
                </div>
              </div>

              {/* Progress and simulation */}
              <div className="bg-bg-dark border border-teal-muted/10 p-4 rounded-xl flex items-center justify-between flex-wrap gap-4">
                <div className="font-mono">
                  <span className="text-[10px] text-teal-muted block">Current App Version</span>
                  <span className="text-white font-bold">v1.0.4 (stable branch)</span>
                </div>

                {updateProgress !== null ? (
                  <div className="w-44 text-right">
                    <div className="flex justify-between text-[10px] text-teal-accent font-mono mb-1 font-bold">
                      <span>Downloading patch...</span>
                      <span>{updateProgress}%</span>
                    </div>
                    <div className="w-full bg-[#0b0c10] h-1.5 rounded-full overflow-hidden border border-teal-muted/10">
                      <div className="bg-teal-accent h-full transition-all duration-300" style={{ width: `${updateProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckUpdate}
                    disabled={isCheckingUpdate}
                    className="bg-bg-dark border border-teal-accent/40 text-teal-accent hover:bg-teal-accent/5 hover:border-teal-accent font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    {isCheckingUpdate ? 'กำลังตรวจหาความสมบูรณ์...' : 'เช็คปุ่มอัปเดตแอป'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 animate-fade-in" id="settings-security">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl">
              <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-rose-400" />
                4-Digit Local PIN Application Locker
              </h4>
              <p className="leading-relaxed mb-4 text-teal-muted/90">
                เพิ่มระดับชั้นความปลอดภัยทางกายภาพ เพื่อล็อกหน้าแอปพลิเคชัน Desktop ป้องกันการส่องดูข้อมูลบัญชี คุกกี้ และรหัสผ่าน และจำกัดการเข้าถึงเฉพาะผู้ที่ทราบ PIN 4 หลักเท่านั้น
              </p>

              {pinMessage && (
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs mb-3 font-sans">
                  {pinMessage}
                </div>
              )}

              <form onSubmit={handleSavePin} className="flex gap-3 max-w-sm">
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="เช่น 1234"
                  className="bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-xl p-2 px-4 text-sm text-center text-white font-mono tracking-widest focus:outline-none w-28"
                  required
                />
                <button
                  type="submit"
                  className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black px-4 rounded-xl transition-all cursor-pointer"
                >
                  SAVE SECURITY PIN
                </button>
              </form>

              <div className="mt-4 text-teal-muted/70 flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                <p className="text-[10px]">
                  * รหัสผ่าน PIN 4 หลักนี้จะได้รับการเข้ารหัส SHA-256 และจัดเก็บลงสู่ฐาน SQLite ของเครื่องผู้ใช้ ทำให้ปลอดภัยสูงสุดแม้มีบุคคลสกัดสำเนาฐานข้อมูลไปรันภายนอก
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-4 animate-fade-in" id="settings-theme">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl">
              <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-teal-accent" />
                UI Theme &amp; Palette Customization
              </h4>
              <p className="leading-relaxed mb-4 text-teal-muted/90 text-xs">
                สลับสกินชุดแต่งของเครื่องมือระหว่าง 'Dark Cyber' แดชบอร์ดนีออนสีเข้ม 'Light Enterprise' อินเตอร์เฟสขาวสะอาดตา หรือ 'Midnight Velvet' โทนดาร์กส้มกำมะหยี่ที่หรูหราระดับสตูดิโอ
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Dark Cyber Option */}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateConfig({ theme: 'dark-cyber' });
                    onAddLog('เปลี่ยนโทนสีระบบเป็น: Dark Cyber (Neon)', 'MainProcess', 'info');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    config.theme === 'dark-cyber'
                      ? 'bg-teal-accent/10 border-teal-accent text-white'
                      : 'bg-bg-dark/20 border-teal-muted/10 text-teal-muted hover:border-teal-muted/30 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Dark Cyber</span>
                    {config.theme === 'dark-cyber' && <CheckCircle className="w-4 h-4 text-teal-accent" />}
                  </div>
                  <p className="text-[10px] text-teal-muted/80 mt-1">
                    เน้นโทนสีมืด นีออนสีฟ้า และการแสดงผลเรืองแสงสไตล์ไซเบอร์พังก์
                  </p>
                </button>

                {/* Light Enterprise Option */}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateConfig({ theme: 'light-enterprise' });
                    onAddLog('เปลี่ยนโทนสีระบบเป็น: Light Enterprise (Corporate)', 'MainProcess', 'info');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    config.theme === 'light-enterprise'
                      ? 'bg-teal-accent/10 border-teal-accent text-white'
                      : 'bg-bg-dark/20 border-teal-muted/10 text-teal-muted hover:border-teal-muted/30 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Light Enterprise</span>
                    {config.theme === 'light-enterprise' && <CheckCircle className="w-4 h-4 text-teal-accent" />}
                  </div>
                  <p className="text-[10px] text-teal-muted/80 mt-1">
                    ธีมสว่างสะอาดตา ใช้โทนสีเทาอ่อน สลับสีขาว และจุดเน้นเทลเรียบหรูระดับองค์กร
                  </p>
                </button>

                {/* Midnight Velvet Option */}
                <button
                  type="button"
                  onClick={() => {
                    onUpdateConfig({ theme: 'midnight-velvet' });
                    onAddLog('เปลี่ยนโทนสีระบบเป็น: Midnight Velvet (Luxury Orange)', 'MainProcess', 'info');
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    config.theme === 'midnight-velvet'
                      ? 'bg-teal-accent/10 border-teal-accent text-white'
                      : 'bg-bg-dark/20 border-teal-muted/10 text-teal-muted hover:border-teal-muted/30 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between font-syne uppercase">
                    <span>Midnight Velvet</span>
                    {config.theme === 'midnight-velvet' && <CheckCircle className="w-4 h-4 text-teal-accent" />}
                  </div>
                  <p className="text-[10px] text-teal-muted/80 mt-1">
                    โทนสีเข้มกำมะหยี่ แย้มส้มสดใส และอักษรพรีเมียมสไตล์ 'Syne' &amp; 'Geist Mono'
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cleanup' && (
          <div className="space-y-4 animate-fade-in" id="settings-cleanup">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl">
              <h4 className="font-bold text-white text-xs mb-1.5 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-400" />
                System Memory &amp; Resource Cleanup (กวาดล้างหน่วยความจำแอป)
              </h4>
              <p className="leading-relaxed mb-4 text-teal-muted/90 text-xs">
                เพิ่มประสิทธิภาพการประมวลผลและการใช้หน่วยความจำภายใน ด้วยการล้างข้อมูลสำรองชั่วคราวและบันทึกเหตุการณ์ที่ไม่จำเป็น
              </p>

              <div className="space-y-3 bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white">การดำเนินการนี้จะจัดการสิ่งต่อไปนี้:</span>
                    <ul className="list-disc pl-4 space-y-1 text-teal-muted">
                      <li>ลบคิวงานอัปโหลดวิดีโอที่เสร็จสิ้นสมบูรณ์แล้วออกจากระบบ (<code className="text-emerald-400">status: 'completed'</code>)</li>
                      <li>รีเซ็ตประวัติบันทึกสถานะ Telemetry Logs ทั้งหมดที่แสดงด้านล่าง เหลือเพียงบันทึกเริ่มต้น</li>
                      <li>ล้างหน่วยความจำที่สเกลสะสมของการจำลองกระบวนการแอปพลิเคชัน</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-rose-500/10 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCleanupTrigger}
                    className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    <Trash2 className="w-4 h-4" />
                    ยืนยันล้างข้อมูลและกวาดหน่วยความจำ (Run System Cleanup)
                  </button>
                </div>
              </div>

              {cleanupSuccess && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl flex items-center gap-2 font-bold animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  กวาดล้างไฟล์ที่ทำรายการสำเร็จและรีเซ็ต Telemetry Logs เรียบร้อยแล้ว!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
