import React, { useState } from 'react';
import { 
  FolderOpen, 
  Columns, 
  FileText, 
  Paperclip, 
  Clipboard, 
  Play, 
  FileSpreadsheet, 
  FileMinus, 
  Maximize2, 
  X, 
  Check, 
  Sparkles, 
  Send,
  Eye
} from 'lucide-react';
import { CreatorAccount, PublishWorkflow, SystemLog } from '../types';
import AccountManager from './AccountManager';
import Scheduler from './Scheduler';

interface WorkspaceTabProps {
  accounts: CreatorAccount[];
  workflows: PublishWorkflow[];
  notes: string;
  onUpdateNotes: (text: string) => void;
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
  onAddAccount: (acc: CreatorAccount) => void;
  onUpdateAccount: (id: string, updated: Partial<CreatorAccount>) => void;
  onDeleteAccount: (id: string) => void;
  onAddWorkflow: (wf: PublishWorkflow) => void;
  onUpdateWorkflow: (id: string, updated: Partial<PublishWorkflow>) => void;
  onReorderWorkflows: (newList: PublishWorkflow[]) => void;
}

interface AttachmentFile {
  name: string;
  type: 'video' | 'pdf' | 'csv' | 'image';
  size: string;
  content: string; // Used for content simulation in preview
}

export default function WorkspaceTab({
  accounts,
  workflows,
  notes,
  onUpdateNotes,
  onAddLog,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onAddWorkflow,
  onUpdateWorkflow,
  onReorderWorkflows
}: WorkspaceTabProps) {
  // Workspaces switcher
  const [currentWorkspace, setCurrentWorkspace] = useState<'default' | 'development' | 'production'>('default');
  const [splitView, setSplitView] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Attachments List state
  const [attachments, setAttachments] = useState<AttachmentFile[]>([
    { name: 'video_guide_draft.mp4', type: 'video', size: '14.2 MB', content: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { name: 'tiktok_farming_manual.pdf', type: 'pdf', size: '1.4 MB', content: 'คู่มือการฟาร์มบัญชี TikTok เพื่อเลี่ยง Shadowban ประจำปี 2026\n\n1. การเลือก Proxy: ต้องใช้ IP มือถือ (Residential Mobile IP) เสมอ\n2. พฤติกรรม: ให้เลื่อนดูวิดีโอทั่วไป (Organic Feed Scroll) 15-20 นาที\n3. ความถี่การโพสต์: ห้ามโพสต์เกิน 3 คลิปต่อวัน และควรห่างกันอย่างน้อย 4 ชั่วโมง\n4. Engagement: ควรเข้ากดชอบและคอมเมนต์ในช่องประเภทเดียวกัน 5-10 บัญชี' },
    { name: 'account_performance.csv', type: 'csv', size: '12 KB', content: 'Platform,Username,Followers,EngagementRate,Monetization\ntiktok,tech_guru,24500,8.4%,true\nyoutube,cooking_co,128000,12.1%,true\ntiktok,vlog_queen,8900,5.2%,false\nfacebook,news_feed_th,4500,3.1%,false' },
    { name: 'cover_banner_cyber.png', type: 'image', size: '2.8 MB', content: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400' }
  ]);

  // Preview Modal state
  const [previewFile, setPreviewFile] = useState<AttachmentFile | null>(null);

  // Quick clipboard snippets
  const clipboardSnippets = [
    { label: 'แท็กวิดีโอ TikTok', text: '#vlog #affiliate #techreview #trending #creator' },
    { label: 'พาดหัวสรุปโพสต์', text: 'สรุปประเด็นสำคัญรอบวัน 📌 อ่านสั้นเข้าใจง่าย โหลดแพตช์ล่าสุดสำเร็จ' },
    { label: 'ข้อมูลโฆษณาเพจ', text: 'สนใจติดต่องานสปอนเซอร์และรีวิวสินค้าได้ทางข้อความเพจหลัก หรืออีเมลของทีมบริหาร' }
  ];

  // Workspace change simulation
  const handleWorkspaceChange = (ws: 'default' | 'development' | 'production') => {
    setCurrentWorkspace(ws);
    onAddLog(`สลับไปยังพื้นที่งาน (Workspace): [${ws.toUpperCase()}] สำเร็จ`, 'MainProcess', 'info');
  };

  // Clipboard copies
  const handleCopySnippet = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    onAddLog(`[CLIPBOARD MANAGER] คัดลอกข้อความ "${label}" ลงใน Clipboard`, 'IPCRouter', 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Handle Drag & Drop upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      const newFiles: AttachmentFile[] = filesArr.map((f: any) => {
        let fileType: AttachmentFile['type'] = 'image';
        if (f.name.endsWith('.mp4') || f.name.endsWith('.mkv')) fileType = 'video';
        else if (f.name.endsWith('.pdf')) fileType = 'pdf';
        else if (f.name.endsWith('.csv')) fileType = 'csv';

        return {
          name: f.name,
          type: fileType,
          size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
          content: fileType === 'csv' ? 'CSV,Upload,Demo\nData,Row1,Col1\nData,Row2,Col2' : 'ไฟล์ข้อมูลจำลองที่นำเข้าผ่าน Drag-and-Drop'
        };
      });

      setAttachments((prev) => [...prev, ...newFiles]);
      onAddLog(`[DRAG & DROP] นำเข้าไฟล์แนบเวิร์กสเปซสำเร็จจำนวน ${filesArr.length} รายการ`, 'MainProcess', 'info');
    }
  };

  const handleDeleteAttachment = (index: number, name: string) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    onAddLog(`ลบไฟล์แนบเวิร์กสเปซ: ${name}`, 'MainProcess', 'warn');
  };

  // Basic markdown render simulation
  const renderMarkdown = (md: string) => {
    return md.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-lg font-extrabold text-white mt-3 mb-2 border-b border-teal-muted/15 pb-1 font-syne uppercase text-teal-accent">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-sm font-bold text-teal-accent mt-2.5 mb-1.5">{line.slice(3)}</h2>;
      }
      if (line.startsWith('- [ ] ')) {
        return (
          <div key={idx} className="flex items-center gap-2 my-1 text-teal-muted">
            <span className="w-3.5 h-3.5 rounded border border-teal-muted/40 block shrink-0" />
            <span>{line.slice(6)}</span>
          </div>
        );
      }
      if (line.startsWith('- [x] ')) {
        return (
          <div key={idx} className="flex items-center gap-2 my-1 text-emerald-400 line-through decoration-emerald-500/30">
            <span className="w-3.5 h-3.5 rounded border border-emerald-500 bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
            </span>
            <span>{line.slice(6)}</span>
          </div>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="list-disc pl-4 my-0.5 text-text-secondary">{line.slice(2)}</li>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="my-1 text-text-secondary leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-6" id="workspace-layout-panel">
      {/* Top Controller Bar */}
      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-teal-muted/15">
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-teal-accent animate-pulse" />
          <div>
            <h3 className="font-bold text-white text-sm">Enterprise Workspace Manager</h3>
            <p className="text-[10px] text-teal-muted mt-0.5">
              จัดกลุ่มเวิร์กสเปซ, สลับ Docking Layout และจำลองการแชร์ไฟล์แนบ (Local Attachments Sandbox)
            </p>
          </div>
        </div>

        {/* Workspace Switcher & Split Layout Toggles */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="flex bg-bg-dark/60 p-1 rounded-xl border border-teal-muted/15 text-[10px] font-bold">
            <button
              onClick={() => handleWorkspaceChange('default')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentWorkspace === 'default' ? 'bg-teal-accent text-bg-dark font-black' : 'text-teal-muted hover:text-white'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => handleWorkspaceChange('development')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentWorkspace === 'development' ? 'bg-indigo-500 text-white font-black' : 'text-teal-muted hover:text-white'
              }`}
            >
              Dev Lab
            </button>
            <button
              onClick={() => handleWorkspaceChange('production')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currentWorkspace === 'production' ? 'bg-rose-500 text-white font-black' : 'text-teal-muted hover:text-white'
              }`}
            >
              PRO Production
            </button>
          </div>

          <button
            onClick={() => {
              setSplitView(!splitView);
              onAddLog(`ปรับเปลี่ยนมุมมองแบบ: [${!splitView ? 'SPLIT DOCK COLUMNS' : 'SINGLE VIEW'}]`, 'MainProcess', 'info');
            }}
            className={`px-3 py-2 text-[10px] font-bold rounded-xl flex items-center gap-1.5 border transition-all cursor-pointer ${
              splitView 
                ? 'bg-teal-accent/20 border-teal-accent text-teal-accent' 
                : 'bg-bg-dark/40 border-teal-muted/20 text-teal-muted hover:border-teal-muted/40 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            Split Panels
          </button>
        </div>
      </div>

      {/* Main layout depends on Split view */}
      {splitView ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="split-workspace-columns">
          {/* Left Split Column - Account Manager */}
          <div className="bg-bg-dark/20 border border-teal-muted/10 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-teal-accent tracking-widest font-mono uppercase bg-teal-accent/10 px-2.5 py-0.5 rounded-md border border-teal-accent/15">
                Panel A: Account Repository
              </span>
              <span className="text-[9px] text-teal-muted">SQLite Active Proxy Host</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto rounded-xl">
              <AccountManager
                accounts={accounts}
                onAddAccount={onAddAccount}
                onUpdateAccount={onUpdateAccount}
                onDeleteAccount={onDeleteAccount}
                onAddLog={onAddLog}
              />
            </div>
          </div>

          {/* Right Split Column - Scheduler Queue */}
          <div className="bg-bg-dark/20 border border-teal-muted/10 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-indigo-400 tracking-widest font-mono uppercase bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/15">
                Panel B: Queue Scheduler Service
              </span>
              <span className="text-[9px] text-teal-muted">Drizzle ORM Engine Simulation</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto rounded-xl">
              <Scheduler
                workflows={workflows}
                accounts={accounts}
                onAddWorkflow={onAddWorkflow}
                onUpdateWorkflow={onUpdateWorkflow}
                onReorderWorkflows={onReorderWorkflows}
                onAddLog={onAddLog}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="standard-workspace-panels">
          
          {/* 1. Left Side: Interactive Markdown Editor */}
          <div className="lg:col-span-2 glass p-5 rounded-2xl border border-teal-muted/15 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-accent" />
                Notes &amp; Markdown Composer (Rich Content)
              </h4>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                AUTO-SAVING IN SQLITE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[350px]">
              {/* Input TextArea */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-teal-muted block uppercase tracking-wider">Markdown Input (คีย์แผนงาน)</span>
                <textarea
                  value={notes}
                  onChange={(e) => onUpdateNotes(e.target.value)}
                  className="flex-1 bg-[#0b0c10] border border-teal-muted/20 focus:border-teal-accent/50 rounded-xl p-3 font-mono text-xs text-white focus:outline-none resize-none leading-relaxed h-full"
                  placeholder="เขียนหัวข้อ Markdown ที่นี่..."
                />
              </div>

              {/* Parsed Live Output */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-teal-muted block uppercase tracking-wider">Live Preview Container</span>
                <div className="flex-1 bg-bg-dark/40 border border-teal-muted/10 rounded-xl p-3.5 overflow-y-auto h-full font-sans text-xs max-h-[310px]">
                  {renderMarkdown(notes)}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Right Side: Clipboard Snippets & Attachments Drag & Drop */}
          <div className="space-y-6">
            
            {/* Clipboard Manager */}
            <div className="glass p-5 rounded-2xl border border-teal-muted/15">
              <h4 className="font-bold text-white text-xs mb-3 flex items-center gap-1.5">
                <Clipboard className="w-4 h-4 text-teal-accent" />
                Clipboard Manager (สกรีปต์คีย์ลัด)
              </h4>

              <div className="space-y-2.5">
                {clipboardSnippets.map((snippet, idx) => (
                  <div key={idx} className="bg-bg-dark/50 border border-teal-muted/10 p-2.5 rounded-xl flex justify-between items-start gap-3">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-bold text-white block">{snippet.label}</span>
                      <p className="text-[9px] text-teal-muted truncate">{snippet.text}</p>
                    </div>
                    <button
                      onClick={() => handleCopySnippet(snippet.text, snippet.label)}
                      className="bg-teal-accent/10 hover:bg-teal-accent text-teal-accent hover:text-bg-dark text-[9px] font-black px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer"
                    >
                      {copiedText === snippet.label ? 'COPIED!' : 'COPY'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments Sandbox */}
            <div className="glass p-5 rounded-2xl border border-teal-muted/15">
              <h4 className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-teal-accent" />
                Workspace Attachments Sandbox
              </h4>
              <p className="text-[9px] text-teal-muted mb-3">ลากวางไฟล์เพื่อทดสอบ Sandbox Preview</p>

              {/* Drag-Drop Box */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed rounded-xl p-4 text-center transition-all mb-4 cursor-pointer ${
                  isDragOver 
                    ? 'border-teal-accent bg-teal-accent/10 text-white' 
                    : 'border-teal-muted/20 bg-bg-dark/30 text-teal-muted hover:border-teal-muted/40 hover:text-teal-muted/80'
                }`}
              >
                <Paperclip className="w-5 h-5 mx-auto mb-1.5 animate-bounce" />
                <span className="text-[10px] font-bold block">ลากวางไฟล์แนบลงที่นี่เพื่อจัดเก็บ</span>
                <span className="text-[8px] text-teal-muted/70 block mt-0.5">(Supports MP4, PDF, CSV, PNG)</span>
              </div>

              {/* Attachments list */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {attachments.map((file, idx) => (
                  <div key={idx} className="bg-bg-dark/30 border border-teal-muted/5 px-2.5 py-2 rounded-xl flex justify-between items-center gap-2 hover:border-teal-muted/15 transition-all">
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type === 'video' && <Play className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      {file.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                      {file.type === 'csv' && <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                      {file.type === 'image' && <Paperclip className="w-3.5 h-3.5 text-teal-accent shrink-0" />}
                      
                      <div className="min-w-0 leading-tight">
                        <span className="text-[10px] font-bold text-white truncate block">{file.name}</span>
                        <span className="text-[8px] text-teal-muted font-mono">{file.size}</span>
                      </div>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className="p-1 bg-teal-accent/5 hover:bg-teal-accent/20 border border-teal-accent/25 rounded text-teal-accent cursor-pointer"
                        title="ดูพรีวิวไฟล์"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteAttachment(idx, file.name)}
                        className="p-1 bg-rose-500/5 hover:bg-rose-500/20 border border-rose-500/25 rounded text-rose-400 cursor-pointer"
                        title="ลบไฟล์แนบ"
                      >
                        <FileMinus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* File Previewer Modal Popup */}
      {previewFile && (
        <div className="fixed inset-0 bg-bg-dark/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card-dark border border-teal-accent/25 max-w-2xl w-full rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
            
            {/* Header */}
            <div className="bg-bg-dark/50 p-4 border-b border-teal-muted/15 flex justify-between items-center select-none shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-accent animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-teal-muted tracking-wider">
                  ELECTRON SANDBOX FILE PREVIEWER: <strong className="text-white">{previewFile.name}</strong>
                </span>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-teal-muted hover:text-white p-1 hover:bg-bg-dark/80 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Box Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0b0c10] text-xs">
              {previewFile.type === 'video' && (
                <div className="space-y-4">
                  <video src={previewFile.content} controls className="w-full rounded-xl border border-teal-muted/20 bg-black aspect-video" referrerPolicy="no-referrer" />
                  <p className="text-[10px] text-teal-muted text-center font-mono leading-relaxed bg-bg-dark/40 p-2 rounded-xl">
                    [ELECTRON STREAM PLAYER] จำลองการสตรีมมิ่งวิดีโออัปโหลดจาก Local Sandbox Path
                  </p>
                </div>
              )}

              {previewFile.type === 'pdf' && (
                <div className="bg-bg-dark/40 border border-teal-muted/10 p-5 rounded-xl whitespace-pre-wrap font-sans leading-relaxed text-text-secondary select-text">
                  <div className="flex justify-between items-center border-b border-rose-500/10 pb-3 mb-3">
                    <span className="text-rose-400 font-extrabold uppercase font-mono tracking-wider text-[10px]">PDF Document Stream (Local PDF Reader)</span>
                    <span className="text-teal-muted font-mono text-[9px]">1.4 MB - SHA256 Secured</span>
                  </div>
                  {previewFile.content}
                </div>
              )}

              {previewFile.type === 'csv' && (
                <div className="space-y-3">
                  <span className="text-emerald-400 font-extrabold uppercase font-mono tracking-wider text-[10px] block">CSV Dynamic Table Viewer</span>
                  <div className="border border-teal-muted/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left font-sans border-collapse">
                      <thead>
                        <tr className="bg-bg-dark border-b border-teal-muted/15 text-teal-accent font-black text-[10px] uppercase">
                          {previewFile.content.split('\n')[0].split(',').map((header, hidx) => (
                            <th key={hidx} className="p-2 px-3 border-r border-teal-muted/10">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-teal-muted/5">
                        {previewFile.content.split('\n').slice(1).map((row, ridx) => (
                          <tr key={ridx} className="hover:bg-teal-accent/5">
                            {row.split(',').map((cell, cidx) => (
                              <td key={cidx} className="p-2 px-3 border-r border-teal-muted/5 font-mono text-text-secondary text-[10px]">
                                {cell === 'true' ? <span className="text-emerald-400 font-bold">TRUE</span> : cell === 'false' ? <span className="text-rose-400">FALSE</span> : cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {previewFile.type === 'image' && (
                <div className="flex flex-col items-center gap-4">
                  <img src={previewFile.content} alt={previewFile.name} className="max-h-[350px] object-cover rounded-xl border border-teal-accent/25 shadow-xl" referrerPolicy="no-referrer" />
                  <span className="text-[10px] font-mono text-teal-muted">HTTPS Image Sandbox Proxy Rendering</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-bg-dark/50 p-3.5 border-t border-teal-muted/15 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setPreviewFile(null)}
                className="bg-teal-accent text-bg-dark hover:bg-teal-accent-dark font-black text-xs px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-[0_0_10px_rgba(102,252,241,0.15)]"
              >
                CLOSE PREVIEW
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
