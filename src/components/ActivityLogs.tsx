import { FarmingLog } from '../types';
import { History, Trash2, CalendarClock } from 'lucide-react';

interface ActivityLogsProps {
  logs: FarmingLog[];
  onClearLogs: () => void;
}

export default function ActivityLogs({ logs, onClearLogs }: ActivityLogsProps) {
  return (
    <div className="glass p-6 rounded-2xl" id="activity-logs-panel">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-teal-muted/15">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-teal-accent" />
          <div>
            <h3 className="text-sm font-bold text-white">บันทึกประวัติการทำงาน (Farming Logs)</h3>
            <p className="text-[11px] text-teal-muted">ประวัติกิจกรรมการปัดฟีดและการปรับปรุงระบบ</p>
          </div>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="text-[10px] text-teal-muted hover:text-rose-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ล้างประวัติ
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8 text-teal-muted">
          <CalendarClock className="w-8 h-8 mx-auto text-teal-muted/20 mb-2" />
          <p className="text-xs">ยังไม่มีบันทึกประวัติกิจกรรมในเซสชันนี้</p>
          <p className="text-[10px] text-teal-muted mt-1">กิจกรรมที่คุณกดเช็คลิสต์หรือสลับ IP จะบันทึกที่นี่</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1" id="logs-container">
          {logs.map((log) => {
            const isRotate = log.taskType === 'rotate_ip';
            const isCreate = log.taskType === 'create';
            
            return (
              <div 
                key={log.id} 
                className="text-xs py-2 px-3 rounded-lg border border-teal-muted/10 flex justify-between items-start gap-3 bg-bg-dark/50"
              >
                <div>
                  <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md mr-2 ${
                    isRotate 
                      ? 'bg-teal-accent/20 text-teal-accent border border-teal-accent/30' 
                      : isCreate
                      ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-500/20'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {isRotate ? 'IP' : isCreate ? 'สร้างบัญชี' : 'ฟาร์ม'}
                  </span>
                  <span className="font-semibold text-text-primary font-mono">#{log.accountId.toString().padStart(2, '0')}</span>{' '}
                  <span className="text-text-secondary">{log.description}</span>
                </div>
                <span className="text-[10px] text-teal-muted/85 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('th-TH')}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
