import { TikTokAccount, DailyTasks } from '../types';
import { CheckSquare, Square, Check, Chrome, Plus, ShieldAlert, Award, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface AccountListProps {
  accounts: TikTokAccount[];
  selectedGroupId: number;
  onUpdateAccount: (accountId: number, updatedFields: Partial<TikTokAccount>) => void;
  onLogActivity: (accountId: number, taskType: keyof DailyTasks | 'create', desc: string) => void;
}

export default function AccountList({
  accounts,
  selectedGroupId,
  onUpdateAccount,
  onLogActivity
}: AccountListProps) {
  const filteredAccounts = accounts.filter(acc => acc.groupId === selectedGroupId);
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const handleToggleTask = (account: TikTokAccount, taskKey: keyof DailyTasks) => {
    const updatedTasks = {
      ...account.dailyTasks,
      [taskKey]: !account.dailyTasks[taskKey]
    };
    
    // หากกิจกรรมหลักทำครบแล้ว ถือว่าฟาร์มเสร็จสิ้นในวันนี้
    const lastFarmedDate = updatedTasks.scrollFeed && updatedTasks.watchFullVideo && updatedTasks.likeAndComment
      ? new Date().toISOString().split('T')[0]
      : account.lastFarmedDate;

    onUpdateAccount(account.id, {
      dailyTasks: updatedTasks,
      lastFarmedDate
    });

    // บันทึก Log การฟาร์ม
    const taskNames: Record<keyof DailyTasks, string> = {
      scrollFeed: 'ท่องฟีด 5-10 นาที',
      watchFullVideo: 'ดูวิดีโอจนจบ',
      likeAndComment: 'กดไลก์/คอมเมนต์',
      postVideo: 'โพสต์คลิปวิดีโอ'
    };

    const statusStr = !account.dailyTasks[taskKey] ? 'สำเร็จ' : 'ยกเลิก';
    onLogActivity(
      account.id,
      taskKey,
      `ทำกิจกรรม "${taskNames[taskKey]}" ${statusStr}`
    );
  };

  const handleRegisterProfile = (account: TikTokAccount) => {
    const todayStr = new Date().toISOString().split('T')[0];
    onUpdateAccount(account.id, {
      isCreated: true,
      createdDate: todayStr,
      username: `tiktok.user_${account.id.toString().padStart(2, '0')}`,
      status: 'new',
      notes: 'ลงทะเบียนแล้ววันนี้ผ่านโปรไฟล์ ixBrowser'
    });
    onLogActivity(account.id, 'create', `สร้างและลงทะเบียนโปรไฟล์ไอดีที่ ${account.id} ใน ixBrowser สำเร็จ`);
  };

  const handleStatusChange = (accountId: number, newStatus: TikTokAccount['status']) => {
    onUpdateAccount(accountId, { status: newStatus });
  };

  const startEditNotes = (account: TikTokAccount) => {
    setEditingNotesId(account.id);
    setNotesValue(account.notes);
  };

  const saveNotes = (accountId: number) => {
    onUpdateAccount(accountId, { notes: notesValue });
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6" id="accounts-group-container">
      <div className="flex justify-between items-center" id="account-list-header">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Chrome className="w-5 h-5 text-teal-accent" />
          รายชื่อโปรไฟล์ในกลุ่มที่ {selectedGroupId} ({filteredAccounts.length} บัญชี)
        </h3>
        <p className="text-xs text-teal-muted font-medium">สลับ IP มือถือก่อนเริ่มเปิดโปรไฟล์เหล่านี้</p>
      </div>

      <div className="grid grid-cols-1 gap-6" id="accounts-cards-grid">
        {filteredAccounts.map((account) => {
          const isFarmedToday = account.dailyTasks.scrollFeed && 
                               account.dailyTasks.watchFullVideo && 
                               account.dailyTasks.likeAndComment;

          return (
            <div 
              key={account.id}
              id={`account-card-${account.id}`}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isFarmedToday 
                  ? 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'border-teal-muted/15 bg-card-dark/40 hover:border-teal-muted/30'
              }`}
            >
              {/* แถบหัวการ์ด */}
              <div className="p-5 border-b border-teal-muted/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-bg-dark text-teal-accent font-mono text-xs font-bold flex items-center justify-center border border-teal-muted/20">
                    #{account.id.toString().padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">
                        {account.username}
                      </h4>
                      {isFarmedToday && (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> ฟาร์มครบแล้ว
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-teal-muted font-mono mt-0.5">
                      ixBrowser: <span className="text-text-primary font-semibold">{account.ixProfileName}</span>
                    </p>
                  </div>
                </div>

                {/* สวิตช์เปิดใช้งาน/ลงทะเบียนไอดี */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {!account.isCreated ? (
                    <button
                      onClick={() => handleRegisterProfile(account)}
                      className="flex items-center gap-1.5 bg-teal-accent text-bg-dark font-bold text-xs px-3.5 py-2.5 rounded-lg active:scale-95 transition-all shadow-[0_0_12px_rgba(102,252,241,0.25)] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      สร้างโปรไฟล์ใน ixBrowser
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-teal-muted font-medium">สถานะ:</span>
                      <select
                        value={account.status}
                        onChange={(e) => handleStatusChange(account.id, e.target.value as TikTokAccount['status'])}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-teal-accent/20 cursor-pointer ${
                          account.status === 'ready' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : account.status === 'farming'
                            ? 'bg-teal-accent/10 text-teal-accent border-teal-accent/20'
                            : account.status === 'shadowbanned'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-bg-dark text-text-secondary border-teal-muted/20'
                        }`}
                      >
                        <option value="new">เพิ่งสมัคร (New)</option>
                        <option value="farming">กำลังฟาร์ม (Farming)</option>
                        <option value="ready">แข็งแรงพร้อมใช้อัปงาน (Ready)</option>
                        <option value="shadowbanned">เสี่ยงแบน/Shadowban</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* เนื้อหาการฟาร์มรายวัน */}
              <div className="p-5">
                {!account.isCreated ? (
                  <div className="text-center py-6 bg-bg-dark/30 rounded-xl border border-dashed border-teal-muted/20">
                    <p className="text-xs text-teal-muted font-medium">โปรไฟล์นี้ยังไม่ได้ลงทะเบียนในระบบ</p>
                    <p className="text-[11px] text-teal-muted/70 mt-1">กดปุ่มสีน้ำเงินด้านขวาบนเพื่อจำลองลงทะเบียนหลังจากสร้างใน ixBrowser แล้ว</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* รายการกิจกรรมฟาร์ม (Checkbox) */}
                    <div className="lg:col-span-7 space-y-3">
                      <div className="text-xs font-bold text-teal-muted tracking-wide uppercase mb-2">เช็คลิสต์พฤติกรรมมนุษย์ (Daily Actions)</div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* 1. ท่องฟีด */}
                        <button
                          onClick={() => handleToggleTask(account, 'scrollFeed')}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            account.dailyTasks.scrollFeed 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                              : 'bg-bg-dark/40 border-teal-muted/15 hover:bg-bg-dark/85 text-text-secondary'
                          }`}
                        >
                          {account.dailyTasks.scrollFeed ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-teal-muted/30 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">ท่องฟีดติ๊กต๊อก 5-10 นาที</p>
                            <p className="text-[10px] text-teal-muted mt-0.5">จำลองการปัดดูหน้า For You</p>
                          </div>
                        </button>

                        {/* 2. ดูคลิปจนจบ */}
                        <button
                          onClick={() => handleToggleTask(account, 'watchFullVideo')}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            account.dailyTasks.watchFullVideo 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                              : 'bg-bg-dark/40 border-teal-muted/15 hover:bg-bg-dark/85 text-text-secondary'
                          }`}
                        >
                          {account.dailyTasks.watchFullVideo ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-teal-muted/30 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">ชมวิดีโอจนจบความยาว</p>
                            <p className="text-[10px] text-teal-muted mt-0.5">ไม่ปัดหนีทันที ป้องกันระบบมองเป็นบอท</p>
                          </div>
                        </button>

                        {/* 3. กดถูกใจคอมเมนต์ */}
                        <button
                          onClick={() => handleToggleTask(account, 'likeAndComment')}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            account.dailyTasks.likeAndComment 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                              : 'bg-bg-dark/40 border-teal-muted/15 hover:bg-bg-dark/85 text-text-secondary'
                          }`}
                        >
                          {account.dailyTasks.likeAndComment ? (
                            <CheckSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-teal-muted/30 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">กดไลก์ / แลกเปลี่ยนความเห็น</p>
                            <p className="text-[10px] text-teal-muted mt-0.5">ปฏิสัมพันธ์ 2-3 คลิปต่อไอดี</p>
                          </div>
                        </button>

                        {/* 4. โพสต์คลิป (หากบัญชี Ready) */}
                        <button
                          onClick={() => handleToggleTask(account, 'postVideo')}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            account.dailyTasks.postVideo 
                              ? 'bg-teal-accent/10 border-teal-accent/20 text-teal-accent' 
                              : 'bg-bg-dark/40 border-teal-muted/15 hover:bg-bg-dark/85 text-text-secondary'
                          }`}
                        >
                          {account.dailyTasks.postVideo ? (
                            <CheckSquare className="w-5 h-5 text-teal-accent flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-teal-muted/30 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-bold text-white">โพสต์วิดีโออัปงาน (ทางเลือก)</p>
                            <p className="text-[10px] text-teal-muted mt-0.5">ทำเฉพาะเมื่อฟาร์มตัวตนเสร็จแล้ว</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* หมายเหตุบันทึกและข้อมูลเวลา */}
                    <div className="lg:col-span-5 bg-bg-dark/30 p-4 rounded-xl border border-teal-muted/15 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-teal-muted flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            หมายเหตุ / แผนการเติบโต
                          </span>
                          {editingNotesId !== account.id ? (
                            <button 
                              onClick={() => startEditNotes(account)}
                              className="text-[11px] text-teal-accent hover:underline cursor-pointer"
                            >
                              แก้ไขบันทึก
                            </button>
                          ) : (
                            <button 
                              onClick={() => saveNotes(account.id)}
                              className="text-[11px] text-emerald-400 font-bold hover:underline cursor-pointer"
                            >
                              บันทึก
                            </button>
                          )}
                        </div>

                        {editingNotesId === account.id ? (
                          <textarea
                            value={notesValue}
                            onChange={(e) => setNotesValue(e.target.value)}
                            className="w-full text-xs p-2 rounded-lg border border-teal-muted/30 bg-bg-dark text-white focus:outline-none focus:ring-2 focus:ring-teal-accent/25 h-16 resize-none"
                            placeholder="พิมพ์หมายเหตุบัญชีติ๊กต๊อก เช่น แนวทางการลงคลิป สินค้าที่ต้องการปักตะกร้า"
                          />
                        ) : (
                          <p className="text-xs text-text-secondary bg-bg-dark/55 p-2 rounded-lg border border-teal-muted/10 leading-relaxed min-h-[4rem]">
                            {account.notes || <span className="text-teal-muted/40 italic">ไม่มีบันทึกสำหรับโปรไฟล์นี้</span>}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-teal-muted/70 border-t border-teal-muted/10 pt-2.5 mt-2">
                        <p>วันที่ลงทะเบียน: <span className="text-text-secondary font-semibold">{account.createdDate || '-'}</span></p>
                        <p>ฟาร์มล่าสุด: <span className="text-text-secondary font-semibold">{account.lastFarmedDate || 'ยังไม่ได้ฟาร์มวันนี้'}</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
