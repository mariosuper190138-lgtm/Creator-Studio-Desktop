import { TikTokAccount } from '../types';
import { CheckCircle2, AlertCircle, Award, Compass } from 'lucide-react';

interface OverviewStatsProps {
  accounts: TikTokAccount[];
}

export default function OverviewStats({ accounts }: OverviewStatsProps) {
  const totalAccounts = accounts.length;
  const createdAccountsCount = accounts.filter(a => a.isCreated).length;
  const pendingAccountsCount = totalAccounts - createdAccountsCount;

  // คำนวณความคืบหน้าของงานวันนี้
  // คิดเป็นเปอร์เซ็นต์ของบัญชีที่สร้างแล้วเท่านั้น
  const activeAccounts = accounts.filter(a => a.isCreated);
  const totalFarmingTasks = activeAccounts.length * 3; // 3 งานหลักต่อบัญชี (Scroll, Watch, Like)
  
  let completedFarmingTasks = 0;
  activeAccounts.forEach(acc => {
    if (acc.dailyTasks.scrollFeed) completedFarmingTasks++;
    if (acc.dailyTasks.watchFullVideo) completedFarmingTasks++;
    if (acc.dailyTasks.likeAndComment) completedFarmingTasks++;
  });

  const completionRate = totalFarmingTasks > 0 
    ? Math.round((completedFarmingTasks / totalFarmingTasks) * 100) 
    : 0;

  // สถิติสถานะบัญชี
  const readyCount = accounts.filter(a => a.isCreated && a.status === 'ready').length;
  const farmingCount = accounts.filter(a => a.isCreated && a.status === 'farming').length;
  const newCount = accounts.filter(a => a.isCreated && a.status === 'new').length;
  const shadowbannedCount = accounts.filter(a => a.status === 'shadowbanned').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" id="overview-stats-grid">
      {/* การฟาร์มวันนี้ */}
      <div className="glass p-6 rounded-2xl relative overflow-hidden" id="stat-card-today-progress">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-teal-muted tracking-wider uppercase">ความคืบหน้าฟาร์มวันนี้</p>
            <h3 className="text-3xl font-bold text-white mt-1">{completionRate}%</h3>
          </div>
          <span className="p-2.5 bg-teal-accent/10 text-teal-accent rounded-xl border border-teal-accent/20">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-bg-dark h-2 rounded-full overflow-hidden mb-2">
          <div 
            className="bg-teal-accent h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(102,252,241,0.5)]"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-text-secondary">
          ทำสำเร็จแล้ว <span className="text-white font-medium">{completedFarmingTasks}</span> จาก {totalFarmingTasks} กิจกรรมย่อย
        </p>
      </div>

      {/* บัญชีที่ลงทะเบียนในระบบ */}
      <div className="glass p-6 rounded-2xl" id="stat-card-total-accounts">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold text-teal-muted tracking-wider uppercase">การสร้างบัญชี (เป้าหมาย 40)</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {createdAccountsCount} <span className="text-sm font-normal text-teal-muted">/ 40 โปรไฟล์</span>
            </h3>
          </div>
          <span className="p-2.5 bg-teal-accent/10 text-teal-accent rounded-xl border border-teal-accent/20">
            <Compass className="w-5 h-5" />
          </span>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
            <span className="text-text-secondary font-medium">สร้างแล้ว {createdAccountsCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block shadow-[0_0_5px_rgba(245,158,11,0.5)]"></span>
            <span className="text-teal-muted">เหลือรอสร้าง {pendingAccountsCount}</span>
          </div>
        </div>
      </div>

      {/* สถานะสุขภาพไอดี */}
      <div className="glass p-6 rounded-2xl md:col-span-2" id="stat-card-health-status">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs font-semibold text-teal-muted tracking-wider uppercase">สุขภาพบัญชีที่ฟาร์ม</p>
            <p className="text-xs text-teal-muted/70 mt-0.5">สถานะความพร้อมเพื่อใช้อัปโหลดงานจริง</p>
          </div>
          <span className="p-2.5 bg-teal-accent/10 text-teal-accent rounded-xl border border-teal-accent/20">
            <Award className="w-5 h-5" />
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <span className="text-lg font-bold text-emerald-400 block">{readyCount}</span>
            <span className="text-[10px] font-medium text-emerald-400/90 block">แข็งแรง (Ready)</span>
          </div>
          <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
            <span className="text-lg font-bold text-blue-400 block">{farmingCount}</span>
            <span className="text-[10px] font-medium text-blue-400/90 block">กำลังฟาร์ม (Farming)</span>
          </div>
          <div className="bg-slate-500/15 p-2.5 rounded-xl border border-slate-500/20">
            <span className="text-lg font-bold text-text-secondary block">{newCount}</span>
            <span className="text-[10px] font-medium text-text-secondary/90 block">เพิ่งสมัคร (New)</span>
          </div>
          <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            <span className="text-lg font-bold text-rose-400 block">{shadowbannedCount}</span>
            <span className="text-[10px] font-medium text-rose-400/90 block">เสี่ยงแบน (Banned)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
