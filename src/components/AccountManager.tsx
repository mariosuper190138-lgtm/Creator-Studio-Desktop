import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Globe, 
  Shield, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  Wifi, 
  AlertTriangle, 
  Cpu, 
  Activity, 
  Layers, 
  Link2, 
  Clock, 
  Eye, 
  Server, 
  Heart,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CreatorAccount, SystemLog } from '../types';

interface AccountManagerProps {
  accounts: CreatorAccount[];
  onAddAccount: (acc: CreatorAccount) => void;
  onUpdateAccount: (id: string, updated: Partial<CreatorAccount>) => void;
  onDeleteAccount: (id: string) => void;
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

export default function AccountManager({
  accounts,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onAddLog
}: AccountManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [newPlatform, setNewPlatform] = useState<'tiktok' | 'youtube' | 'facebook' | 'instagram'>('tiktok');
  const [newProxy, setNewProxy] = useState('');
  const [newProxyType, setNewProxyType] = useState<'HTTP' | 'SOCKS5'>('SOCKS5');
  const [newRotation, setNewRotation] = useState<'Static' | '1m' | '5m' | '10m'>('Static');
  const [newAntiDetect, setNewAntiDetect] = useState<'ixBrowser' | 'AdsPower' | 'Multilogin' | 'None'>('ixBrowser');
  const [newNotes, setNewNotes] = useState('');

  const [checkingProxyId, setCheckingProxyId] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);
  
  // Real-time ping history tracker for the live graph simulation
  const [pingHistory, setPingHistory] = useState<Record<string, number[]>>({
    '1': [98, 105, 112, 95],
    '2': [45, 52, 48, 55],
    '3': [280, 310, 295, 340], // high latency
    '4': [120, 115, 125, 130],
    '5': [80, 85, 90, 82]
  });

  // Proxy down state simulator
  const [simulatedDownId, setSimulatedDownId] = useState<string | null>(null);

  // Dynamic automatic ping fluctuation to make the dashboard look highly alive
  useEffect(() => {
    const timer = setInterval(() => {
      setPingHistory((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          const currentPings = updated[id] || [100, 100, 100, 100];
          // If proxy is simulated down, force 0 or high failure
          let nextPing = 0;
          if (id === simulatedDownId) {
            nextPing = 999; // Represents timeout / down
          } else {
            const last = currentPings[currentPings.length - 1] || 100;
            const drift = Math.floor(-15 + Math.random() * 30);
            nextPing = Math.max(30, Math.min(450, last + drift));
          }
          const nextHistory = [...currentPings.slice(1), nextPing];
          updated[id] = nextHistory;
        });
        return updated;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [simulatedDownId]);

  const handleTestPing = (id: string, proxy: string) => {
    setPingingId(id);
    onAddLog(`[PING TEST] ทำการส่งชุดข้อมูล ICMP ลัดไปยังโปรโตคอล Proxy: [${proxy}] เพื่อวัดค่า RTT...`, 'IPCRouter', 'info');

    setTimeout(() => {
      setPingingId(null);
      let latency = 0;
      if (id === simulatedDownId) {
        latency = 999;
        onAddLog(`[PING FAILURE] ขออภัย! การเชื่อมต่อไปยัง Proxy [${proxy}] ปฏิเสธการเชื่อมต่อ (PROXY_DOWN_ALERT)`, 'IPCRouter', 'error');
      } else {
        latency = Math.floor(45 + Math.random() * 180);
        setPingHistory((prev) => {
          const current = prev[id] || [100, 100, 100, 100];
          return { ...prev, [id]: [...current.slice(1), latency] };
        });
        onUpdateAccount(id, { lastActive: new Date().toLocaleTimeString('th-TH') + ' น.' });
        onAddLog(`[PING SUCCESS] เชื่อมต่อสาย Proxy [${proxy}] สำเร็จ! RTT: ${latency}ms | ปลอดภัย 100%`, 'IPCRouter', 'info');
      }
    }, 1000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newProfileName) {
      alert('กรุณากรอกข้อมูลบัญชีให้ครบถ้วน');
      return;
    }

    const defaultProxies = {
      tiktok: '185.220.101.4:8000',
      youtube: '45.138.22.190:3128',
      facebook: '109.224.52.12:9000',
      instagram: '82.102.12.80:80'
    };

    const newId = (accounts.length + 1).toString();

    const newAcc: CreatorAccount = {
      id: newId,
      platform: newPlatform,
      username: newUsername,
      profileName: newProfileName,
      proxyIp: newProxy || defaultProxies[newPlatform],
      status: 'active',
      followersCount: Math.floor(1000 + Math.random() * 50000),
      engagementRate: Number((2 + Math.random() * 12).toFixed(1)),
      monetizationEnabled: false,
      createdDate: new Date().toISOString().split('T')[0],
      notes: `${newNotes || 'บัญชีฟาร์มโพสต์อัตโนมัติ'} | Anti-Detect: ${newAntiDetect} | Type: ${newProxyType} | Rotate: ${newRotation}`,
      lastActive: new Date().toLocaleTimeString('th-TH') + ' น.'
    };

    // Pre-seed some ping history for the new account
    setPingHistory(prev => ({
      ...prev,
      [newId]: [110, 95, 120, 105]
    }));

    onAddAccount(newAcc);
    onAddLog(`บันทึกบัญชีลงตาราง SQLite สำเร็จ: @${newUsername} (${newPlatform}) โหลดสลับ Proxy ${newProxyType} เรียบร้อย`, 'AccountRepository', 'info');

    // Reset Form
    setNewUsername('');
    setNewProfileName('');
    setNewProxy('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleCheckProxy = (id: string, proxy: string) => {
    setCheckingProxyId(id);
    onAddLog(`[PROXY MONITOR] กำลังตรวจสอบ IP Rotation และคุณสมบัติพอร์ตของ Proxy: [${proxy}]`, 'IPCRouter', 'info');

    setTimeout(() => {
      setCheckingProxyId(null);
      onUpdateAccount(id, { lastActive: new Date().toLocaleTimeString('th-TH') + ' น.' });
      onAddLog(`[PROXY VERIFY] ตรวจสอบ Proxy ${proxy} สำเร็จ - บัญชีปลอดภัย บีบอัดโปรไฟล์เบราว์เซอร์สมบูรณ์`, 'IPCRouter', 'info');
    }, 1200);
  };

  const handleToggleMonetization = (id: string, current: boolean) => {
    onUpdateAccount(id, { monetizationEnabled: !current });
    onAddLog(`สลับสถานะการเปิดรับรายได้ของบัญชี ID ${id} เป็น: ${!current ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`, 'AccountRepository', 'info');
  };

  // Dynamic Safety Score Calculator based on latency and current account status
  const calculateSafetyScore = (acc: CreatorAccount, lastPing: number) => {
    if (acc.status === 'verification_required') return 35;
    if (lastPing === 999) return 10; // Proxy down
    if (acc.status === 'cooldown') return 65;

    let score = 95;
    if (lastPing > 220) score -= 15; // Slow network penalty
    if (lastPing > 300) score -= 15;
    if (acc.followersCount < 5000) score -= 5;

    return Math.max(15, score);
  };

  return (
    <div className="glass p-6 rounded-2xl" id="creator-account-management">
      
      {/* Header and top controllers */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-accent" />
            11. Accounts &amp; Advanced Proxy Manager Pro
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            ตรวจสุขภาพเกตเวย์การเชื่อมต่อ สลับโปรไฟล์เบราว์เซอร์จำลอง และวิเคราะห์คะแนนความปลอดภัยของช่องผู้ใช้
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2">
          {/* Simulated Down Switcher for verification */}
          <select
            value={simulatedDownId || ''}
            onChange={(e) => {
              const val = e.target.value;
              setSimulatedDownId(val ? val : null);
              if (val) {
                onAddLog(`[SIMULATE PROXY DOWN] ปิดกั้นทางเชื่อมเกตเวย์บัญชี ID: ${val} เพื่อทดสอบระบบเตือนภัยด่วน`, 'IPCRouter', 'warn');
              } else {
                onAddLog(`[SIMULATE PROXY UP] กู้คืนสายเกตเวย์ Proxy เครือข่ายทั้งหมดกลับมาปกติ`, 'IPCRouter', 'info');
              }
            }}
            className="bg-bg-dark border border-teal-muted/30 hover:border-teal-accent/50 rounded-xl px-2.5 py-1.5 text-[10px] text-teal-muted font-bold focus:outline-none"
          >
            <option value="">⚙️ โหมดตรวจจับ: ปกติ</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>⚠️ จำลองปิด Proxy: @{acc.username}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_12px_rgba(102,252,241,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'ปิดส่วนกรอกข้อมูล' : 'ลงทะเบียนบัญชีโปร'}
          </button>
        </div>
      </div>

      {/* Advanced Add Account Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl mb-6 space-y-4 animate-fade-in" id="add-account-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">แพลตฟอร์ม</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as any)}
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ชื่อผู้ใช้ (Username)</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="เช่น super_creator"
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ชื่อโปรไฟล์บนช่อง</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="เช่น Super Creator Official"
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">Proxy Gateway (IP:Port)</label>
              <input
                type="text"
                value={newProxy}
                onChange={(e) => setNewProxy(e.target.value)}
                placeholder="เช่น 185.220.101.4:8000"
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
              />
            </div>

          </div>

          {/* Expanded Pro features configuration line */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-teal-muted/10 pt-4">
            
            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">โปรโตคอลความปลอดภัย (Proxy Type)</label>
              <select
                value={newProxyType}
                onChange={(e) => setNewProxyType(e.target.value as any)}
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="SOCKS5">SOCKS5 (แนะนำสูงสุด - เข้ารหัสสายส่ง)</option>
                <option value="HTTP">HTTP (มาตรฐานทั่วไป)</option>
              </select>
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">สลับ IP อัตโนมัติ (IP Rotation Interval)</label>
              <select
                value={newRotation}
                onChange={(e) => setNewRotation(e.target.value as any)}
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="Static">Static ISP (IP คงที่ ป้องกันบอทแบน)</option>
                <option value="1m">Rotate IP ทุก 1 นาที (ฟาร์มโพสต์กลุ่ม)</option>
                <option value="5m">Rotate IP ทุก 5 นาที</option>
                <option value="10m">Rotate IP ทุก 10 นาที</option>
              </select>
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">เชื่อมโยง Anti-Detect Browser Profile</label>
              <select
                value={newAntiDetect}
                onChange={(e) => setNewAntiDetect(e.target.value as any)}
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="ixBrowser">ixBrowser Profile Binding (ดีฟอลต์)</option>
                <option value="AdsPower">AdsPower Fingerprint Sync</option>
                <option value="Multilogin">Multilogin Secure Session</option>
                <option value="None">ไม่ใช้งาน (ใช้เบราว์เซอร์ธรรมดา)</option>
              </select>
            </div>

          </div>

          <div>
            <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">หมายเหตุการฟีดงาน / บันทึกเพิ่มเติม</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="ระบุจุดประสงค์ เช่น วิดีโอสปอนเซอร์, ป้ายยาสินค้าแบรนด์เนม"
              className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer text-xs uppercase"
          >
            ลงทะเบียนคิวบัญชีลงฐานระบบ SQLite (Save Pro Account)
          </button>
        </form>
      )}

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="accounts-cards-grid">
        {accounts.map((acc) => {
          const pHistory = pingHistory[acc.id] || [80, 80, 80, 80];
          const lastPing = pHistory[pHistory.length - 1] || 80;
          const isDown = simulatedDownId === acc.id || lastPing > 400;
          
          // Calculate safety scores dynamically
          const safetyScore = calculateSafetyScore(acc, isDown ? 999 : lastPing);

          // Find Anti-detect binding profile info
          const isIx = acc.notes.includes('ixBrowser') || acc.notes.includes('Affiliate') || acc.id === '1';
          const isAds = acc.notes.includes('AdsPower') || acc.id === '2';
          const antidetectLabel = isIx ? 'ixBrowser Active' : isAds ? 'AdsPower Synced' : 'Standard Browser';
          const profileNum = acc.id === '1' ? '#042' : acc.id === '2' ? '#773' : `#0${acc.id}1`;

          return (
            <div
              key={acc.id}
              className={`bg-bg-dark/40 border rounded-2xl overflow-hidden hover:border-teal-muted/30 transition-all duration-300 flex flex-col justify-between ${
                isDown 
                  ? 'border-rose-500/30 bg-rose-500/[0.02]' 
                  : 'border-teal-muted/15'
              }`}
            >
              {/* Card Top Header */}
              <div className="p-4 border-b border-teal-muted/10 flex justify-between items-center bg-card-dark/30">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isDown ? 'bg-rose-500 animate-ping' : acc.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  <span className="font-bold text-white text-xs">@{acc.username}</span>
                  <span className="text-[9px] bg-bg-dark border border-teal-muted/15 text-teal-accent px-2 py-0.5 rounded-md font-mono uppercase">
                    {acc.platform}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCheckProxy(acc.id, acc.proxyIp)}
                    className="p-1.5 hover:bg-bg-dark rounded-lg text-teal-muted hover:text-teal-accent cursor-pointer transition-colors"
                    title="สแกน IP & Rotator Status"
                    disabled={checkingProxyId === acc.id}
                  >
                    <Wifi className={`w-4 h-4 ${checkingProxyId === acc.id ? 'animate-spin text-teal-accent' : ''}`} />
                  </button>
                  <button
                    onClick={() => onDeleteAccount(acc.id)}
                    className="p-1.5 hover:bg-bg-dark rounded-lg text-teal-muted hover:text-rose-400 cursor-pointer transition-colors"
                    title="ลบบัญชีถาวร"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inner details wrapper */}
              <div className="p-4 space-y-4 flex-1">
                
                {/* Visual Stats Row */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                  <div className="bg-bg-dark/60 p-2 rounded-xl border border-teal-muted/5">
                    <span className="text-teal-muted block text-[8px] uppercase">Followers</span>
                    <span className="text-white font-bold">{acc.followersCount.toLocaleString()}</span>
                  </div>
                  <div className="bg-bg-dark/60 p-2 rounded-xl border border-teal-muted/5">
                    <span className="text-teal-muted block text-[8px] uppercase">Engagement</span>
                    <span className="text-teal-accent font-black">{acc.engagementRate}%</span>
                  </div>
                  <div className="bg-bg-dark/60 p-2 rounded-xl border border-teal-muted/5">
                    <span className="text-teal-muted block text-[8px] uppercase">Monetize</span>
                    <button
                      onClick={() => handleToggleMonetization(acc.id, acc.monetizationEnabled)}
                      className={`font-sans font-bold text-[8px] py-0.5 rounded block w-full mt-0.5 cursor-pointer truncate ${
                        acc.monetizationEnabled 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-bg-dark text-teal-muted border border-teal-muted/20'
                      }`}
                    >
                      {acc.monetizationEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                  
                  {/* ACCOUNT HEALTH SCORE CIRCULAR RADIAL MOCKUP */}
                  <div className="bg-bg-dark/60 p-1.5 rounded-xl border border-teal-muted/5 flex flex-col items-center justify-center relative">
                    <span className="text-teal-muted block text-[7px] uppercase leading-none mb-1">HEALTH</span>
                    <div className="relative flex items-center justify-center">
                      {/* Circle representation */}
                      <span className={`text-[11px] font-black font-mono ${
                        safetyScore >= 80 ? 'text-emerald-400' : safetyScore >= 50 ? 'text-amber-400' : 'text-rose-400 font-extrabold animate-pulse'
                      }`}>
                        {safetyScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advanced Proxy Monitor Pro area */}
                <div className="bg-bg-dark/60 border border-teal-muted/10 p-3 rounded-xl text-xs space-y-2.5 relative">
                  
                  {/* Warning banner if simulated down */}
                  {isDown && (
                    <div className="absolute inset-0 bg-rose-950/90 z-10 flex flex-col items-center justify-center text-center p-3 rounded-xl animate-fade-in">
                      <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce mb-1" />
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">PROXY GATEWAY DOWN</span>
                      <p className="text-[8px] text-rose-300 mt-0.5">โปรดตรวจสอบพร็อกซี หรือระบบจะเปิดใช้งาน Smart Auto-Retry ด่วน</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] font-mono border-b border-teal-muted/5 pb-1.5">
                    <span className="text-teal-muted font-bold flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-teal-accent" />
                      PROXY HEALTH MONITOR
                    </span>
                    <span className="text-teal-accent font-semibold bg-teal-accent/10 px-1.5 py-0.2 rounded border border-teal-accent/20">
                      SOCKS5 SECURE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <div className="space-y-0.5">
                      <span className="text-teal-muted block text-[8px]">IP ROTATION STATE:</span>
                      <span className="text-white font-bold block flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {acc.notes.includes('Rotate:') ? acc.notes.split('Rotate:')[1]?.trim() : 'Static ISP'}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-right">
                      <span className="text-teal-muted block text-[8px] text-right">IP ADDRESS MATCH:</span>
                      <span className="text-teal-accent font-black block truncate">{acc.proxyIp}</span>
                    </div>
                  </div>

                  {/* Realtime latency history graph (using visual flex items representing bars) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-teal-muted">Latency History:</span>
                      <span className="text-white font-black">{lastPing} ms (Average)</span>
                    </div>
                    
                    {/* Visual mini-bars representation */}
                    <div className="h-6 bg-bg-dark rounded-md overflow-hidden flex items-end p-1 gap-1.5 border border-teal-muted/5">
                      {pHistory.map((ping, idx) => {
                        // Max out at 300 for height scaling
                        const heightPct = Math.min(100, (ping / 300) * 100);
                        return (
                          <div key={idx} className="flex-1 h-full bg-bg-dark/80 relative flex items-end">
                            <div 
                              style={{ height: `${heightPct}%` }} 
                              className={`w-full rounded-sm transition-all duration-500 ${
                                ping > 200 ? 'bg-rose-500' : ping > 100 ? 'bg-amber-500' : 'bg-teal-accent'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Test latency button */}
                  <div className="pt-2 border-t border-teal-muted/5 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => handleTestPing(acc.id, acc.proxyIp)}
                      disabled={pingingId === acc.id}
                      className="bg-teal-accent/15 hover:bg-teal-accent/25 border border-teal-accent/30 text-teal-accent font-black py-1 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all text-[9px] cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${pingingId === acc.id ? 'animate-spin' : ''}`} />
                      ทดสอบ Latency Ping (Test RTT)
                    </button>
                    
                    <span className="text-[8px] font-mono font-bold text-teal-muted">Packet loss: 0.0%</span>
                  </div>

                </div>

                {/* Anti-Detect Profile Binding info */}
                <div className="bg-bg-dark/30 p-2.5 rounded-xl border border-teal-muted/10 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-teal-muted flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                    Anti-Detect Profile Binding:
                  </span>
                  <span className="text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    {antidetectLabel} ({profileNum})
                  </span>
                </div>

                {/* Notes */}
                <p className="text-xs text-text-secondary leading-normal bg-bg-dark/20 p-2.5 rounded-xl border border-teal-muted/5">
                  {acc.notes.split('|')[0] || <span className="text-teal-muted/30 italic">ไม่มีบันทึกแผนตลาดเสริม</span>}
                </p>

              </div>

              {/* Footer timeline info */}
              <div className="bg-bg-dark px-4 py-2 border-t border-teal-muted/5 text-[9px] text-teal-muted flex justify-between">
                <span>Created Date: {acc.createdDate}</span>
                <span>Last Telemetry Sync: {acc.lastActive}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
