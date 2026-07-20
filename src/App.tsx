import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Cpu, 
  Database, 
  Terminal, 
  Layers, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell, 
  Lock, 
  HelpCircle,
  FileCode,
  HardDrive,
  CheckCircle,
  Activity,
  Maximize2
} from 'lucide-react';
import { CreatorAccount, PublishWorkflow, SystemLog, AppConfig } from './types';
import SRSView from './components/SRSView';
import DBExplorer from './components/DBExplorer';
import APIViewer from './components/APIViewer';
import AccountManager from './components/AccountManager';
import Scheduler from './components/Scheduler';
import AnalyticsPanel from './components/AnalyticsPanel';
import SystemSettings from './components/SystemSettings';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('srs');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  
  // Real-time animated system metrics
  const [cpuUsage, setCpuUsage] = useState<number>(2.4);
  const [ramUsage, setRamUsage] = useState<number>(72.8);

  // Core Simulated SQLite database tables (Single source of truth)
  const [accounts, setAccounts] = useState<CreatorAccount[]>([
    { id: '1', platform: 'tiktok', username: 'tech_guru', profileName: 'TechGuru TH', proxyIp: '185.220.101.4:8000', status: 'active', followersCount: 24500, engagementRate: 8.4, monetizationEnabled: true, createdDate: '2026-07-15', notes: 'เน้นวิดีโอแกะกล่องแก็ดเจ็ต รีวิวสมาร์ทโฟนระดับบน', lastActive: '10:24 น.' },
    { id: '2', platform: 'youtube', username: 'cooking_co', profileName: 'Cooking Companion', proxyIp: '45.138.22.190:3128', status: 'active', followersCount: 128000, engagementRate: 12.1, monetizationEnabled: true, createdDate: '2026-07-16', notes: 'วิดีโอสอนทำอาหารเมนูประหยัด เจาะกลุ่มเด็กหอและวัยทำงาน', lastActive: '11:15 น.' },
    { id: '3', platform: 'tiktok', username: 'vlog_queen', profileName: 'Vlog Queen TH', proxyIp: '194.26.135.12:8800', status: 'verification_required', followersCount: 8900, engagementRate: 5.2, monetizationEnabled: false, createdDate: '2026-07-17', notes: 'คอนเทนต์พาเที่ยวคาเฟ่แนวสโลว์ไลฟ์ พิกัดรถไฟฟ้าสายสีเขียว', lastActive: '14:02 น.' },
    { id: '4', platform: 'facebook', username: 'news_feed_th', profileName: 'NewsFeed Thailand', proxyIp: '109.224.52.12:9000', status: 'active', followersCount: 4500, engagementRate: 3.1, monetizationEnabled: false, createdDate: '2026-07-18', notes: 'พาดหัวสรุปข่าวสาร ประเด็นร้อนรอบสัปดาห์ในทวิตเตอร์', lastActive: '09:45 น.' },
    { id: '5', platform: 'instagram', username: 'photo_diary', profileName: 'PhotoDiary Official', proxyIp: '82.102.12.80:80', status: 'cooldown', followersCount: 56000, engagementRate: 6.8, monetizationEnabled: true, createdDate: '2026-07-19', notes: 'คลังรูปภาพแนวคุมโทนพอร์เทรต ฟิลเตอร์วินเทจเกาหลี', lastActive: '16:30 น.' }
  ]);

  const [workflows, setWorkflows] = useState<PublishWorkflow[]>([
    { id: '101', title: 'แกะกล่องมือถือเรือธงปี 2026', accountId: '1', platform: 'tiktok', contentType: 'video', scheduledTime: '2026-07-21 18:00:00', status: 'queued', progress: 0, videoPath: '/Media/renders/tiktok_review_1.mp4', description: 'รีวิวเปิดตัวสินค้าใหม่ล่าสุด #affiliate' },
    { id: '102', title: '5 วิธีต้มไข่ออนเซ็นให้ไข่แดงเยิ้ม', accountId: '2', platform: 'youtube', contentType: 'short_video', scheduledTime: '2026-07-20 20:30:00', status: 'running', progress: 45, videoPath: '/Media/renders/cooking_shorts_22.mp4', description: 'สูตรลับต้มไข่เยิ้มๆ ทานง่าย อร่อยฟิน' },
    { id: '103', title: 'พาเที่ยวคาเฟ่ลับย่านอารีย์', accountId: '3', platform: 'tiktok', contentType: 'video', scheduledTime: '2026-07-20 15:00:00', status: 'completed', progress: 100, videoPath: '/Media/renders/vlog_cafe_secret.mp4', description: 'พาเที่ยวคาเฟ่แนววินเทจ ย่านอารีย์ซอย 4' },
    { id: '104', title: 'ด่วน! สรุปมาตรการกระตุ้นเศรษฐกิจใหม่', accountId: '4', platform: 'facebook', contentType: 'image_post', scheduledTime: '2026-07-21 12:00:00', status: 'queued', progress: 0, videoPath: '/Media/renders/infographics_news_7.png', description: 'สรุปครบถ้วนทุกมาตรการสำคัญกระตุ้นปากท้อง' }
  ]);

  const [config, setConfig] = useState<AppConfig>({
    theme: 'dark-cyber',
    localDbPath: './database/creator_studio.db',
    autoUpdateBranch: 'stable',
    isBackupEnabled: true,
    securityPin: '1234',
    apiToken: 'cs_tok_5569420x_key'
  });

  // System Logs
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: 'l1', timestamp: '07:45:10', level: 'info', source: 'MainProcess', message: 'กำลังเตรียมระบบสำหรับ Electron Container Runtime...' },
    { id: 'l2', timestamp: '07:45:11', level: 'info', source: 'SQLiteEngine', message: 'ตรวจสอบพบโมดูล SQLite3 ท้องถิ่น: เชื่อมต่อสำเร็จ (v3.42.0)' },
    { id: 'l3', timestamp: '07:45:11', level: 'info', source: 'IPCRouter', message: 'ลงทะเบียนช่องทางสื่อสาร Preload API Bridge เรียบร้อย' },
    { id: 'l4', timestamp: '07:45:12', level: 'info', source: 'SchedulerService', message: 'ตัวจับตารางเวลาเบื้องหลัง (Priority Queue Daemon) เริ่มทำงาน' },
    { id: 'l5', timestamp: '07:45:12', level: 'info', source: 'MainProcess', message: 'สถาปัตยกรรม Clean Architecture ของตัวเครื่องโหลดเสร็จสมบูรณ์' }
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Dynamic system performance fluctuation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(Number((1.5 + Math.random() * 1.8).toFixed(1)));
      setRamUsage(Number((71.5 + Math.random() * 2.2).toFixed(1)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Scroll logs to bottom when updated
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Handle adding live logs
  const handleAddLog = (message: string, source: SystemLog['source'], level: SystemLog['level']) => {
    const time = new Date().toTimeString().split(' ')[0];
    const newLog: SystemLog = {
      id: 'l-' + Math.random().toString(),
      timestamp: time,
      level,
      source,
      message
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Lock logic
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === config.securityPin) {
      setIsLocked(false);
      setPinInput('');
      setPinError('');
      handleAddLog('ปลดล็อกความปลอดภัยหน้าจอสำรวจเสร็จสิ้น', 'MainProcess', 'info');
    } else {
      setPinError('รหัส PIN 4 หลักไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  // Export & Import Database states as JSON
  const handleExportDatabase = () => {
    const data = {
      version: '1.0.4',
      config,
      accounts,
      workflows
    };
    return JSON.stringify(data, null, 2);
  };

  const handleImportDatabase = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.accounts && Array.isArray(parsed.accounts) && parsed.workflows && Array.isArray(parsed.workflows)) {
        setAccounts(parsed.accounts);
        setWorkflows(parsed.workflows);
        if (parsed.config) setConfig(parsed.config);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const handleSystemCleanup = () => {
    // 1. Clear completed workflows
    setWorkflows((prev) => prev.filter((w) => w.status !== 'completed'));

    // 2. Reset telemetry logs to a single clean indicator message
    const time = new Date().toLocaleTimeString('th-TH');
    setLogs([
      {
        id: 'log-clean-' + Date.now(),
        timestamp: time,
        level: 'info',
        source: 'MainProcess',
        message: '=== ได้ทำการล้างข้อมูลบันทึกความจำย้อนหลัง (System Log Memory Cleared) และเคลียร์งานเสร็จสิ้นเรียบร้อยเพื่อประหยัดหน่วยความจำ ==='
      }
    ]);
  };

  const themeClass = config.theme === 'light-enterprise'
    ? 'light-enterprise bg-[#f1f5f9]'
    : config.theme === 'midnight-velvet'
    ? 'midnight-velvet bg-[#0c0c0e]'
    : 'bg-[#0b0c10]';

  return (
    <div className={`min-h-screen ${themeClass} text-text-primary font-sans p-4 flex items-center justify-center selection:bg-teal-accent selection:text-bg-dark transition-colors duration-300`}>
      {/* Mock Desktop Frame Container */}
      <div className="w-full max-w-[1300px] bg-card-dark rounded-2xl border border-teal-muted/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col h-[850px] relative">
        
        {/* Mock Electron Titlebar */}
        <div className="bg-card-dark/70 px-4 py-2.5 border-b border-teal-muted/15 flex justify-between items-center select-none">
          <div className="flex items-center gap-2">
            {/* Window buttons */}
            <div className="flex gap-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 block hover:bg-rose-600 transition-colors cursor-pointer" onClick={() => handleAddLog('พยายามจำลองปิดตัวแอปพลิเคชัน Desktop', 'MainProcess', 'warn')} />
              <span className="w-3 h-3 rounded-full bg-amber-500 block hover:bg-amber-600 transition-colors cursor-pointer" onClick={() => setIsLocked(true)} title="ล็อกหน้าจอแอป" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 block hover:bg-emerald-600 transition-colors cursor-pointer" />
            </div>
            <Monitor className="w-4 h-4 text-teal-accent" />
            <span className="font-mono text-[10px] text-teal-muted font-bold tracking-wider">
              CREATOR_DESKTOP_SUITE.EXE — PRODUCTION DEVELOPMENT FRAMEWORK [PHASE 1]
            </span>
          </div>

          {/* System Telemetry (Not cluttering outer background, contained logically in the titlebar) */}
          <div className="flex items-center gap-4 text-[10px] font-mono text-teal-muted">
            <div className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-teal-accent" />
              <span>CPU: <strong className="text-white">{cpuUsage}%</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>RAM: <strong className="text-white">{ramUsage}MB</strong></span>
            </div>
            <div className="flex items-center gap-1 bg-teal-accent/10 border border-teal-accent/20 rounded-md px-2 py-0.5 text-teal-accent">
              <span>DB STATUS: <strong className="text-white">SQLITE_ONLINE</strong></span>
            </div>
          </div>
        </div>

        {/* Lock Screen overlay */}
        {isLocked ? (
          <div className="absolute inset-0 bg-bg-dark/95 z-50 flex items-center justify-center animate-fade-in" id="security-lock-overlay">
            <form onSubmit={handleUnlock} className="bg-bg-dark border border-teal-muted/15 p-8 rounded-2xl text-center space-y-4 max-w-sm w-full shadow-2xl">
              <Lock className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
              <div>
                <h4 className="text-white font-bold text-base">แอปพลิเคชันถูกล็อกความปลอดภัย</h4>
                <p className="text-xs text-teal-muted mt-1">กรุณากรอกรหัส PIN ความปลอดภัย 4 หลักเพื่อเข้าสู่พื้นที่บริหารงานครีเอเตอร์</p>
              </div>

              {pinError && (
                <p className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 font-semibold">{pinError}</p>
              )}

              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="PIN 4 หลัก (ดีฟอลต์: 1234)"
                className="bg-bg-dark border border-teal-muted/30 focus:border-teal-accent focus:ring-1 focus:ring-teal-accent rounded-xl p-2.5 text-center text-white text-lg tracking-widest font-mono focus:outline-none w-48"
                autoFocus
                required
              />

              <button
                type="submit"
                className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer"
              >
                ปลดล็อกหน้าจอแอป
              </button>
            </form>
          </div>
        ) : (
          /* Main Workspace split: Left Sidebar + Right Content Area */
          <div className="flex flex-1 overflow-hidden">
            
            {/* Left Sidebar Menu */}
            <div className="w-64 bg-card-dark/30 border-r border-teal-muted/15 flex flex-col justify-between p-4 shrink-0">
              <div className="space-y-4">
                <div className="px-2 pb-2 border-b border-teal-muted/10">
                  <span className="text-[10px] text-teal-muted font-bold block tracking-widest uppercase font-mono">Clean Architecture</span>
                  <p className="text-xs text-white font-black mt-1">Enterprise Creator Suite</p>
                </div>

                {/* Sidebar Navigation Options */}
                <div className="space-y-1" id="sidebar-menu-tabs">
                  <button
                    onClick={() => setActiveTab('srs')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'srs'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    1 &amp; 2. Requirements &amp; Arch
                  </button>

                  <button
                    onClick={() => setActiveTab('db')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'db'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    3. SQLite Schema &amp; Term
                  </button>

                  <button
                    onClick={() => setActiveTab('api')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'api'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    5. API &amp; IPC Bridge
                  </button>

                  <button
                    onClick={() => setActiveTab('accounts')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'accounts'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    11. Account Manager (Repo)
                  </button>

                  <button
                    onClick={() => setActiveTab('scheduler')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'scheduler'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    12. Workflow Queue (Serv)
                  </button>

                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'analytics'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    13. Real-Time Analytics
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    9 &amp; 14. Configuration &amp; Backup
                  </button>
                </div>
              </div>

              {/* Sidebar bottom block */}
              <div className="border-t border-teal-muted/10 pt-3 space-y-2">
                <div className="bg-bg-dark p-2.5 rounded-xl border border-teal-muted/5 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-teal-accent" />
                  <div className="font-mono text-[9px]">
                    <span className="text-teal-muted block">SQLITE LOCATION</span>
                    <span className="text-white font-bold truncate block max-w-[170px]">{config.localDbPath}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-1 text-[9px] text-teal-muted">
                  <span>SYSTEM PHASE: <strong>1 (CORE)</strong></span>
                  <span className="animate-pulse text-emerald-400">● LIVE RUNNING</span>
                </div>
              </div>
            </div>

            {/* Right Scrollable Content Area */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden bg-bg-dark/15">
              
              {/* Dynamic Component Viewer Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Showcase Phase Goal Banner */}
                <div className="bg-gradient-to-r from-teal-accent/10 to-indigo-500/5 border border-teal-accent/20 p-6 rounded-2xl flex flex-col md:flex-row items-start gap-4 relative overflow-hidden">
                  <div className="absolute right-4 top-2 text-[60px] font-syne text-white/5 select-none font-black tracking-tighter leading-none">CREATOR</div>
                  <div className="bg-teal-accent/10 text-teal-accent p-3 rounded-xl border border-teal-accent/15 shrink-0">
                    <FileCode className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h1 className="font-syne font-black text-2xl md:text-3xl text-white tracking-tight leading-none uppercase mb-2">
                      CREATOR<span className="text-teal-accent">_</span>DESKTOP SUITE
                    </h1>
                    <p className="text-xs md:text-sm text-teal-muted leading-relaxed font-sans max-w-4xl">
                      สถาปัตยกรรมระดับครีเอเตอร์โมเดล ระบบได้ลงทะเบียนการจัดการบัญชี (Account Repository), ดาต้าเบสสัญญะ SQLite Engine ในตัว และคิวกำหนดตารางเวลา (Scheduler Service Layer) เพื่อรองรับการสลับ Dynamic IP บน Electron Desktop สำเร็จ พร้อมรายงานกราฟความคืบหน้าแบบเรียลไทม์
                    </p>
                  </div>
                </div>

                {/* Render Selected View */}
                {activeTab === 'srs' && <SRSView />}
                {activeTab === 'db' && <DBExplorer onAddLog={handleAddLog} />}
                {activeTab === 'api' && <APIViewer onAddLog={handleAddLog} />}
                
                {activeTab === 'accounts' && (
                  <AccountManager
                    accounts={accounts}
                    onAddAccount={(acc) => setAccounts((prev) => [...prev, acc])}
                    onUpdateAccount={(id, updated) => setAccounts((prev) => prev.map(a => a.id === id ? { ...a, ...updated } : a))}
                    onDeleteAccount={(id) => {
                      setAccounts((prev) => prev.filter(a => a.id !== id));
                      setWorkflows((prev) => prev.filter(w => w.accountId !== id)); // Cascade Deletion Simulation!
                      handleAddLog(`[CASCADE DELETE] ลบบัญชีผู้ใช้ ID: ${id} และคิวงานที่เกี่ยวข้องออกทั้งหมด`, 'SQLiteEngine', 'warn');
                    }}
                    onAddLog={handleAddLog}
                  />
                )}

                {activeTab === 'scheduler' && (
                  <Scheduler
                    workflows={workflows}
                    accounts={accounts}
                    onAddWorkflow={(wf) => setWorkflows((prev) => [...prev, wf])}
                    onUpdateWorkflow={(id, updated) => setWorkflows((prev) => prev.map(w => w.id === id ? { ...w, ...updated } : w))}
                    onAddLog={handleAddLog}
                  />
                )}

                {activeTab === 'analytics' && <AnalyticsPanel accounts={accounts} />}

                {activeTab === 'settings' && (
                  <SystemSettings
                    config={config}
                    onUpdateConfig={(updated) => setConfig((prev) => ({ ...prev, ...updated }))}
                    onExportData={handleExportDatabase}
                    onImportData={handleImportDatabase}
                    onAddLog={handleAddLog}
                    onSystemCleanup={handleSystemCleanup}
                  />
                )}
              </div>

              {/* Bottom Scrolling System Logs Panel (Main + SQLite Router Telemetry) */}
              <div className="bg-bg-dark border-t border-teal-muted/15 h-36 flex flex-col shrink-0">
                <div className="bg-card-dark/50 px-4 py-1.5 border-b border-teal-muted/15 flex justify-between items-center text-[9px] font-mono select-none">
                  <span className="text-teal-accent font-black flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5 text-teal-accent" />
                    LIVE TELEMETRY LOGS (CLEAN ARCHITECTURE PIPELINE)
                  </span>
                  <span className="text-teal-muted">Auto-scrolling online</span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1 bg-bg-dark/40">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 leading-relaxed">
                      <span className="text-teal-muted/60">[{log.timestamp}]</span>
                      <span className={`font-bold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded shrink-0 font-sans border ${
                        log.level === 'error'
                          ? 'bg-rose-500/15 border-rose-500/20 text-rose-400'
                          : log.level === 'warn'
                          ? 'bg-amber-500/15 border-amber-500/20 text-amber-400'
                          : 'bg-teal-accent/15 border-teal-accent/20 text-teal-accent'
                      }`}>
                        {log.source}
                      </span>
                      <span className={log.level === 'error' ? 'text-rose-400 font-semibold' : log.level === 'warn' ? 'text-amber-400' : 'text-text-primary'}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
