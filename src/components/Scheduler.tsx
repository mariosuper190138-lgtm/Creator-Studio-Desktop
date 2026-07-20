import React, { useState, useEffect } from 'react';
import { Calendar, Play, CheckCircle, Video, Plus, Eye, Clock, AlertTriangle, FileCode, Pause, Square, CheckSquare, XCircle, RotateCcw } from 'lucide-react';
import { PublishWorkflow, CreatorAccount, SystemLog } from '../types';

interface SchedulerProps {
  workflows: PublishWorkflow[];
  accounts: CreatorAccount[];
  onAddWorkflow: (wf: PublishWorkflow) => void;
  onUpdateWorkflow: (id: string, updated: Partial<PublishWorkflow>) => void;
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

export default function Scheduler({
  workflows,
  accounts,
  onAddWorkflow,
  onUpdateWorkflow,
  onAddLog
}: SchedulerProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedAccId, setSelectedAccId] = useState('');
  const [newType, setNewType] = useState<'video' | 'short_video' | 'image_post'>('video');
  const [newTime, setNewTime] = useState('2026-07-21 18:00:00');
  const [videoPath, setVideoPath] = useState('');
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [simProgress, setSimProgress] = useState<number>(0);

  // Bulk Selection and Batch update states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === workflows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(workflows.map((w) => w.id));
    }
  };

  const handleBatchUpdateStatus = (newStatus: 'paused' | 'queued' | 'failed') => {
    if (selectedIds.length === 0) return;

    selectedIds.forEach((id) => {
      onUpdateWorkflow(id, { status: newStatus });
    });

    const statusLabels: Record<string, string> = {
      paused: 'PAUSED (ระงับชั่วคราว)',
      queued: 'QUEUED (พร้อมดำเนินการใหม่)',
      failed: 'CANCELLED (ยกเลิกคิวงาน)'
    };

    onAddLog(
      `[BATCH UPDATE] ปรับปรุงสถานะคิวงานจำนวน ${selectedIds.length} รายการเป็น: ${statusLabels[newStatus]}`,
      'SchedulerService',
      'info'
    );

    setSelectedIds([]);
  };

  useEffect(() => {
    if (processingId) {
      const interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onUpdateWorkflow(processingId, { status: 'completed', progress: 100 });
            const wf = workflows.find((w) => w.id === processingId);
            onAddLog(`อัปโหลดเสร็จสิ้นเรียบร้อย! คิวงาน ID: ${processingId} (${wf?.title})`, 'SchedulerService', 'info');
            setProcessingId(null);
            return 0;
          }
          const next = prev + 10;
          onUpdateWorkflow(processingId, { progress: next });
          return next;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [processingId]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !selectedAccId) {
      alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
      return;
    }

    const acc = accounts.find((a) => a.id === selectedAccId);
    if (!acc) return;

    const newWf: PublishWorkflow = {
      id: 'wf-' + Math.floor(Math.random() * 999),
      title: newTitle,
      accountId: selectedAccId,
      platform: acc.platform,
      contentType: newType,
      scheduledTime: newTime,
      status: 'queued',
      progress: 0,
      videoPath: videoPath || '/Media/render_output_draft_v1.mp4',
      description: 'ระบบจัดเรียงลำดับเนื้อหาแบบอัตโนมัติ'
    };

    onAddWorkflow(newWf);
    onAddLog(`บันทึกตารางการอัปโหลดวิดีโอใหม่: ${newTitle} (${acc.username})`, 'SchedulerService', 'info');

    // Reset
    setNewTitle('');
    setVideoPath('');
    setShowForm(false);
  };

  const handleStartQueue = (id: string) => {
    if (processingId) {
      alert('มีกระบวนการคิวงานกำลังประมวลผลอยู่ กรุณารอสักครู่');
      return;
    }

    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;

    setProcessingId(id);
    setSimProgress(0);
    onUpdateWorkflow(id, { status: 'running', progress: 0 });
    onAddLog(`[START] กำลังประมวลผลคิวงานอัปโหลด: "${wf.title}" สำหรับ @${accounts.find(a => a.id === wf.accountId)?.username || 'user'}`, 'SchedulerService', 'info');
  };

  return (
    <div className="glass p-6 rounded-2xl" id="workflow-scheduler-panel">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-accent" />
            12. Workflow Queue &amp; Automation Scheduler
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            ตัวควบคุมตารางคิว ลำดับขั้นตอนพฤติกรรมการอัปโหลดงาน (Staggered Scheduling Queue Controller)
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (accounts.length > 0 && !selectedAccId) {
              setSelectedAccId(accounts[0].id);
            }
          }}
          className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_12px_rgba(102,252,241,0.25)] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'ปิดแบบฟอร์ม' : 'จัดแผนอัปโหลดใหม่'}
        </button>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6" id="scheduler-stats-dashboard">
        <div className="bg-bg-dark/40 border border-teal-muted/10 p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-teal-muted font-bold font-mono tracking-wider uppercase">Queued Workflows</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-white">{workflows.filter(w => w.status === 'queued').length}</span>
            <span className="text-[10px] text-teal-muted font-bold font-mono">งานรอดำเนินการ</span>
          </div>
        </div>
        <div className="bg-bg-dark/40 border border-teal-accent/20 p-3.5 rounded-xl flex flex-col justify-between relative overflow-hidden">
          {workflows.filter(w => w.status === 'running').length > 0 && (
            <div className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-teal-accent animate-ping" />
          )}
          <span className="text-[10px] text-teal-muted font-bold font-mono tracking-wider uppercase">Running Workflows</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-teal-accent">{workflows.filter(w => w.status === 'running').length}</span>
            <span className="text-[10px] text-teal-muted font-bold font-mono">กำลังอัปโหลด</span>
          </div>
        </div>
        <div className="bg-bg-dark/40 border border-emerald-500/20 p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] text-teal-muted font-bold font-mono tracking-wider uppercase">Completed Workflows</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-emerald-400">{workflows.filter(w => w.status === 'completed').length}</span>
            <span className="text-[10px] text-teal-muted font-bold font-mono">สำเร็จแล้ว</span>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl mb-6 space-y-4 animate-fade-in" id="add-workflow-form">
          {accounts.length === 0 ? (
            <div className="text-center p-4 text-amber-400 text-xs font-semibold">
              ⚠️ กรุณาเพิ่มบัญชีครีเอเตอร์อย่างน้อย 1 บัญชีก่อนจัดคิวงานอัปโหลด
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ส่งงานผ่านบัญชี</label>
                  <select
                    value={selectedAccId}
                    onChange={(e) => setSelectedAccId(e.target.value)}
                    className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>@{a.username} ({a.platform})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">หัวข้อ/แคปชั่นวิดีโอ</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="เช่น รีวิวเปิดตัวสินค้าใหม่ล่าสุด #affiliate"
                    className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ประเภทเนื้อหา</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="video">วิดีโอแนวนอนยาว (Video)</option>
                    <option value="short_video">วิดีโอแนวตั้งสั้น (Short / Reel / Shorts)</option>
                    <option value="image_post">ภาพโพสต์ชุดสไลด์ (Image Post)</option>
                  </select>
                </div>

                <div>
                  <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">เวลาอัปโหลด (Scheduled)</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="เช่น 2026-07-21 18:00:00"
                    className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">Local Media File Path (.mp4, .png)</label>
                <input
                  type="text"
                  value={videoPath}
                  onChange={(e) => setVideoPath(e.target.value)}
                  placeholder="เช่น C:/Users/Admin/Videos/renders/tiktok_review_1.mp4"
                  className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer"
              >
                บันทึกคิวงานลงคิวกำหนดการ
              </button>
            </>
          )}
        </form>
      )}

      {/* Batch Action Panel */}
      {workflows.length > 0 && (
        <div className="bg-bg-dark/60 border border-teal-muted/15 p-4 rounded-xl mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-sans">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 font-bold text-teal-accent hover:text-white transition-all cursor-pointer"
            >
              {selectedIds.length === workflows.length ? (
                <CheckSquare className="w-4 h-4 text-teal-accent" />
              ) : (
                <Square className="w-4 h-4 text-teal-muted" />
              )}
              {selectedIds.length === workflows.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-teal-muted">| Selected: <strong className="text-white font-mono bg-teal-accent/15 px-1.5 py-0.5 rounded border border-teal-accent/25">{selectedIds.length}</strong> / {workflows.length}</span>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-teal-muted font-bold font-mono uppercase">Batch Actions:</span>
              
              <button
                type="button"
                onClick={() => handleBatchUpdateStatus('paused')}
                className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
                Pause Selected
              </button>

              <button
                type="button"
                onClick={() => handleBatchUpdateStatus('queued')}
                className="bg-teal-accent/10 hover:bg-teal-accent/20 border border-teal-accent/30 text-teal-accent font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-teal-accent/10" />
                Resume Selected
              </button>

              <button
                type="button"
                onClick={() => handleBatchUpdateStatus('failed')}
                className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* Queued Workflows List */}
      <div className="space-y-3" id="workflows-queue-list">
        {workflows.length === 0 ? (
          <div className="text-center py-8 text-teal-muted bg-bg-dark/20 rounded-xl border border-dashed border-teal-muted/15">
            <Clock className="w-8 h-8 mx-auto mb-2 text-teal-muted/20 animate-pulse" />
            <p className="text-xs">ยังไม่มีคิวอัปโหลดกำหนดการงานในระบบ</p>
            <p className="text-[10px] text-teal-muted/70 mt-1">กดปุ่มสีฟ้ามุมขวาเพื่อลงทะเบียนเพิ่มคิวจำลองโพสต์</p>
          </div>
        ) : (
          workflows.map((wf) => {
            const acc = accounts.find((a) => a.id === wf.accountId);
            const isSelected = selectedIds.includes(wf.id);
            return (
              <div
                key={wf.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                  wf.status === 'completed'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : wf.status === 'running'
                    ? 'bg-teal-accent/10 border-teal-accent/35 shadow-[0_0_10px_rgba(102,252,241,0.05)]'
                    : wf.status === 'paused'
                    ? 'bg-amber-500/5 border-amber-500/25'
                    : wf.status === 'failed'
                    ? 'bg-rose-500/5 border-rose-500/20'
                    : 'bg-bg-dark/40 border-teal-muted/15'
                }`}
              >
                {/* Left block Info + Checkbox */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleSelect(wf.id)}
                    className="mt-1.5 text-teal-muted hover:text-teal-accent transition-all shrink-0 cursor-pointer"
                    title={isSelected ? 'Deselect item' : 'Select item'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-teal-accent" />
                    ) : (
                      <Square className="w-4 h-4 text-teal-muted/40" />
                    )}
                  </button>

                  <div className={`p-2 rounded-lg shrink-0 ${
                    wf.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-400' 
                      : wf.status === 'paused'
                      ? 'bg-amber-500/10 text-amber-400'
                      : wf.status === 'failed'
                      ? 'bg-rose-500/10 text-rose-400'
                      : 'bg-bg-dark border border-teal-muted/15 text-teal-accent'
                  }`}>
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-xs truncate max-w-sm">{wf.title}</span>
                      <span className="text-[9px] bg-bg-dark text-teal-muted px-2 py-0.5 rounded-full font-mono font-bold uppercase border border-teal-muted/10 shrink-0">
                        {wf.contentType}
                      </span>
                      {wf.status === 'paused' && (
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                          PAUSED
                        </span>
                      )}
                      {wf.status === 'failed' && (
                        <span className="text-[8px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                          CANCELLED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-teal-muted leading-relaxed">
                      ผู้ดูแล: <strong className="text-text-primary">@{acc ? acc.username : 'ไม่ระบุ'}</strong> ({wf.platform}) | ไฟล์: <code className="text-teal-accent font-mono text-[9px]">{wf.videoPath}</code>
                    </p>
                  </div>
                </div>

                {/* Right block Actions / Progress */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  {/* Progress display */}
                  {wf.status === 'running' && (
                    <div className="flex items-center gap-2 w-28 font-mono text-[10px]">
                      <div className="flex-1 bg-bg-dark h-1.5 rounded-full overflow-hidden border border-teal-muted/10">
                        <div
                          className="bg-teal-accent h-full transition-all duration-300"
                          style={{ width: `${wf.progress}%` }}
                        />
                      </div>
                      <span className="text-teal-accent font-bold">{wf.progress}%</span>
                    </div>
                  )}

                  {wf.status === 'completed' && (
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-lg font-extrabold flex items-center gap-1 shrink-0 font-sans">
                      <CheckCircle className="w-3.5 h-3.5" />
                      สำเร็จแล้ว
                    </span>
                  )}

                  {wf.status === 'paused' && (
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                        <Pause className="w-3.5 h-3.5 animate-pulse" />
                        ระงับคิวงาน
                      </span>

                      <button
                        onClick={() => {
                          onUpdateWorkflow(wf.id, { status: 'queued' });
                          onAddLog(`[RESUME] เปิดใช้งานคิวงานอัปโหลดสำเร็จ: "${wf.title}"`, 'SchedulerService', 'info');
                        }}
                        className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        title="เปิดใช้งานคิวงานอีกครั้ง"
                      >
                        <Play className="w-3 h-3 fill-bg-dark" />
                        Resume
                      </button>
                    </div>
                  )}

                  {wf.status === 'failed' && (
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                        <XCircle className="w-3.5 h-3.5" />
                        ยกเลิกแล้ว
                      </span>

                      <button
                        onClick={() => {
                          onUpdateWorkflow(wf.id, { status: 'queued' });
                          onAddLog(`[REQUEUE] ตั้งกำหนดเวลาส่งงานใหม่เรียบร้อย: "${wf.title}"`, 'SchedulerService', 'info');
                        }}
                        className="bg-bg-dark hover:bg-teal-muted/20 border border-teal-muted/30 text-teal-accent font-black text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        title="นำกลับเข้าคิวทำงานใหม่"
                      >
                        <RotateCcw className="w-3 h-3" />
                        ตั้งเวลาใหม่
                      </button>
                    </div>
                  )}

                  {wf.status === 'queued' && (
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-teal-muted flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        {wf.scheduledTime}
                      </span>

                      <button
                        onClick={() => handleStartQueue(wf.id)}
                        className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-[10px] px-3.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        title="เริ่มรันอัปโหลดวิดีโอ"
                        disabled={processingId !== null}
                      >
                        <Play className="w-3 h-3 fill-bg-dark" />
                        อัปโหลด
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
