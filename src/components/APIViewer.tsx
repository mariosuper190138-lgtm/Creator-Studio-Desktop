import React, { useState } from 'react';
import { Network, Terminal, Send, HelpCircle, Code, ShieldCheck } from 'lucide-react';
import { SystemLog } from '../types';

interface APIViewerProps {
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

export default function APIViewer({ onAddLog }: APIViewerProps) {
  const [activeTab, setActiveTab] = useState<'ipc' | 'rest' | 'preload'>('ipc');
  const [ipcChannel, setIpcChannel] = useState<string>('account:create');
  const [ipcPayload, setIpcPayload] = useState<string>('{\n  "username": "new_creator",\n  "profileName": "New Creator TH",\n  "platform": "tiktok"\n}');
  const [ipcResponse, setIpcResponse] = useState<any>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const channels = [
    { name: 'account:get-all', type: 'Renderer to Main', desc: 'ดึงข้อมูลบัญชีครีเอเตอร์ทั้งหมดใน SQLite' },
    { name: 'account:create', type: 'Renderer to Main', desc: 'บันทึกบัญชีครีเอเตอร์ใหม่ พร้อมตรวจสอบ Proxy IP' },
    { name: 'account:update-status', type: 'Renderer to Main', desc: 'ปรับสเตตัสการทำงานของบัญชี (active, verification_required, cooldown)' },
    { name: 'workflow:schedule', type: 'Renderer to Main', desc: 'จัดคิวอัปโหลดวิดีโอเข้าสู่ Priority Queue ของ Scheduler Service' },
    { name: 'backup:export', type: 'Renderer to Main', desc: 'ส่งออกฐานข้อมูลจำลองออกมาเป็นไฟล์ JSON สำรอง' },
    { name: 'network:rotate-ip', type: 'Renderer to Main', desc: 'สั่งการจำลอง Dynamic IP (เครื่องบิน) บนเครือข่ายมือถือ' }
  ];

  const handleSendIpc = () => {
    setIsSending(true);
    onAddLog(`Renderer Process กำลังส่งสารทาง IPC ช่อง: [${ipcChannel}]`, 'IPCRouter', 'info');

    setTimeout(() => {
      try {
        const parsed = JSON.parse(ipcPayload);
        
        let responseData: any = {};
        if (ipcChannel === 'account:get-all') {
          responseData = { success: true, count: 5, data: [] };
        } else if (ipcChannel === 'account:create') {
          responseData = { 
            success: true, 
            id: Math.floor(Math.random() * 1000).toString(), 
            username: parsed.username || 'new_creator',
            status: 'active',
            msg: 'ลงทะเบียนบัญชีครีเอเตอร์ใน SQLite สำเร็จ' 
          };
        } else if (ipcChannel === 'account:update-status') {
          responseData = { success: true, updatedId: parsed.id || '1', newStatus: parsed.status || 'active' };
        } else if (ipcChannel === 'workflow:schedule') {
          responseData = { success: true, workflowId: 'wf-' + Math.floor(Math.random() * 999), msg: 'คิวงานจัดเก็บสำเร็จ' };
        } else if (ipcChannel === 'backup:export') {
          responseData = { success: true, backupSize: '1.2 MB', path: '/Backups/sqlite-backup-2026.json' };
        } else if (ipcChannel === 'network:rotate-ip') {
          responseData = { success: true, ip: '182.23.109.' + Math.floor(Math.random() * 254), msg: 'หมุนสัญญาณ IP เครือข่ายใหม่เสร็จสิ้น' };
        }

        setIpcResponse(responseData);
        onAddLog(`Main Process ตอบรับ IPC: [${ipcChannel}] - คลาสสำเร็จ 200 OK`, 'IPCRouter', 'info');
      } catch (err: any) {
        setIpcResponse({ success: false, error: 'JSON Payload Format Error: ' + err.message });
        onAddLog(`Main Process ตอบรับความล้มเหลว IPC: [${ipcChannel}] - เหตุผล: ${err.message}`, 'IPCRouter', 'error');
      } finally {
        setIsSending(false);
      }
    }, 600);
  };

  const handleSelectChannel = (chan: string) => {
    setIpcChannel(chan);
    if (chan === 'account:get-all') {
      setIpcPayload('{}');
    } else if (chan === 'account:create') {
      setIpcPayload('{\n  "username": "new_creator",\n  "profileName": "New Creator TH",\n  "platform": "tiktok"\n}');
    } else if (chan === 'account:update-status') {
      setIpcPayload('{\n  "id": "1",\n  "status": "cooldown"\n}');
    } else if (chan === 'workflow:schedule') {
      setIpcPayload('{\n  "title": "รีวิวคาเฟ่",\n  "accountId": "1",\n  "contentType": "video",\n  "scheduledTime": "2026-07-22 19:00:00"\n}');
    } else if (chan === 'backup:export') {
      setIpcPayload('{}');
    } else if (chan === 'network:rotate-ip') {
      setIpcPayload('{\n  "groupId": 1\n}');
    }
  };

  return (
    <div className="glass p-6 rounded-2xl" id="api-ipc-design-panel">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-teal-accent" />
            5. Inter-Process Communication (IPC) &amp; API Design
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            ช่องทางการสื่อสารระดับสถาปัตยกรรมระหว่าง Renderer (React GUI) และ Main Process (Node.js API)
          </p>
        </div>

        {/* Local Switcher */}
        <div className="flex gap-1 bg-bg-dark/60 p-1 rounded-xl border border-teal-muted/15">
          <button
            onClick={() => setActiveTab('ipc')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'ipc'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            IPC Router
          </button>
          <button
            onClick={() => setActiveTab('preload')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'preload'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Context Preload Bridge
          </button>
          <button
            onClick={() => setActiveTab('rest')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'rest'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            REST Proxies API
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="text-xs">
        {activeTab === 'ipc' && (
          <div className="space-y-4 animate-fade-in" id="ipc-router-view">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Channel list (Left) */}
              <div className="md:col-span-5 space-y-2">
                <h4 className="font-bold text-white text-xs mb-1.5">ช่องสัญญาณที่ลงทะเบียนไว้ (IPC Registers)</h4>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {channels.map((chan) => (
                    <button
                      key={chan.name}
                      onClick={() => handleSelectChannel(chan.name)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer block ${
                        ipcChannel === chan.name
                          ? 'bg-teal-accent/15 border-teal-accent/30 text-teal-accent'
                          : 'bg-bg-dark/40 border-teal-muted/10 text-text-secondary hover:border-teal-muted/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-mono font-bold text-[11px] truncate">{chan.name}</span>
                        <span className="text-[8px] bg-bg-dark border border-teal-muted/20 px-1.5 py-0.5 rounded text-teal-muted uppercase font-sans shrink-0">
                          {chan.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-teal-muted/80 leading-snug truncate">{chan.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation panel (Right) */}
              <div className="md:col-span-7 space-y-3 bg-[#0b0c10] border border-teal-muted/15 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-white font-bold mb-1">
                  <Code className="w-4 h-4 text-teal-accent" />
                  IPC Call Simulator
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div>
                    <label className="text-teal-muted text-[10px] block mb-1.5">JSON Payload Arguments</label>
                    <textarea
                      value={ipcPayload}
                      onChange={(e) => setIpcPayload(e.target.value)}
                      className="w-full bg-bg-dark border border-teal-muted/20 focus:border-teal-accent/50 focus:ring-1 focus:ring-teal-accent/30 rounded-xl p-3 text-white focus:outline-none h-28 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="text-teal-muted text-[10px] block mb-1.5">IPC Promise Response (Async)</label>
                    <div className="w-full bg-bg-dark border border-teal-muted/20 rounded-xl p-3 text-emerald-400 h-28 overflow-y-auto overflow-x-auto select-all">
                      {isSending ? (
                        <div className="flex items-center justify-center h-full text-teal-accent">
                          <span className="animate-pulse">Awaiting main process execution...</span>
                        </div>
                      ) : ipcResponse ? (
                        <pre className="text-[10px] font-semibold">{JSON.stringify(ipcResponse, null, 2)}</pre>
                      ) : (
                        <span className="text-teal-muted/45 italic">คลิก "SEND EVENT" เพื่อทดสอบ</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSendIpc}
                  disabled={isSending}
                  className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  SEND IPC EVENT
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preload' && (
          <div className="space-y-4 animate-fade-in" id="preload-bridge-view">
            <div className="bg-bg-dark/60 border border-teal-muted/15 p-4 rounded-xl font-mono text-[11px] text-teal-accent overflow-x-auto relative">
              <span className="absolute right-3 top-3 text-[10px] text-teal-muted/50 font-sans">preload.ts (Secured Bridge)</span>
              <pre className="leading-relaxed">
{`import { contextBridge, ipcRenderer } from 'electron';

// Open secure, filtered IPC APIs to the Renderer (React GUI)
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: async (channel: string, data: any) => {
    const ALLOWED_CHANNELS = [
      'account:get-all', 'account:create', 'account:update-status',
      'workflow:schedule', 'backup:export', 'network:rotate-ip'
    ];
    if (ALLOWED_CHANNELS.includes(channel)) {
      return await ipcRenderer.invoke(channel, data);
    }
    throw new Error(\`Security Violation: Channel \${channel} is block-listed\`);
  }
});`}
              </pre>
            </div>
            
            <div className="bg-emerald-500/5 p-4 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">🛡️ การรักษาความปลอดภัยด้วย Electron Context Bridge (Context Isolation)</p>
                <p className="mt-1 text-text-secondary leading-relaxed">
                  นี่คือวิธีปฏิบัติที่ดีที่สุด (Production Practice) การหลีกเลี่ยงการเปิดเผยโมดูล <code>ipcRenderer</code> ของ Node.js โดยตรงสู่หน้าต่างเบราว์เซอร์ ซึ่งเสี่ยงต่อการถูกแทรกโค้ดอันตราย (XSS) ด้วยการใช้ <code>contextBridge</code> เพื่อสร้างอุโมงค์สื่อสารเฉพาะช่องสัญญาณที่ได้รับอนุญาตเท่านั้น (Whitelisted channels) ทำให้สเปสเมมโมรีขาดออกจากกันโดยเด็ดขาดและปลอดภัยที่สุด
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rest' && (
          <div className="space-y-4 animate-fade-in" id="rest-proxies-view">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
              <h4 className="font-bold text-white text-sm mb-2">📡 Proxy Server &amp; External Integration Flow</h4>
              <p className="mb-3 text-text-secondary">
                แม้แอปพลิเคชันจะทำงานเป็น Local First แต่ระบบต้องการติดต่อกับภายนอกในการหมุนเวียน IP เครือข่ายโทรศัพท์ หรือยิง API เช็คสถานะ proxy แบบเรียลไทม์ ซึ่งออกแบบตามแนวคิด Decoupled API:
              </p>

              <div className="space-y-2.5">
                <div className="bg-[#0b0c10] border border-teal-muted/15 p-3 rounded-lg font-mono text-[10px]">
                  <span className="text-teal-accent font-bold">GET</span> https://api.ixbrowser.com/v2/profile/status
                  <p className="text-text-secondary font-sans text-[11px] mt-1">ใช้ดึงข้อมูลความพร้อมและสถานะจำลองของ Profile บนเบราว์เซอร์ ixbrowser</p>
                </div>

                <div className="bg-[#0b0c10] border border-teal-muted/15 p-3 rounded-lg font-mono text-[10px]">
                  <span className="text-indigo-400 font-bold">POST</span> http://192.168.1.1/api/airplane_mode/toggle
                  <p className="text-text-secondary font-sans text-[11px] mt-1">ส่งสัญญาณไปยังอุปกรณ์ Android Router ภายในวงเน็ตเดียวกันเพื่อสั่งสลับโหมดเครื่องบิน (Reset IP)</p>
                </div>

                <div className="bg-[#0b0c10] border border-teal-muted/15 p-3 rounded-lg font-mono text-[10px]">
                  <span className="text-emerald-400 font-bold">GET</span> https://ipinfo.io/json
                  <p className="text-text-secondary font-sans text-[11px] mt-1">เรียกเช็คข้อมูลพิกัด ข้อมูลเครือข่าย ISP และ Dynamic IP ขาออกเพื่อให้แน่ใจว่าการสลับ IP มือถือเสร็จสิ้นจริง</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
