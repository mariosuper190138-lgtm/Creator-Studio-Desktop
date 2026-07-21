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
  Maximize2,
  Sparkles,
  FolderOpen,
  ShoppingBag,
  Workflow,
  Search,
  Globe,
  Undo2,
  Redo2
} from 'lucide-react';
import { CreatorAccount, PublishWorkflow, SystemLog, AppConfig } from './types';
import SRSView from './components/SRSView';
import DBExplorer from './components/DBExplorer';
import APIViewer from './components/APIViewer';
import AccountManager from './components/AccountManager';
import Scheduler from './components/Scheduler';
import AnalyticsPanel from './components/AnalyticsPanel';
import SystemSettings from './components/SystemSettings';
import AIContentSuite from './components/AIContentSuite';
import WorkspaceTab from './components/WorkspaceTab';
import PluginMarketplace from './components/PluginMarketplace';
import DevOpsPanel from './components/DevOpsPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('srs');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  
  // Real-time animated system metrics
  const [cpuUsage, setCpuUsage] = useState<number>(2.4);
  const [ramUsage, setRamUsage] = useState<number>(72.8);

  // Internationalization translation settings
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [commandSearch, setCommandSearch] = useState<string>('');
  
  // Dynamic modular feature flags
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({
    autoBackup: true,
    aiScriptAssist: true,
    advancedMetrics: false,
    proxyRotator: false,
  });

  // Notes state
  const [notesText, setNotesText] = useState<string>(`# แผนงาน Creator Studio\n## รายการสำคัญต้องเช็ควันนี้\n- [ ] สลับกลุ่มเครือข่าย IP บัญชีเทส TikTok\n- [x] ตรวจสอบ Proxy บัญชี tech_guru\n- [ ] เจนสคริปต์วิดีโอใหม่ด้วย Gemini AI\n- [ ] สำรองฐานข้อมูล SQLite เป็นไฟล์ JSON\n\n## คลังไอเดียทำคลิป\n1. วิธีสร้างแบรนด์ตัวตนแบบไร้ต้นทุน\n2. เปิดเบื้องหลังการรันคิวโพสต์ Electron`);

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

  // Undo/Redo state stack
  const [historyStack, setHistoryStack] = useState<Array<{ accounts: CreatorAccount[]; workflows: PublishWorkflow[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

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

  // Initialize history stack with default values
  useEffect(() => {
    if (historyStack.length === 0) {
      setHistoryStack([{ accounts, workflows }]);
      setHistoryIndex(0);
    }
  }, []);

  // Helper to save a structural state snapshot for Undo/Redo
  const saveSnapshot = (nextAccounts: CreatorAccount[], nextWorkflows: PublishWorkflow[]) => {
    setHistoryStack((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const updated = [...sliced, { accounts: nextAccounts, workflows: nextWorkflows }];
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  };

  const triggerUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setAccounts(historyStack[prevIndex].accounts);
      setWorkflows(historyStack[prevIndex].workflows);
      handleAddLog('Undo: ย้อนกลับประวัติการทำงานหลักสำเร็จ', 'SQLiteEngine', 'warn');
    } else {
      handleAddLog('Undo: ไม่มีประวัติการทำงานให้ย้อนกลับแล้ว', 'SQLiteEngine', 'warn');
    }
  };

  const triggerRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setAccounts(historyStack[nextIndex].accounts);
      setWorkflows(historyStack[nextIndex].workflows);
      handleAddLog('Redo: ทำซ้ำขั้นตอนหลักสำเร็จ', 'SQLiteEngine', 'warn');
    } else {
      handleAddLog('Redo: ไม่มีประวัติการทำงานให้ทำซ้ำแล้ว', 'SQLiteEngine', 'warn');
    }
  };

  // Keyboard Shortcuts Listener (Ctrl+K, Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K / Cmd+K opens Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      // Ctrl+Z triggers Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        triggerUndo();
      }
      // Ctrl+Y triggers Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        triggerRedo();
      }
      // Escape closes Command Palette
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyStack, historyIndex, accounts, workflows]);

  // Integrated History state update wrappers
  const handleHistoryAddAccount = (acc: CreatorAccount) => {
    const next = [...accounts, acc];
    setAccounts(next);
    saveSnapshot(next, workflows);
  };

  const handleHistoryUpdateAccount = (id: string, updated: Partial<CreatorAccount>) => {
    const next = accounts.map(a => a.id === id ? { ...a, ...updated } : a);
    setAccounts(next);
    saveSnapshot(next, workflows);
  };

  const handleHistoryDeleteAccount = (id: string) => {
    const nextAccs = accounts.filter(a => a.id !== id);
    const nextWorkflows = workflows.filter(w => w.accountId !== id);
    setAccounts(nextAccs);
    setWorkflows(nextWorkflows);
    saveSnapshot(nextAccs, nextWorkflows);
    handleAddLog(`[CASCADE DELETE] ลบบัญชีผู้ใช้ ID: ${id} และคิวงานที่เกี่ยวข้องออกทั้งหมด`, 'SQLiteEngine', 'warn');
  };

  const handleHistoryAddWorkflow = (wf: PublishWorkflow) => {
    const next = [...workflows, wf];
    setWorkflows(next);
    saveSnapshot(accounts, next);
  };

  const handleHistoryUpdateWorkflow = (id: string, updated: Partial<PublishWorkflow>) => {
    const next = workflows.map(w => w.id === id ? { ...w, ...updated } : w);
    setWorkflows(next);
    // Avoid spamming history with continuous uploading percentage changes
    if (updated.status !== undefined) {
      saveSnapshot(accounts, next);
    }
  };

  const handleHistoryReorderWorkflows = (newList: PublishWorkflow[]) => {
    setWorkflows(newList);
    saveSnapshot(accounts, newList);
  };

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
        <div className="bg-card-dark/70 px-4 py-2.5 border-b border-teal-muted/15 flex flex-col sm:flex-row justify-between items-center gap-3 select-none">
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

          {/* Interactive Global Tools (Search, Undo/Redo, Language) */}
          <div className="flex items-center gap-3.5 text-[10px] font-mono text-teal-muted flex-wrap">
            {/* Undo / Redo */}
            <div className="flex items-center gap-1.5 bg-bg-dark/60 p-1 rounded-lg border border-teal-muted/15">
              <button 
                onClick={triggerUndo}
                className="p-1 hover:text-white hover:bg-teal-accent/5 rounded transition-all cursor-pointer flex items-center gap-1"
                title="ย้อนกลับการทำงาน (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5 text-teal-accent" />
                <span>Undo</span>
              </button>
              <span className="text-teal-muted/20">|</span>
              <button 
                onClick={triggerRedo}
                className="p-1 hover:text-white hover:bg-teal-accent/5 rounded transition-all cursor-pointer flex items-center gap-1"
                title="ทำซ้ำการทำงาน (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Redo</span>
              </button>
            </div>

            {/* Quick Command Search */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="px-2.5 py-1 bg-bg-dark/50 border border-teal-muted/15 rounded-lg flex items-center gap-1.5 hover:border-teal-accent/40 text-teal-accent font-black transition-all cursor-pointer"
              title="ค้นหาด่วนพาสเวิร์ด/คำสั่ง (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-teal-accent" />
              <span>COMMAND PALETTE</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => {
                const nextLang = lang === 'th' ? 'en' : 'th';
                setLang(nextLang);
                handleAddLog(`[LOCALIZATION] ปรับเปลี่ยนภาษาแสดงผลหน้าจอหลักเป็น: [${nextLang.toUpperCase()}]`, 'MainProcess', 'info');
              }}
              className="px-2.5 py-1 bg-teal-accent/5 border border-teal-accent/20 rounded-lg flex items-center gap-1.5 text-teal-accent hover:bg-teal-accent hover:text-bg-dark font-black transition-all cursor-pointer"
              title="สลับภาษา TH / EN"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>LANG: {lang.toUpperCase()}</span>
            </button>

            {/* System Telemetry */}
            <div className="flex items-center gap-3 pl-2 border-l border-teal-muted/15">
              <div className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-teal-accent" />
                <span>CPU: <strong className="text-white">{cpuUsage}%</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>RAM: <strong className="text-white">{ramUsage}MB</strong></span>
              </div>
              <div className="hidden lg:flex items-center gap-1 bg-teal-accent/10 border border-teal-accent/20 rounded-md px-2 py-0.5 text-teal-accent">
                <span>DB: <strong>SQLITE_ONLINE</strong></span>
              </div>
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
                <div className="space-y-1 overflow-y-auto max-h-[480px] pr-1 scrollbar-thin" id="sidebar-menu-tabs">
                  <button
                    onClick={() => setActiveTab('srs')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'srs'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    {lang === 'th' ? '1 & 2. ความต้องการ & สถาปัตยกรรม' : '1 & 2. Requirements & Arch'}
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
                    {lang === 'th' ? '3. โครงสร้าง SQLite Database' : '3. SQLite Schema & Term'}
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
                    {lang === 'th' ? '5. IPC API Preloader' : '5. API & IPC Bridge'}
                  </button>

                  <button
                    onClick={() => setActiveTab('workspace')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'workspace'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <FolderOpen className="w-4 h-4 text-emerald-400" />
                    {lang === 'th' ? '4. โน้ตย่อ & หน้าจอแยก (Workspace)' : '4. Workspace & Split View'}
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
                    {lang === 'th' ? '11. จัดการบัญชีหลัก (Repo)' : '11. Account Manager (Repo)'}
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
                    {lang === 'th' ? '12. คิวโพสต์วิดีโอ (Service)' : '12. Workflow Queue (Serv)'}
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
                    {lang === 'th' ? '13. รายงานความคืบหน้าเรียลไทม์' : '13. Real-Time Analytics'}
                  </button>

                  <button
                    onClick={() => setActiveTab('ai-suite')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'ai-suite'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white animate-pulse-subtle'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {lang === 'th' ? '🤖 15. ชุดตัวช่วยสร้างด้วย AI' : '🤖 15. AI Content Suite'}
                  </button>

                  <button
                    onClick={() => setActiveTab('plugins')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'plugins'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    {lang === 'th' ? '🧩 ตลาดดาวน์โหลดปลั๊กอิน' : '🧩 Plugin Marketplace'}
                  </button>

                  <button
                    onClick={() => setActiveTab('devops')}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      activeTab === 'devops'
                        ? 'bg-teal-accent text-bg-dark shadow-[0_0_10px_rgba(102,252,241,0.15)] font-black'
                        : 'text-teal-muted hover:bg-teal-accent/5 hover:text-white'
                    }`}
                  >
                    <Workflow className="w-4 h-4 text-pink-400" />
                    {lang === 'th' ? '📦 ท่อลำเลียง CI/CD & DevOps' : '📦 DevOps & CI/CD Suite'}
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
                    {lang === 'th' ? '9 & 14. ตั้งค่า & สำรองข้อมูล' : '9 & 14. Configuration & Backup'}
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
                    onAddAccount={handleHistoryAddAccount}
                    onUpdateAccount={handleHistoryUpdateAccount}
                    onDeleteAccount={handleHistoryDeleteAccount}
                    onAddLog={handleAddLog}
                  />
                )}

                {activeTab === 'scheduler' && (
                  <Scheduler
                    workflows={workflows}
                    accounts={accounts}
                    onAddWorkflow={handleHistoryAddWorkflow}
                    onUpdateWorkflow={handleHistoryUpdateWorkflow}
                    onReorderWorkflows={handleHistoryReorderWorkflows}
                    onAddLog={handleAddLog}
                  />
                )}

                {activeTab === 'workspace' && (
                  <WorkspaceTab
                    accounts={accounts}
                    workflows={workflows}
                    notes={notesText}
                    onUpdateNotes={setNotesText}
                    onAddLog={handleAddLog}
                    onAddAccount={handleHistoryAddAccount}
                    onUpdateAccount={handleHistoryUpdateAccount}
                    onDeleteAccount={handleHistoryDeleteAccount}
                    onAddWorkflow={handleHistoryAddWorkflow}
                    onUpdateWorkflow={handleHistoryUpdateWorkflow}
                    onReorderWorkflows={handleHistoryReorderWorkflows}
                  />
                )}

                {activeTab === 'analytics' && <AnalyticsPanel accounts={accounts} />}

                {activeTab === 'ai-suite' && (
                  <AIContentSuite accounts={accounts} onAddLog={handleAddLog} />
                )}

                {activeTab === 'plugins' && (
                  <PluginMarketplace
                    featureFlags={featureFlags}
                    onUpdateFeatureFlags={(nextFlags) => {
                      setFeatureFlags(nextFlags);
                      handleAddLog(`[FEATURE FLAG] ได้รับการอัปเดตชุดธงฟีเจอร์แอปพลิเคชันสำเร็จ`, 'MainProcess', 'info');
                    }}
                    onAddLog={handleAddLog}
                  />
                )}

                {activeTab === 'devops' && (
                  <DevOpsPanel
                    onAddLog={handleAddLog}
                  />
                )}

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

        {/* Command Palette Overlay Modal */}
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-dark/80 backdrop-blur-md">
            <div className="w-full max-w-xl bg-card-dark border border-teal-accent/30 rounded-2xl shadow-[0_0_50px_rgba(102,252,241,0.15)] overflow-hidden flex flex-col">
              {/* Header Search Field */}
              <div className="p-4 border-b border-teal-muted/10 flex items-center gap-3">
                <Search className="w-5 h-5 text-teal-accent" />
                <input
                  type="text"
                  placeholder={lang === 'th' ? 'ค้นหาคำสั่งในระบบ... (Esc เพื่อปิด)' : 'Search commands... (Esc to exit)'}
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-teal-muted/50 text-sm font-sans"
                  autoFocus
                />
                <button
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-teal-muted hover:text-rose-400 font-mono text-[10px] bg-bg-dark px-2 py-1 rounded border border-teal-muted/10"
                >
                  ESC
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
                {[
                  { icon: <Monitor className="w-4 h-4 text-teal-accent" />, labelTh: 'หน้าสถาปัตยกรรม & เอกสารระบบ (SRS View)', labelEn: 'System Architecture & Specs (SRS View)', action: () => setActiveTab('srs') },
                  { icon: <Database className="w-4 h-4 text-indigo-400" />, labelTh: 'ฐานข้อมูล SQLite Explorer', labelEn: 'SQLite Database Explorer', action: () => setActiveTab('db') },
                  { icon: <Cpu className="w-4 h-4 text-emerald-400" />, labelTh: 'คลังเชื่อมต่อ API (IPCRouter Sandbox)', labelEn: 'API & IPC Router Sandbox', action: () => setActiveTab('api') },
                  { icon: <FolderOpen className="w-4 h-4 text-amber-400" />, labelTh: 'เวิร์กสเปซโน้ต & จัดการไฟล์แนบ (Workspace)', labelEn: 'Workspace Notes & Attachments', action: () => setActiveTab('workspace') },
                  { icon: <Users className="w-4 h-4 text-cyan-400" />, labelTh: 'จัดการบัญชีหลัก (Account Repository)', labelEn: 'Account Repository Manager', action: () => setActiveTab('accounts') },
                  { icon: <Calendar className="w-4 h-4 text-pink-400" />, labelTh: 'ตารางงานคิวโพสต์วิดีโอ (Scheduler Service)', labelEn: 'Workflow Queue & Scheduler', action: () => setActiveTab('scheduler') },
                  { icon: <BarChart3 className="w-4 h-4 text-orange-400" />, labelTh: 'รายงานกราฟความคืบหน้าเรียลไทม์ (Analytics)', labelEn: 'Real-Time Performance Analytics', action: () => setActiveTab('analytics') },
                  { icon: <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />, labelTh: 'ระบบปัญญาประดิษฐ์สร้างเนื้อหา (AI Content Suite)', labelEn: 'AI Automated Content Suite', action: () => setActiveTab('ai-suite') },
                  { icon: <ShoppingBag className="w-4 h-4 text-violet-400" />, labelTh: 'ร้านติดตั้งแอปปลั๊กอิน (Plugin Marketplace)', labelEn: 'Plugin & Extension Marketplace', action: () => setActiveTab('plugins') },
                  { icon: <Workflow className="w-4 h-4 text-rose-400" />, labelTh: 'หน้าควบคุม DevOps & CI/CD Pipeline', labelEn: 'DevOps & CI/CD Control Center', action: () => setActiveTab('devops') },
                  { icon: <Settings className="w-4 h-4 text-slate-400" />, labelTh: 'หน้าตั้งค่าระบบสำรองข้อมูล (System Settings)', labelEn: 'System Configuration & Backups', action: () => setActiveTab('settings') },
                  { icon: <Globe className="w-4 h-4 text-sky-400" />, labelTh: `สลับภาษาแอปพลิเคชัน (ปัจจุบัน: ${lang.toUpperCase()})`, labelEn: `Switch Language (Current: ${lang.toUpperCase()})`, action: () => setLang(lang === 'th' ? 'en' : 'th') },
                  { icon: <Lock className="w-4 h-4 text-red-400" />, labelTh: 'ล็อกหน้าจอหลักทันที (Security Lock)', labelEn: 'Lock Dashboard Screen Immediately', action: () => setIsLocked(true) },
                  { icon: <Activity className="w-4 h-4 text-lime-400" />, labelTh: 'ล้างขยะหน่วยความจำ & รวบรวมขยะคอมพิวเตอร์ (System GC)', labelEn: 'Memory Garbage Collection (System GC)', action: () => handleSystemCleanup() },
                ]
                  .filter(cmd => {
                    const term = commandSearch.toLowerCase();
                    return cmd.labelTh.toLowerCase().includes(term) || cmd.labelEn.toLowerCase().includes(term);
                  })
                  .map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cmd.action();
                        setCommandPaletteOpen(false);
                        setCommandSearch('');
                      }}
                      className="w-full text-left p-3 hover:bg-teal-accent/10 rounded-xl flex items-center justify-between transition-all group border border-transparent hover:border-teal-accent/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-bg-dark rounded-lg border border-teal-muted/10 group-hover:border-teal-accent/20">
                          {cmd.icon}
                        </div>
                        <span className="text-xs font-sans text-teal-muted group-hover:text-white transition-colors">
                          {lang === 'th' ? cmd.labelTh : cmd.labelEn}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-teal-muted/40 group-hover:text-teal-accent transition-colors">
                        ENTER ↵
                      </span>
                    </button>
                  ))}

                {[
                  { icon: <Undo2 className="w-4 h-4 text-emerald-400" />, labelTh: 'ย้อนกลับประวัติการทำงาน (Undo - Ctrl+Z)', labelEn: 'Undo State Change (Ctrl+Z)', action: () => triggerUndo() },
                  { icon: <Redo2 className="w-4 h-4 text-emerald-400" />, labelTh: 'ทำซ้ำขั้นตอนถัดไป (Redo - Ctrl+Y)', labelEn: 'Redo State Change (Ctrl+Y)', action: () => triggerRedo() }
                ]
                  .filter(cmd => {
                    const term = commandSearch.toLowerCase();
                    return cmd.labelTh.toLowerCase().includes(term) || cmd.labelEn.toLowerCase().includes(term);
                  })
                  .map((cmd, idx) => (
                    <button
                      key={`hist-${idx}`}
                      onClick={() => {
                        cmd.action();
                        setCommandPaletteOpen(false);
                        setCommandSearch('');
                      }}
                      className="w-full text-left p-3 hover:bg-emerald-400/10 rounded-xl flex items-center justify-between transition-all group border border-transparent hover:border-emerald-400/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-bg-dark rounded-lg border border-teal-muted/10 group-hover:border-emerald-400/20">
                          {cmd.icon}
                        </div>
                        <span className="text-xs font-sans text-teal-muted group-hover:text-white transition-colors">
                          {lang === 'th' ? cmd.labelTh : cmd.labelEn}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-teal-muted/40 group-hover:text-emerald-400 transition-colors">
                        ENTER ↵
                      </span>
                    </button>
                  ))}
              </div>

              {/* Statusbar footer */}
              <div className="p-3 bg-bg-dark border-t border-teal-muted/10 flex justify-between items-center text-[9px] font-mono text-teal-muted select-none">
                <span>PRESS ESC TO CLOSE</span>
                <span>TOTAL SHORTCUTS ACTIVE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
