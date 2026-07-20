import { NotificationItem } from '../types';
import { Bell, Info, AlertTriangle, CheckCircle, Trash2, Check, ShieldAlert } from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onDismiss: (id: string) => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onClearAll,
  onDismiss
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="glass p-6 rounded-2xl" id="notification-center-panel">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-teal-muted/15">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-teal-accent" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-extrabold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">ระบบแจ้งเตือนกิจกรรมฟาร์ม (Live Alerts)</h3>
            <p className="text-[11px] text-teal-muted">คำเตือนความปลอดภัยและการจัดสรรคิวประจำวัน</p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[10px] text-teal-muted hover:text-rose-400 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-teal-muted">
          <CheckCircle className="w-8 h-8 mx-auto text-teal-muted/20 mb-2" />
          <p className="text-xs">ไม่มีแจ้งเตือนค้างอยู่ บัญชีของคุณปลอดภัยดี!</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1" id="notifications-list">
          {notifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border flex gap-3 transition-all relative ${
                  notif.read 
                    ? 'bg-bg-dark/20 border-teal-muted/10 opacity-50' 
                    : 'bg-bg-dark/60 border-teal-muted/25 shadow-sm'
                }`}
              >
                {/* ไอคอนแจ้งเตือนตามหมวดหมู่ */}
                <div className="flex-shrink-0 mt-0.5">
                  {notif.type === 'warning' && <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />}
                  {notif.type === 'alert' && <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />}
                  {notif.type === 'success' && <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />}
                  {notif.type === 'info' && <Info className="w-4.5 h-4.5 text-teal-accent" />}
                </div>

                {/* ข้อความแจ้งเตือน */}
                <div className="flex-1 pr-14">
                  <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
                    {notif.message}
                  </p>
                  <span className="text-[9px] text-teal-muted/70 block mt-1 font-mono">
                    {new Date(notif.timestamp).toLocaleTimeString('th-TH')} น.
                  </span>
                </div>

                {/* ปุ่มควบคุมขวาบน */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  {!notif.read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="p-1 hover:bg-bg-dark text-teal-accent rounded-lg transition-colors cursor-pointer"
                      title="ทำเครื่องหมายว่าอ่านแล้ว"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onDismiss(notif.id)}
                    className="p-1 hover:bg-bg-dark text-teal-muted hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="ลบออก"
                  >
                    <span className="text-[14px] leading-none font-sans block">×</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
