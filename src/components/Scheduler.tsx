import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Play, 
  CheckCircle, 
  Video, 
  Plus, 
  Eye, 
  Clock, 
  AlertTriangle, 
  FileCode, 
  Pause, 
  Square, 
  CheckSquare, 
  XCircle, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Shuffle, 
  Crop, 
  Upload, 
  HelpCircle, 
  Grid, 
  List, 
  Sliders,
  Sparkles
} from 'lucide-react';
import { PublishWorkflow, CreatorAccount, SystemLog } from '../types';

interface SchedulerProps {
  workflows: PublishWorkflow[];
  accounts: CreatorAccount[];
  onAddWorkflow: (wf: PublishWorkflow) => void;
  onUpdateWorkflow: (id: string, updated: Partial<PublishWorkflow>) => void;
  onReorderWorkflows: (newList: PublishWorkflow[]) => void;
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

export interface RetryState {
  attempts: number;
  max: number;
  status: 'idle' | 'waiting' | 'retrying' | 'exhausted';
  countdown: number;
}

export default function Scheduler({
  workflows,
  accounts,
  onAddWorkflow,
  onUpdateWorkflow,
  onReorderWorkflows,
  onAddLog
}: SchedulerProps) {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showForm, setShowForm] = useState(false);

  // Single / Cross-posting creation states
  const [newTitle, setNewTitle] = useState('');
  const [selectedAccIds, setSelectedAccIds] = useState<string[]>([]);
  const [newType, setNewType] = useState<'video' | 'short_video' | 'image_post'>('video');
  const [newTime, setNewTime] = useState('2026-07-21 18:00:00');
  const [videoPath, setVideoPath] = useState('');
  const [autoCrop, setAutoCrop] = useState<'none' | '916' | '169'>('916');

  // Batch upload state
  const [batchFiles, setBatchFiles] = useState<{ name: string; size: string; path: string }[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Active Processing states
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Smart Auto-Retry state mapping: workflowId -> RetryState
  const [retries, setRetries] = useState<Record<string, RetryState>>({});
  const [maxRetriesConfig, setMaxRetriesConfig] = useState<number>(3);
  const [baseBackoffConfig, setBaseBackoffConfig] = useState<number>(2); // seconds
  const [simulateGlitch, setSimulateGlitch] = useState<boolean>(true);

  // Bulk Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Ref to always read the freshest states inside setInterval loops
  const workflowsRef = useRef(workflows);
  useEffect(() => {
    workflowsRef.current = workflows;
  }, [workflows]);

  const retriesRef = useRef(retries);
  useEffect(() => {
    retriesRef.current = retries;
  }, [retries]);

  // Bulk selection functions
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

  // Re-ordering queue item handler (Manual Drag-and-Drop simulation)
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...workflows];
    const temp = newList[index];
    newList[index] = newList[index - 1];
    newList[index - 1] = temp;
    onReorderWorkflows(newList);
    onAddLog(`[REORDER] เลื่อนลำดับคิวงาน "${temp.title}" ขึ้นด้านบน`, 'SchedulerService', 'info');
  };

  const handleMoveDown = (index: number) => {
    if (index === workflows.length - 1) return;
    const newList = [...workflows];
    const temp = newList[index];
    newList[index] = newList[index + 1];
    newList[index + 1] = temp;
    onReorderWorkflows(newList);
    onAddLog(`[REORDER] เลื่อนลำดับคิวงาน "${temp.title}" ลงด้านล่าง`, 'SchedulerService', 'info');
  };

  // Batch Upload File Drop Handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files);
      const newFiles = filesArr.map((f: any) => ({
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        path: `/Media/batch_upload/${f.name}`
      }));
      setBatchFiles((prev) => [...prev, ...newFiles]);
      onAddLog(`[BATCH UPLOAD] ลากวางไฟล์วิดีโอเข้าเตรียมคิวสำเร็จจำนวน ${filesArr.length} ไฟล์`, 'MainProcess', 'info');
    }
  };

  const handleConfirmBatchUpload = () => {
    if (batchFiles.length === 0) return;
    if (selectedAccIds.length === 0 && accounts.length > 0) {
      setSelectedAccIds([accounts[0].id]);
    }

    const accsToPost = selectedAccIds.length > 0 ? selectedAccIds : [accounts[0]?.id];

    batchFiles.forEach((file) => {
      accsToPost.forEach((accId) => {
        const acc = accounts.find((a) => a.id === accId);
        if (!acc) return;

        const newWf: PublishWorkflow = {
          id: 'wf-batch-' + Math.floor(Math.random() * 9999),
          title: `[Batch] โพสต์ด่วนไฟล์ ${file.name.split('.')[0]}`,
          accountId: accId,
          platform: acc.platform,
          contentType: file.name.endsWith('.png') || file.name.endsWith('.jpg') ? 'image_post' : 'short_video',
          scheduledTime: newTime,
          status: 'queued',
          progress: 0,
          videoPath: file.path,
          description: `จัดทำผ่านระบบอัปโหลดทีละกลุ่มความละเอียดสูง (Batch Upload Channel)`
        };
        onAddWorkflow(newWf);
      });
    });

    onAddLog(`[BATCH SCHEDULER] ลงทะเบียนคิวงานอัปโหลดสำเร็จรวม ${batchFiles.length * accsToPost.length} รายการ (Cross-posted)`, 'SchedulerService', 'info');
    setBatchFiles([]);
    setShowForm(false);
  };

  // Upload/Progress Simulation Engine with AUTO-RETRY Trigger
  useEffect(() => {
    if (processingId) {
      const interval = setInterval(() => {
        const currentWf = workflowsRef.current.find((w) => w.id === processingId);
        if (!currentWf) {
          clearInterval(interval);
          setProcessingId(null);
          return;
        }

        const currentProgress = currentWf.progress || 0;

        // Randomly simulate a glitch at ~50% progress if enabled
        if (simulateGlitch && currentProgress === 50 && Math.random() < 0.45) {
          clearInterval(interval);
          onUpdateWorkflow(processingId, { status: 'failed' });
          onAddLog(`[GLITCH SIMULATED] ตรวจพบเครือข่ายขัดข้อง/Proxy Timeout ระหว่างอัปโหลดงาน: "${currentWf.title}"`, 'SchedulerService', 'error');
          setProcessingId(null);
          return;
        }

        if (currentProgress >= 100) {
          clearInterval(interval);
          onUpdateWorkflow(processingId, { status: 'completed', progress: 100 });
          onAddLog(`อัปโหลดเสร็จสิ้นเรียบร้อย! คิวงาน ID: ${processingId} (${currentWf.title})`, 'SchedulerService', 'info');
          setProcessingId(null);
        } else {
          const next = Math.min(currentProgress + 10, 100);
          if (next === 100) {
            clearInterval(interval);
            onUpdateWorkflow(processingId, { status: 'completed', progress: 100 });
            onAddLog(`อัปโหลดเสร็จสิ้นเรียบร้อย! คิวงาน ID: ${processingId} (${currentWf.title})`, 'SchedulerService', 'info');
            setProcessingId(null);
          } else {
            onUpdateWorkflow(processingId, { progress: next });
          }
        }
      }, 400);

      return () => clearInterval(interval);
    }
  }, [processingId, simulateGlitch]);

  // Watch for 'failed' workflows to trigger exponential backoff auto-retry
  useEffect(() => {
    const failedWorkflows = workflows.filter((w) => w.status === 'failed');

    failedWorkflows.forEach((wf) => {
      const retryInfo = retriesRef.current[wf.id];
      const attempts = retryInfo ? retryInfo.attempts : 0;

      if (attempts < maxRetriesConfig) {
        // Start waiting for next retry
        const backoffSec = baseBackoffConfig * Math.pow(2, attempts);
        
        onAddLog(
          `[Smart Retry] เตรียมกู้คืนงานอัตโนมัติรอบที่ ${attempts + 1}/${maxRetriesConfig} สำหรับ "${wf.title}" ในอีก ${backoffSec} วินาที (Exponential Backoff)`,
          'SchedulerService',
          'warn'
        );

        // Register wait state
        setRetries((prev) => ({
          ...prev,
          [wf.id]: {
            attempts: attempts + 1,
            max: maxRetriesConfig,
            status: 'waiting',
            countdown: backoffSec
          }
        }));

        onUpdateWorkflow(wf.id, { status: 'paused' }); // Temporarily pause it while waiting
      } else if (retryInfo && retryInfo.status !== 'exhausted' && retryInfo.status !== 'idle') {
        // Retries exhausted
        onAddLog(`[Smart Retry] คิวงานขัดข้องถาวร: "${wf.title}" พยายามอัปโหลดใหม่ครบ ${maxRetriesConfig} ครั้งแล้วล้มเหลว`, 'SchedulerService', 'error');
        setRetries((prev) => ({
          ...prev,
          [wf.id]: {
            ...prev[wf.id],
            status: 'exhausted'
          }
        }));
        onUpdateWorkflow(wf.id, { status: 'failed' });
      }
    });
  }, [workflows, maxRetriesConfig, baseBackoffConfig]);

  // Handle countdown timers for retry waiting list
  useEffect(() => {
    const timer = setInterval(() => {
      const activeWaitingIds = Object.keys(retries).filter(
        (id) => retries[id].status === 'waiting'
      );

      activeWaitingIds.forEach((id) => {
        const item = retries[id];
        if (item.countdown <= 1) {
          // Trigger actual retry now!
          onAddLog(`[Smart Retry] ทำการเชื่อมต่อ Proxy เส้นใหม่และเริ่ม Retry ด่วน คิวงาน ID: ${id}`, 'SchedulerService', 'info');
          
          setRetries((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              status: 'retrying',
              countdown: 0
            }
          }));

          // Re-trigger running status
          onUpdateWorkflow(id, { status: 'running', progress: 0 });
          setProcessingId(id);
        } else {
          setRetries((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              countdown: item.countdown - 1
            }
          }));
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retries]);

  // Handle Create Workflow submission
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) {
      alert('กรุณากรอกข้อมูลหัวข้อ/แคปชั่นวิดีโอ');
      return;
    }

    if (selectedAccIds.length === 0) {
      alert('กรุณาเลือกบัญชีผู้ใช้สำหรับโพสต์อย่างน้อย 1 ช่องทาง');
      return;
    }

    // Creating multi-platform cross-posting workflows!
    selectedAccIds.forEach((accId) => {
      const acc = accounts.find((a) => a.id === accId);
      if (!acc) return;

      const newWf: PublishWorkflow = {
        id: 'wf-' + Math.floor(Math.random() * 9999),
        title: newTitle,
        accountId: accId,
        platform: acc.platform,
        contentType: newType,
        scheduledTime: newTime,
        status: 'queued',
        progress: 0,
        videoPath: videoPath || `/Media/renders/${acc.platform}_export_${Math.floor(Math.random() * 5) + 1}.mp4`,
        description: `ระบบจัดคิวส่งงานอัตโนมัติ ${autoCrop !== 'none' ? `| Auto-cropped (${autoCrop === '916' ? '9:16 vertical' : '16:9 landscape'})` : ''}`
      };
      onAddWorkflow(newWf);
    });

    onAddLog(
      `[CROSS-POSTING] ทำสำเนาคิวงาน "${newTitle}" ไปยังบัญชีเป้าหมายสำเร็จรวม ${selectedAccIds.length} แพลตฟอร์ม`, 
      'SchedulerService', 
      'info'
    );

    // Reset
    setNewTitle('');
    setVideoPath('');
    setSelectedAccIds([]);
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
    onUpdateWorkflow(id, { status: 'running', progress: 0 });
    onAddLog(`[START] กำลังประมวลผลคิวงานอัปโหลด: "${wf.title}" สำหรับ @${accounts.find(a => a.id === wf.accountId)?.username || 'user'}`, 'SchedulerService', 'info');
  };

  const toggleSelectAccount = (id: string) => {
    setSelectedAccIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Pre-calculate days for Weekly Calendar View
  const getWeekDates = () => {
    const dates = [];
    const baseDate = new Date('2026-07-20'); // Start from July 20, 2026 (Monday of current project timeline)
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const weekDays = getWeekDates();

  const handleCalendarShiftDate = (wfId: string, daysOffset: number) => {
    const wf = workflows.find(w => w.id === wfId);
    if (!wf) return;

    const currentParts = wf.scheduledTime.split(' ');
    const dateParts = currentParts[0].split('-');
    const currentDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
    currentDate.setDate(currentDate.getDate() + daysOffset);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const newScheduledTime = `${year}-${month}-${day} ${currentParts[1] || '12:00:00'}`;

    onUpdateWorkflow(wfId, { scheduledTime: newScheduledTime });
    onAddLog(`[CALENDAR INTERACTIVE] เลื่อนวันโพสต์งาน "${wf.title}" เป็นวันที่ ${newScheduledTime}`, 'SchedulerService', 'info');
  };

  return (
    <div className="glass p-6 rounded-2xl" id="workflow-scheduler-panel">
      
      {/* Header and Control Tabs */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-accent" />
            Advanced Workflow Queue &amp; Scheduler Pro
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            ระบบจัดการคิวงานข้ามสลับแพลตฟอร์ม ออโต้รีไทรและตารางเวลาแบบอินเตอร์แอคทีฟ
          </p>
        </div>

        {/* View togglers & buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-bg-dark border border-teal-muted/20 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === 'list' ? 'bg-teal-accent text-bg-dark font-black' : 'text-teal-muted hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                viewMode === 'calendar' ? 'bg-teal-accent text-bg-dark font-black' : 'text-teal-muted hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Calendar Grid
            </button>
          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              if (accounts.length > 0 && selectedAccIds.length === 0) {
                setSelectedAccIds([accounts[0].id]);
              }
            }}
            className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-[0_0_12px_rgba(102,252,241,0.25)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'ปิดส่วนสร้างคิว' : 'จัดแผนอัปโหลดใหม่ (Cross-Post)'}
          </button>
        </div>
      </div>

      {/* Stats and smart configs Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        
        {/* Count indicators */}
        <div className="bg-bg-dark/40 border border-teal-muted/10 p-3.5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-teal-muted font-bold font-mono uppercase tracking-wider block">Queued Tasks</span>
            <span className="text-2xl font-black text-white block mt-0.5">{workflows.filter(w => w.status === 'queued').length}</span>
          </div>
          <Clock className="w-6 h-6 text-teal-muted/40" />
        </div>

        <div className="bg-bg-dark/40 border border-teal-accent/20 p-3.5 rounded-xl flex items-center justify-between relative overflow-hidden">
          {processingId && <div className="absolute right-2 top-2 w-1.5 h-1.5 bg-teal-accent rounded-full animate-ping" />}
          <div>
            <span className="text-[10px] text-teal-muted font-bold font-mono uppercase tracking-wider block">Uploading Status</span>
            <span className="text-2xl font-black text-teal-accent block mt-0.5">
              {processingId ? `1 RUNNING` : `IDLE`}
            </span>
          </div>
          <Play className="w-6 h-6 text-teal-accent/40" />
        </div>

        {/* Retry Configuration Panel */}
        <div className="md:col-span-2 bg-indigo-500/5 border border-indigo-500/15 p-3 rounded-xl text-xs space-y-2">
          <div className="flex justify-between items-center pb-1 border-b border-indigo-500/10">
            <span className="font-bold text-white font-mono flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              SMART AUTO-RETRY DAEMON CONFIG
            </span>
            <button
              onClick={() => setSimulateGlitch(!simulateGlitch)}
              className={`text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                simulateGlitch 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30' 
                  : 'bg-teal-accent/15 text-teal-accent border-teal-accent/30 hover:bg-teal-accent/25'
              }`}
            >
              {simulateGlitch ? '● Glitch Simulation: Active' : '○ Glitch Simulation: Disabled'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div className="flex justify-between items-center bg-bg-dark/55 px-2 py-1 rounded">
              <span className="text-teal-muted">Max Retries (ครั้ง):</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <button onClick={() => setMaxRetriesConfig(Math.max(1, maxRetriesConfig - 1))} className="hover:text-teal-accent px-1">─</button>
                <span>{maxRetriesConfig}</span>
                <button onClick={() => setMaxRetriesConfig(Math.min(5, maxRetriesConfig + 1))} className="hover:text-teal-accent px-1">＋</button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-bg-dark/55 px-2 py-1 rounded">
              <span className="text-teal-muted">Base Backoff (วินาที):</span>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <button onClick={() => setBaseBackoffConfig(Math.max(1, baseBackoffConfig - 1))} className="hover:text-teal-accent px-1">─</button>
                <span>{baseBackoffConfig}s</span>
                <button onClick={() => setBaseBackoffConfig(Math.min(10, baseBackoffConfig + 1))} className="hover:text-teal-accent px-1">＋</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Creation and Batch Upload Form */}
      {showForm && (
        <div className="bg-bg-dark/60 border border-teal-muted/15 p-5 rounded-xl mb-6 space-y-4 animate-fade-in">
          
          {/* Sub-tabs: Single Form vs Batch Upload Drag & Drop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left side: Standard Form + Multi-Platform Cross-Posting */}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="flex items-center gap-1 pb-1.5 border-b border-teal-muted/10">
                <Sparkles className="w-4 h-4 text-teal-accent" />
                <span className="text-xs font-bold text-white">Multi-Platform Cross-Posting Scheduler</span>
              </div>

              {/* Multi-Account Selection Checkboxes */}
              <div className="space-y-1.5">
                <label className="text-teal-muted text-[10px] block font-bold font-mono">ส่งวิดีโอเข้าช่องทางทั้งหมดต่อไปนี้ (Select Platform Accounts):</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {accounts.map((acc) => {
                    const isChecked = selectedAccIds.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => toggleSelectAccount(acc.id)}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between text-[11px] transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-teal-accent/15 border-teal-accent text-white font-bold' 
                            : 'bg-bg-dark/40 border-teal-muted/10 text-teal-muted hover:border-teal-muted/30'
                        }`}
                      >
                        <span className="truncate">@{acc.username}</span>
                        <span className="text-[9px] uppercase font-mono px-1 bg-bg-dark rounded border border-teal-muted/10">{acc.platform}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">หัวข้อ/แคปชั่นที่ต้องการโพสต์</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="เช่น รีวิวเปิดตัวสินค้าใหม่ล่าสุด #affiliate"
                      className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none"
                      required={selectedAccIds.length > 0}
                    />
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ประเภทคอนเทนต์</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="video">วิดีโอยาว (16:9)</option>
                      <option value="short_video">คลิปสั้น / Reels / Shorts (9:16)</option>
                      <option value="image_post">ภาพโพสต์ชุดสไลด์ (Image)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ปรับสัดส่วนภาพอัตโนมัติ</label>
                    <div className="flex bg-bg-dark border border-teal-muted/30 rounded-lg p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setAutoCrop('none')}
                        className={`flex-1 text-[10px] py-1 font-bold rounded ${autoCrop === 'none' ? 'bg-teal-accent text-bg-dark' : 'text-teal-muted'}`}
                      >
                        Keep 1:1
                      </button>
                      <button
                        type="button"
                        onClick={() => setAutoCrop('916')}
                        className={`flex-1 text-[10px] py-1 font-bold rounded ${autoCrop === '916' ? 'bg-teal-accent text-bg-dark' : 'text-teal-muted'}`}
                      >
                        Crop 9:16
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-teal-muted text-[10px] block mb-1 font-bold font-mono">ที่อยู่ไฟล์สื่อ (Media Path)</label>
                    <input
                      type="text"
                      value={videoPath}
                      onChange={(e) => setVideoPath(e.target.value)}
                      placeholder=" renders/output_1.mp4"
                      className="w-full bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-lg p-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer text-xs uppercase"
              >
                บันทึกกำหนดส่ง {selectedAccIds.length > 0 ? `${selectedAccIds.length} คิวงานข้ามระบบ` : ''} (Save Cross-Post Schedule)
              </button>
            </form>

            {/* Right side: Batch Upload & Drag-and-Drop Area */}
            <div className="space-y-4 border-l border-teal-muted/10 pl-0 md:pl-6">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-teal-muted/10">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Batch Upload Area (ดึงคิวอัปโหลดทีละกลุ่ม)</span>
              </div>

              {/* Drag Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropFiles}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  isDragOver 
                    ? 'border-teal-accent bg-teal-accent/5 scale-95 shadow-md' 
                    : 'border-teal-muted/30 bg-bg-dark/20 hover:border-teal-accent/40'
                }`}
              >
                <Upload className="w-8 h-8 text-teal-muted/50 mx-auto mb-2 animate-bounce" />
                <span className="text-xs text-white font-bold block">ลากไฟล์คลิปหรือรูปมาวางที่นี่ (Drag &amp; Drop)</span>
                <span className="text-[10px] text-teal-muted block mt-1">รองรับการอัปโหลดวิดีโอหลายไฟล์พร้อมกันเพื่อประหยัดเวลา</span>
              </div>

              {/* Added batch files list */}
              {batchFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-teal-muted font-bold">ไฟล์สื่อในคิวกลุ่ม ({batchFiles.length} รายการ):</span>
                    <button onClick={() => setBatchFiles([])} className="text-rose-400 hover:underline">ล้างทั้งหมด</button>
                  </div>

                  <div className="max-h-[120px] overflow-y-auto space-y-1 bg-bg-dark/50 p-2 rounded-lg border border-teal-muted/10 text-[11px]">
                    {batchFiles.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-teal-muted/5 last:border-0 font-mono">
                        <span className="text-white truncate max-w-[180px]">#0{idx+1} {file.name}</span>
                        <span className="text-teal-accent text-[9px] font-bold">{file.size}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmBatchUpload}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg text-xs transition-all active:scale-95"
                  >
                    ลงทะเบียนคิวกลุ่ม (Confirm Batch Publish)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Bulk Action Panel (Always shown if workflows exist) */}
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

      {/* RENDER VIEW: LIST MODE VS INTERACTIVE WEEKLY CALENDAR MODE */}
      {viewMode === 'list' ? (
        <div className="space-y-3" id="workflows-queue-list">
          {workflows.length === 0 ? (
            <div className="text-center py-8 text-teal-muted bg-bg-dark/20 rounded-xl border border-dashed border-teal-muted/15">
              <Clock className="w-8 h-8 mx-auto mb-2 text-teal-muted/20 animate-pulse" />
              <p className="text-xs">ยังไม่มีคิวอัปโหลดกำหนดการงานในระบบ</p>
              <p className="text-[10px] text-teal-muted/70 mt-1">กดปุ่มจัดแผนอัปโหลดใหม่ด้านบนเพื่อเพิ่มคิวงาน</p>
            </div>
          ) : (
            workflows.map((wf, idx) => {
              const acc = accounts.find((a) => a.id === wf.accountId);
              const isSelected = selectedIds.includes(wf.id);
              const retryInfo = retries[wf.id];

              return (
                <div
                  key={wf.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    wf.status === 'completed'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : wf.status === 'running'
                      ? 'bg-teal-accent/10 border-teal-accent/35 shadow-[0_0_10px_rgba(102,252,241,0.05)]'
                      : wf.status === 'paused' && retryInfo?.status === 'waiting'
                      ? 'bg-indigo-500/10 border-indigo-500/30 animate-pulse'
                      : wf.status === 'paused'
                      ? 'bg-amber-500/5 border-amber-500/25'
                      : wf.status === 'failed'
                      ? 'bg-rose-500/5 border-rose-500/20'
                      : 'bg-bg-dark/40 border-teal-muted/15'
                  }`}
                >
                  {/* Left block Info + Checkbox */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    
                    {/* Move Up / Down order reordering buttons */}
                    <div className="flex flex-col gap-1 mr-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="text-teal-muted/40 hover:text-teal-accent disabled:opacity-20 disabled:hover:text-teal-muted/40 transition-colors cursor-pointer"
                        title="Move Up in Queue"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === workflows.length - 1}
                        className="text-teal-muted/40 hover:text-teal-accent disabled:opacity-20 disabled:hover:text-teal-muted/40 transition-colors cursor-pointer"
                        title="Move Down in Queue"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

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

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-white truncate max-w-[280px]">
                          {wf.title}
                        </h4>
                        <span className="text-[9px] bg-bg-dark text-teal-muted px-2 py-0.5 rounded-full font-mono font-bold uppercase border border-teal-muted/10 shrink-0">
                          {wf.contentType}
                        </span>
                        {wf.status === 'paused' && retryInfo?.status === 'waiting' && (
                          <span className="text-[8px] bg-indigo-500 text-white px-1.5 py-0.2 rounded font-mono font-bold animate-pulse">
                            RETRY WAITING ({retryInfo.countdown}s)
                          </span>
                        )}
                        {wf.status === 'paused' && !retryInfo && (
                          <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            PAUSED
                          </span>
                        )}
                        {wf.status === 'failed' && (
                          <span className="text-[8px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                            GLITCH DETECTED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-teal-muted leading-relaxed">
                        ผู้ดูแล: <strong className="text-text-primary">@{acc ? acc.username : 'ไม่ระบุ'}</strong> ({wf.platform}) | ไฟล์: <code className="text-teal-accent font-mono text-[9px]">{wf.videoPath}</code>
                      </p>
                    </div>
                  </div>

                  {/* Right Status Actions / Simulation Progress bar */}
                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-teal-muted/10 justify-between sm:justify-end">
                    
                    {/* Retry countdown overlay */}
                    {wf.status === 'paused' && retryInfo?.status === 'waiting' && (
                      <div className="w-36 text-right">
                        <div className="flex justify-between text-[9px] font-mono text-indigo-400 mb-0.5">
                          <span>Auto-Retrying...</span>
                          <span>{retryInfo.countdown}s</span>
                        </div>
                        <div className="w-full bg-bg-dark h-1 rounded-full overflow-hidden border border-indigo-500/10">
                          <div 
                            style={{ width: `${(retryInfo.countdown / (baseBackoffConfig * Math.pow(2, retryInfo.attempts - 1))) * 100}%` }} 
                            className="bg-indigo-400 h-full transition-all duration-1000 ease-linear"
                          />
                        </div>
                      </div>
                    )}

                    {wf.status === 'completed' && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        อัปโหลดสำเร็จ
                      </span>
                    )}

                    {wf.status === 'running' && (
                      <div className="flex flex-col items-end gap-1.5 w-32">
                        <span className="text-[10px] text-teal-accent flex items-center gap-1 font-mono animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          กำลังโพสต์... {wf.progress}%
                        </span>
                        <div className="w-full bg-bg-dark h-1 rounded-full overflow-hidden border border-teal-accent/20">
                          <div style={{ width: `${wf.progress}%` }} className="bg-teal-accent h-full transition-all duration-300" />
                        </div>
                      </div>
                    )}

                    {wf.status === 'paused' && !retryInfo && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                          <Pause className="w-3.5 h-3.5" />
                          ระงับ
                        </span>
                        <button
                          onClick={() => {
                            onUpdateWorkflow(wf.id, { status: 'queued' });
                            onAddLog(`[RESUME] เปิดใช้งานคิวงานอัปโหลดสำเร็จ: "${wf.title}"`, 'SchedulerService', 'info');
                          }}
                          className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-[9px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-bg-dark" />
                          Resume
                        </button>
                      </div>
                    )}

                    {wf.status === 'failed' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                          <XCircle className="w-3.5 h-3.5" />
                          ล้มเหลว
                        </span>
                        <button
                          onClick={() => {
                            onUpdateWorkflow(wf.id, { status: 'queued' });
                            onAddLog(`[REQUEUE] บังคับนำคิวงานกลับมาเข้าคิวประมวลผลใหม่: "${wf.title}"`, 'SchedulerService', 'info');
                          }}
                          className="bg-bg-dark hover:bg-teal-muted/20 border border-teal-muted/30 text-teal-accent font-black text-[9px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Re-queue
                        </button>
                      </div>
                    )}

                    {wf.status === 'queued' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-teal-muted flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {wf.scheduledTime.split(' ')[1] || 'Pending'}
                        </span>
                        <button
                          onClick={() => handleStartQueue(wf.id)}
                          className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-[9px] px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-bg-dark" />
                          Start Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* INTERACTIVE WEEKLY CALENDAR VIEW */
        <div className="space-y-4 animate-fade-in" id="workflows-calendar-view">
          <div className="bg-bg-dark/40 border border-teal-muted/15 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-teal-muted/10">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-teal-accent" />
                ตารางงานประจำสัปดาห์ (July 2026 Interactive Weekly Planner)
              </span>
              <span className="text-teal-muted font-mono text-[10px]">ลากเปลี่ยนวันหรือตั้งค่าด่วนจากคิวงานได้ตรงนี้</span>
            </div>

            {/* 7-Day Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 h-[420px] overflow-x-auto min-w-[800px]">
              {weekDays.map((day, idx) => {
                const year = day.getFullYear();
                const month = String(day.getMonth() + 1).padStart(2, '0');
                const dayStr = String(day.getDate()).padStart(2, '0');
                const dateKey = `${year}-${month}-${dayStr}`;

                // Filter workflows for this date
                const dayWorkflows = workflows.filter(
                  (w) => w.scheduledTime.startsWith(dateKey)
                );

                const isToday = dayStr === '21'; // Project timeline represents 21 July 2026 as current day

                return (
                  <div 
                    key={idx} 
                    className={`bg-bg-dark/65 border rounded-xl p-2.5 flex flex-col justify-between space-y-2 h-full transition-all ${
                      isToday 
                        ? 'border-teal-accent shadow-[0_0_12px_rgba(102,252,241,0.05)] bg-teal-accent/5' 
                        : 'border-teal-muted/10'
                    }`}
                  >
                    {/* Day Header */}
                    <div className="flex justify-between items-center pb-1.5 border-b border-teal-muted/10">
                      <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${isToday ? 'text-teal-accent' : 'text-teal-muted'}`}>
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                      <span className={`text-xs font-black font-mono px-1.5 py-0.2 rounded-md ${
                        isToday ? 'bg-teal-accent text-bg-dark' : 'text-white'
                      }`}>
                        {day.getDate()}
                      </span>
                    </div>

                    {/* Day Workflows list */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 max-h-[300px]">
                      {dayWorkflows.length === 0 ? (
                        <div className="text-center py-6 text-teal-muted/30 text-[9px] font-medium border border-dashed border-teal-muted/5 rounded-lg flex flex-col items-center justify-center h-full">
                          <span>ว่าง</span>
                        </div>
                      ) : (
                        dayWorkflows.map((w) => (
                          <div 
                            key={w.id} 
                            className={`p-1.5 rounded-lg text-[10px] border relative space-y-1 ${
                              w.status === 'completed'
                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                                : w.status === 'running'
                                ? 'bg-teal-accent/10 border-teal-accent text-teal-accent'
                                : w.status === 'paused'
                                ? 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                                : 'bg-bg-dark border-teal-muted/15 text-white'
                            }`}
                          >
                            <p className="font-bold truncate" title={w.title}>{w.title}</p>
                            
                            <div className="flex justify-between items-center text-[8px] font-mono text-teal-muted">
                              <span>{w.scheduledTime.split(' ')[1]?.substring(0, 5) || '12:00'}</span>
                              <span className="uppercase text-teal-accent font-bold bg-teal-accent/10 px-1 rounded">{w.platform}</span>
                            </div>

                            {/* Reschedule Interactive buttons inside cell */}
                            <div className="flex justify-between items-center pt-1 border-t border-teal-muted/5">
                              <button 
                                onClick={() => handleCalendarShiftDate(w.id, -1)}
                                className="text-[9px] text-teal-muted hover:text-white"
                                title="Move back 1 day"
                              >
                                ◀
                              </button>
                              <span className="text-[7px] text-teal-muted font-mono uppercase">Shift Day</span>
                              <button 
                                onClick={() => handleCalendarShiftDate(w.id, 1)}
                                className="text-[9px] text-teal-muted hover:text-white"
                                title="Move forward 1 day"
                              >
                                ▶
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer counter */}
                    <div className="pt-1.5 border-t border-teal-muted/5 flex justify-between items-center text-[9px] text-teal-muted">
                      <span>Total Tasks</span>
                      <strong className="text-white font-mono">{dayWorkflows.length}</strong>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
