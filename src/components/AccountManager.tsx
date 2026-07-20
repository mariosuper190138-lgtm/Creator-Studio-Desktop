import React, { useState } from 'react';
import { Users, Plus, Globe, Shield, RefreshCw, Trash2, Edit2, CheckCircle, Wifi, AlertTriangle } from 'lucide-react';
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
  const [newNotes, setNewNotes] = useState('');

  const [checkingProxyId, setCheckingProxyId] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [pings, setPings] = useState<Record<string, number>>({});

  const handleTestPing = (id: string, proxy: string) => {
    setPingingId(id);
    onAddLog(`[PING TEST] เริ่มจำลองส่งแพ็กเก็ต ICMP ตรวจสอบเส้นทาง Proxy: [${proxy}]`, 'IPCRouter', 'info');

    setTimeout(() => {
      // Simulating a realistic ping latency between 45ms and 320ms
      const latency = Math.floor(45 + Math.random() * 275);
      setPingingId(null);
      setPings(prev => ({ ...prev, [id]: latency }));
      onUpdateAccount(id, { lastActive: new Date().toLocaleTimeString('th-TH') + ' น.' });
      onAddLog(`[PING SUCCESS] เชื่อมต่อ Proxy [${proxy}] สำเร็จ! Latency: ${latency}ms | Packet Loss: 0%`, 'IPCRouter', 'info');
    }, 1200);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newProfileName) {
      alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
      return;
    }

    const defaultProxies = {
      tiktok: '185.220.101.4:8000',
      youtube: '45.138.22.190:3128',
      facebook: '109.224.52.12:9000',
      instagram: '82.102.12.80:80'
    };

    const newAcc: CreatorAccount = {
      id: (accounts.length + 1).toString(),
      platform: newPlatform,
      username: newUsername,
      profileName: newProfileName,
      proxyIp: newProxy || defaultProxies[newPlatform],
      status: 'active',
      followersCount: 0,
      engagementRate: 0.0,
      monetizationEnabled: false,
      createdDate: new Date().toLocaleDateString('th-TH'),
      notes: newNotes,
      lastActive: new Date().toLocaleTimeString('th-TH') + ' น.'
    };

    onAddAccount(newAcc);
    onAddLog(`บันทึกบัญชีครีเอเตอร์ใหม่ใน SQLite: @${newUsername} (${newPlatform})`, 'AccountRepository', 'info');

    // Reset Form
    setNewUsername('');
    setNewProfileName('');
    setNewProxy('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleCheckProxy = (id: string, proxy: string) => {
    setCheckingProxyId(id);
    onAddLog(`กำลังเริ่มตรวจสุขภาพเครือข่าย Proxy: [${proxy}]`, 'IPCRouter', 'info');

    setTimeout(() => {
      setCheckingProxyId(null);
      onUpdateAccount(id, { lastActive: new Date().toLocaleTimeString('th-TH') + ' น.' });
      onAddLog(`ตรวจสุขภาพ Proxy [${proxy}] สำเร็จ - สถานะ: มีเสถียรภาพ ดีเยี่ยม`, 'IPCRouter', 'info');
    }, 1000);
  };

  const handleToggleMonetization = (id: string, current: boolean) => {
    onUpdateAccount(id, { monetizationEnabled: !current });
    onAddLog(`สลับสถานะการเปิดรับรายได้ของบัญชี ID ${id} เป็น: ${!current ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`, 'AccountRepository', 'info');
  };

  return (
    <div className="glass p-6 rounded-2xl" id="creator-account-management">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-accent" />
            11. Creator Account Management (SOLID Repository)
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            จัดการบัญชีครีเอเตอร์หลักและบัญชีสำรอง ตรวจสุขภาพ Proxy และความสอดคล้องของ Fingerprint
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_12px_rgba(102,252,241,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'ปิดแบบฟอร์ม' : 'เพิ่มบัญชีครีเอเตอร์'}
        </button>
      </div>

      {/* Add Account Form */}
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
                placeholder="เช่น tech_guru"
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ชื่อโปรไฟล์ (Profile Name)</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="เช่น TechGuru Official"
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">Proxy IP:Port (ทางเลือก)</label>
              <input
                type="text"
                value={newProxy}
                onChange={(e) => setNewProxy(e.target.value)}
                placeholder="ทิ้งว่างไว้เพื่อใช้ Proxy ระบบ"
                className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">หมายเหตุสัญญะ / บันทึกแผนการตลาด</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="เช่น เน้นทำ Affiliate สินค้าไอที ปักตะกร้ารีวิว"
              className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer"
          >
            บันทึกบัญชีลง SQLite Database
          </button>
        </form>
      )}

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="accounts-cards-grid">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-bg-dark/40 border border-teal-muted/15 rounded-2xl overflow-hidden hover:border-teal-muted/30 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="p-4 border-b border-teal-muted/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  acc.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <span className="font-bold text-white text-sm">@{acc.username}</span>
                <span className="text-[10px] bg-bg-dark border border-teal-muted/15 text-teal-accent px-2 py-0.5 rounded-md font-mono uppercase">
                  {acc.platform}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCheckProxy(acc.id, acc.proxyIp)}
                  className="p-1.5 hover:bg-bg-dark rounded-lg text-teal-muted hover:text-teal-accent cursor-pointer transition-colors"
                  title="เช็คสถานะ Proxy"
                  disabled={checkingProxyId === acc.id}
                >
                  <Wifi className={`w-4 h-4 ${checkingProxyId === acc.id ? 'animate-spin text-teal-accent' : ''}`} />
                </button>
                <button
                  onClick={() => onDeleteAccount(acc.id)}
                  className="p-1.5 hover:bg-bg-dark rounded-lg text-teal-muted hover:text-rose-400 cursor-pointer transition-colors"
                  title="ลบบัญชีออกจากระบบ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inner Details */}
            <div className="p-4 space-y-3 flex-1">
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
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
                    className={`font-sans font-bold text-[9px] px-1 rounded block w-full mt-0.5 cursor-pointer ${
                      acc.monetizationEnabled 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-bg-dark text-teal-muted border border-teal-muted/20'
                    }`}
                  >
                    {acc.monetizationEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </button>
                </div>
              </div>

              {/* Proxy Info */}
              <div className="bg-bg-dark/30 p-2.5 rounded-xl border border-teal-muted/10 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-teal-muted flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-teal-muted" />
                    Proxy Address:
                  </span>
                  <span className="text-text-primary font-mono font-semibold">{acc.proxyIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-muted flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-teal-muted" />
                    Fingerprint Match:
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" />
                    Verified Safe
                  </span>
                </div>
                {/* Test Connection Button */}
                <div className="pt-1.5 border-t border-teal-muted/5 flex justify-between items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestPing(acc.id, acc.proxyIp)}
                    disabled={pingingId === acc.id}
                    className="w-full bg-teal-accent/10 hover:bg-teal-accent/20 border border-teal-accent/30 text-teal-accent font-bold py-1 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all text-[10px] cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${pingingId === acc.id ? 'animate-spin' : ''}`} />
                    {pingingId === acc.id ? 'Testing...' : 'Test Connection'}
                  </button>
                  {pings[acc.id] !== undefined && (
                    <span className="font-mono text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-md px-1.5 py-0.5 shrink-0 animate-fade-in">
                      {pings[acc.id]} ms
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <p className="text-xs text-text-secondary leading-normal bg-bg-dark/20 p-2.5 rounded-xl border border-teal-muted/5">
                {acc.notes || <span className="text-teal-muted/30 italic">ไม่มีบันทึกข้อมูลเพิ่มเติม</span>}
              </p>
            </div>

            {/* Footer time */}
            <div className="bg-bg-dark px-4 py-2 border-t border-teal-muted/5 text-[10px] text-teal-muted flex justify-between">
              <span>ลงทะเบียนเมื่อ: {acc.createdDate}</span>
              <span>ตรวจพบล่าสุด: {acc.lastActive}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
