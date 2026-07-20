import React, { useState, useEffect } from 'react';
import { Database, Terminal, Play, RotateCcw, AlertCircle, CheckCircle2, FileCode, HelpCircle } from 'lucide-react';
import { SQLiteTable, SQLQueryResult, SystemLog } from '../types';

interface DBExplorerProps {
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

export default function DBExplorer({ onAddLog }: DBExplorerProps) {
  const [activeTab, setActiveTab] = useState<'schema' | 'terminal' | 'relationships'>('schema');
  
  // Simulated SQLite Database State
  const [accountsTable, setAccountsTable] = useState<any[]>([
    { id: '1', platform: 'tiktok', username: 'tech_guru', profile_name: 'TechGuru TH', proxy_ip: '185.220.101.4:8000', status: 'active', followers: 24500, engagement: 8.4, created_at: '2026-07-15 10:24:00' },
    { id: '2', platform: 'youtube', username: 'cooking_co', profile_name: 'Cooking Companion', proxy_ip: '45.138.22.190:3128', status: 'active', followers: 128000, engagement: 12.1, created_at: '2026-07-16 11:15:32' },
    { id: '3', platform: 'tiktok', username: 'vlog_queen', profile_name: 'Vlog Queen TH', proxy_ip: '194.26.135.12:8800', status: 'verification_required', followers: 8900, engagement: 5.2, created_at: '2026-07-17 14:02:11' },
    { id: '4', platform: 'facebook', username: 'news_feed_th', profile_name: 'NewsFeed Thailand', proxy_ip: '109.224.52.12:9000', status: 'active', followers: 4500, engagement: 3.1, created_at: '2026-07-18 09:45:00' },
    { id: '5', platform: 'instagram', username: 'photo_diary', profile_name: 'PhotoDiary Official', proxy_ip: '82.102.12.80:80', status: 'cooldown', followers: 56000, engagement: 6.8, created_at: '2026-07-19 16:30:15' }
  ]);

  const [workflowsTable, setWorkflowsTable] = useState<any[]>([
    { id: '101', title: 'แกะกล่องมือถือเรือธงปี 2026', account_id: '1', platform: 'tiktok', content_type: 'video', scheduled_time: '2026-07-21 18:00:00', status: 'queued', progress: 0 },
    { id: '102', title: '5 วิธีต้มไข่ออนเซ็นให้ไข่แดงเยิ้ม', account_id: '2', platform: 'youtube', content_type: 'short_video', scheduled_time: '2026-07-20 20:30:00', status: 'running', progress: 45 },
    { id: '103', title: 'พาเที่ยวคาเฟ่ลับย่านอารีย์', account_id: '3', platform: 'tiktok', content_type: 'video', scheduled_time: '2026-07-20 15:00:00', status: 'completed', progress: 100 },
    { id: '104', title: 'ด่วน! สรุปมาตรการกระตุ้นเศรษฐกิจใหม่', account_id: '4', platform: 'facebook', content_type: 'image_post', scheduled_time: '2026-07-21 12:00:00', status: 'queued', progress: 0 }
  ]);

  const [queryInput, setQueryInput] = useState<string>('SELECT * FROM creator_accounts WHERE status = \'active\';');
  const [queryResult, setQueryResult] = useState<SQLQueryResult | null>(null);

  const tables: SQLiteTable[] = [
    {
      name: 'creator_accounts',
      columns: [
        { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY' },
        { name: 'platform', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'username', type: 'TEXT', constraints: 'UNIQUE NOT NULL' },
        { name: 'profile_name', type: 'TEXT' },
        { name: 'proxy_ip', type: 'TEXT' },
        { name: 'status', type: 'TEXT', constraints: 'DEFAULT \'active\'' },
        { name: 'followers', type: 'INTEGER', constraints: 'DEFAULT 0' },
        { name: 'engagement', type: 'REAL', constraints: 'DEFAULT 0.0' },
        { name: 'created_at', type: 'TEXT', constraints: 'DEFAULT CURRENT_TIMESTAMP' }
      ],
      rowCount: accountsTable.length
    },
    {
      name: 'publish_workflows',
      columns: [
        { name: 'id', type: 'TEXT', constraints: 'PRIMARY KEY' },
        { name: 'title', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'account_id', type: 'TEXT', constraints: 'REFERENCES creator_accounts(id)' },
        { name: 'platform', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'content_type', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'scheduled_time', type: 'TEXT', constraints: 'NOT NULL' },
        { name: 'status', type: 'TEXT', constraints: 'DEFAULT \'queued\'' },
        { name: 'progress', type: 'INTEGER', constraints: 'DEFAULT 0' }
      ],
      rowCount: workflowsTable.length
    }
  ];

  const presets = [
    { label: 'ดึงข้อมูลบัญชีทั้งหมด', sql: 'SELECT * FROM creator_accounts;' },
    { label: 'กรองเฉพาะบัญชีที่เป็น Tiktok', sql: 'SELECT * FROM creator_accounts WHERE platform = \'tiktok\';' },
    { label: 'ดึงตารางงานที่กำลังทำงานอยู่', sql: 'SELECT * FROM publish_workflows WHERE status = \'running\';' },
    { label: 'เชื่อมความสัมพันธ์ (JOIN) บัญชีกับตารางงาน', sql: 'SELECT a.profile_name, w.title, w.scheduled_time FROM creator_accounts a JOIN publish_workflows w ON a.id = w.account_id;' },
    { label: 'นับจำนวนคิวงานแยกตามแพลตฟอร์ม', sql: 'SELECT platform, COUNT(*) as count FROM publish_workflows GROUP BY platform;' },
    { label: 'อัปเดตผู้ติดตามบัญชี TechGuru', sql: 'UPDATE creator_accounts SET followers = 25000 WHERE username = \'tech_guru\';' },
    { label: 'เพิ่มคิวอัปโหลดใหม่', sql: 'INSERT INTO publish_workflows (id, title, account_id, platform, content_type, scheduled_time, status, progress) VALUES (\'105\', \'รีวิวคาเฟ่ลับ Part 2\', \'3\', \'tiktok\', \'video\', \'2026-07-22 19:00:00\', \'queued\', 0);' }
  ];

  const handleRunQuery = () => {
    const sql = queryInput.trim();
    if (!sql) return;

    onAddLog(`กำลังประมวลผลคำสั่ง SQL: ${sql}`, 'SQLiteEngine', 'info');

    try {
      // Very simple interactive SQL parser simulator for display purposes
      const queryLower = sql.toLowerCase();
      
      if (queryLower.startsWith('select')) {
        let rows: any[] = [];
        let columns: string[] = [];

        if (queryLower.includes('from creator_accounts') && !queryLower.includes('join')) {
          rows = [...accountsTable];
          columns = ['id', 'platform', 'username', 'profile_name', 'proxy_ip', 'status', 'followers', 'engagement', 'created_at'];
          
          if (queryLower.includes("where status = 'active'")) {
            rows = rows.filter(r => r.status === 'active');
          } else if (queryLower.includes("where platform = 'tiktok'")) {
            rows = rows.filter(r => r.platform === 'tiktok');
          }
        } 
        else if (queryLower.includes('from publish_workflows') && !queryLower.includes('join') && !queryLower.includes('group by')) {
          rows = [...workflowsTable];
          columns = ['id', 'title', 'account_id', 'platform', 'content_type', 'scheduled_time', 'status', 'progress'];
          
          if (queryLower.includes("where status = 'running'")) {
            rows = rows.filter(r => r.status === 'running');
          }
        } 
        else if (queryLower.includes('join')) {
          // Simulator for the join preset
          rows = workflowsTable.map(w => {
            const acc = accountsTable.find(a => a.id === w.account_id);
            return {
              profile_name: acc ? acc.profile_name : 'ไม่ระบุ',
              title: w.title,
              scheduled_time: w.scheduled_time
            };
          });
          columns = ['profile_name', 'title', 'scheduled_time'];
        }
        else if (queryLower.includes('group by')) {
          // Group by platform
          const counts: { [key: string]: number } = {};
          workflowsTable.forEach(w => {
            counts[w.platform] = (counts[w.platform] || 0) + 1;
          });
          rows = Object.keys(counts).map(plat => ({
            platform: plat,
            count: counts[plat]
          }));
          columns = ['platform', 'count'];
        }
        else {
          throw new Error("ระบบจำลองไม่รองรับรูปแบบ QUERY นอกเหนือจากพรีเซ็ตในระบบเพื่อความปลอดภัยทางไทป์");
        }

        setQueryResult({
          queryId: Math.random().toString(),
          sql,
          timestamp: new Date().toLocaleTimeString('th-TH'),
          isSuccess: true,
          affectedRows: rows.length,
          columns,
          rows
        });
        onAddLog(`ประมวลผลคำสั่งสำเร็จ, ดึงข้อมูลได้ ${rows.length} แถว`, 'SQLiteEngine', 'info');
      } 
      else if (queryLower.startsWith('update')) {
        if (queryLower.includes('creator_accounts') && queryLower.includes("username = 'tech_guru'")) {
          setAccountsTable(prev => prev.map(a => a.username === 'tech_guru' ? { ...a, followers: 25000 } : a));
          setQueryResult({
            queryId: Math.random().toString(),
            sql,
            timestamp: new Date().toLocaleTimeString('th-TH'),
            isSuccess: true,
            affectedRows: 1,
            columns: ['status', 'message'],
            rows: [{ status: 'success', message: 'UPDATE 1 row in creator_accounts set followers = 25000' }]
          });
          onAddLog(`อัปเดตข้อมูลบัญชี tech_guru ใน SQLite สำเร็จ`, 'SQLiteEngine', 'info');
        } else {
          throw new Error("ระบบจำลองไม่รองรับการเขียนทับโครงสร้างอื่นที่ไม่ตรงตามเงื่อนไขของพรีเซ็ต");
        }
      } 
      else if (queryLower.startsWith('insert')) {
        if (queryLower.includes('publish_workflows')) {
          const newRow = { id: '105', title: 'รีวิวคาเฟ่ลับ Part 2', account_id: '3', platform: 'tiktok', content_type: 'video', scheduled_time: '2026-07-22 19:00:00', status: 'queued', progress: 0 };
          
          if (!workflowsTable.some(w => w.id === '105')) {
            setWorkflowsTable(prev => [...prev, newRow]);
            onAddLog(`บันทึกคิวงานใหม่ id: 105 ลงสู่ฐานข้อมูล SQLite สำเร็จ`, 'SQLiteEngine', 'info');
          }
          
          setQueryResult({
            queryId: Math.random().toString(),
            sql,
            timestamp: new Date().toLocaleTimeString('th-TH'),
            isSuccess: true,
            affectedRows: 1,
            columns: ['status', 'message'],
            rows: [{ status: 'success', message: 'INSERT 1 row into publish_workflows with id: 105' }]
          });
        } else {
          throw new Error("ระบบจำลองไม่รองรับการ Insert เข้าตารางอื่น");
        }
      } 
      else {
        throw new Error("คำสั่ง SQL ไม่ถูกต้อง หรือไม่สนับสนุนสำหรับการสาธิต (รองรับ SELECT, UPDATE, INSERT)");
      }
    } catch (err: any) {
      setQueryResult({
        queryId: Math.random().toString(),
        sql,
        timestamp: new Date().toLocaleTimeString('th-TH'),
        isSuccess: false,
        affectedRows: 0,
        error: err.message
      });
      onAddLog(`ล้มเหลวในการประมวลผล SQL: ${err.message}`, 'SQLiteEngine', 'error');
    }
  };

  const handleResetSim = () => {
    setAccountsTable([
      { id: '1', platform: 'tiktok', username: 'tech_guru', profile_name: 'TechGuru TH', proxy_ip: '185.220.101.4:8000', status: 'active', followers: 24500, engagement: 8.4, created_at: '2026-07-15 10:24:00' },
      { id: '2', platform: 'youtube', username: 'cooking_co', profile_name: 'Cooking Companion', proxy_ip: '45.138.22.190:3128', status: 'active', followers: 128000, engagement: 12.1, created_at: '2026-07-16 11:15:32' },
      { id: '3', platform: 'tiktok', username: 'vlog_queen', profile_name: 'Vlog Queen TH', proxy_ip: '194.26.135.12:8800', status: 'verification_required', followers: 8900, engagement: 5.2, created_at: '2026-07-17 14:02:11' },
      { id: '4', platform: 'facebook', username: 'news_feed_th', profile_name: 'NewsFeed Thailand', proxy_ip: '109.224.52.12:9000', status: 'active', followers: 4500, engagement: 3.1, created_at: '2026-07-18 09:45:00' },
      { id: '5', platform: 'instagram', username: 'photo_diary', profile_name: 'PhotoDiary Official', proxy_ip: '82.102.12.80:80', status: 'cooldown', followers: 56000, engagement: 6.8, created_at: '2026-07-19 16:30:15' }
    ]);
    setWorkflowsTable([
      { id: '101', title: 'แกะกล่องมือถือเรือธงปี 2026', account_id: '1', platform: 'tiktok', content_type: 'video', scheduled_time: '2026-07-21 18:00:00', status: 'queued', progress: 0 },
      { id: '102', title: '5 วิธีต้มไข่ออนเซ็นให้ไข่แดงเยิ้ม', account_id: '2', platform: 'youtube', content_type: 'short_video', scheduled_time: '2026-07-20 20:30:00', status: 'running', progress: 45 },
      { id: '103', title: 'พาเที่ยวคาเฟ่ลับย่านอารีย์', account_id: '3', platform: 'tiktok', content_type: 'video', scheduled_time: '2026-07-20 15:00:00', status: 'completed', progress: 100 },
      { id: '104', title: 'ด่วน! สรุปมาตรการกระตุ้นเศรษฐกิจใหม่', account_id: '4', platform: 'facebook', content_type: 'image_post', scheduled_time: '2026-07-21 12:00:00', status: 'queued', progress: 0 }
    ]);
    setQueryResult(null);
    onAddLog(`รีเซ็ตสเตจจำลอง SQLite Database กลับเป็นค่าเริ่มต้นเรียบร้อย`, 'SQLiteEngine', 'info');
  };

  return (
    <div className="glass p-6 rounded-2xl" id="database-schema-explorer">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-accent" />
            3. SQLite Database Schema &amp; Live Terminal
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            สัญญะทางสถิติและแบบจำลองตาราง SQLite ท้องถิ่นของตัวแอปพลิเคชัน Desktop
          </p>
        </div>

        {/* Local switcher */}
        <div className="flex gap-1 bg-bg-dark/60 p-1 rounded-xl border border-teal-muted/15">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'schema'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Schema DDL
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'terminal'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Live SQLite Terminal
          </button>
          <button
            onClick={() => setActiveTab('relationships')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'relationships'
                ? 'bg-teal-accent text-bg-dark'
                : 'text-teal-muted hover:text-white'
            }`}
          >
            Relationships Map
          </button>
        </div>
      </div>

      {/* Database Main Content */}
      <div className="text-xs">
        {activeTab === 'schema' && (
          <div className="space-y-4 animate-fade-in" id="db-schema-ddl">
            <div className="bg-bg-dark/60 border border-teal-muted/15 p-4 rounded-xl font-mono text-[11px] text-teal-accent overflow-x-auto relative">
              <span className="absolute right-3 top-3 text-[10px] text-teal-muted/50 font-sans">sqlite_schema.sql</span>
              <pre className="leading-relaxed">
{`-- Table: creator_accounts
CREATE TABLE IF NOT EXISTS creator_accounts (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL CHECK(platform IN ('tiktok', 'youtube', 'facebook', 'instagram')),
  username TEXT UNIQUE NOT NULL,
  profile_name TEXT,
  proxy_ip TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'suspended', 'verification_required', 'cooldown')),
  followers INTEGER DEFAULT 0,
  engagement REAL DEFAULT 0.0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Table: publish_workflows
CREATE TABLE IF NOT EXISTS publish_workflows (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  account_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK(content_type IN ('video', 'short_video', 'image_post')),
  scheduled_time TEXT NOT NULL,
  status TEXT DEFAULT 'queued' CHECK(status IN ('queued', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  FOREIGN KEY (account_id) REFERENCES creator_accounts(id) ON DELETE CASCADE
);`}
              </pre>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tables.map((tbl) => (
                <div key={tbl.name} className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
                  <h5 className="font-bold text-white mb-2 flex justify-between items-center">
                    <span>📋 Table: {tbl.name}</span>
                    <span className="text-[10px] bg-teal-accent/15 text-teal-accent px-2 py-0.5 rounded-full border border-teal-accent/20 font-mono">
                      {tbl.rowCount} rows simulated
                    </span>
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="border-b border-teal-muted/20 text-teal-muted text-[10px]">
                          <th className="pb-1.5 font-bold">Column</th>
                          <th className="pb-1.5 font-bold">Type</th>
                          <th className="pb-1.5 font-bold">Constraints</th>
                        </tr>
                      </thead>
                      <tbody className="text-text-secondary">
                        {tbl.columns.map((col) => (
                          <tr key={col.name} className="border-b border-teal-muted/5">
                            <td className="py-1.5 text-white font-semibold">{col.name}</td>
                            <td className="py-1.5 text-teal-muted">{col.type}</td>
                            <td className="py-1.5 text-text-secondary">{col.constraints || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="space-y-4 animate-fade-in" id="db-live-terminal">
            <div className="bg-[#0b0c10] border border-teal-muted/15 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <Terminal className="w-4 h-4 text-teal-accent" />
                  SQLite Simulated Shell Console
                </div>
                <button
                  onClick={handleResetSim}
                  className="text-[10px] text-teal-muted hover:text-white flex items-center gap-1 cursor-pointer transition-all"
                  title="รีเซ็ตสถานะฐานข้อมูล"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset DB
                </button>
              </div>

              {/* Selector Presets */}
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQueryInput(p.sql)}
                    className="bg-bg-dark text-teal-muted border border-teal-muted/15 hover:border-teal-accent/30 hover:text-teal-accent text-[10px] px-2.5 py-1 rounded-lg transition-all text-left truncate max-w-full cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Text area command */}
              <div className="flex gap-2">
                <textarea
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="flex-1 bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/60 focus:ring-1 focus:ring-teal-accent/35 rounded-xl p-3 font-mono text-[12px] text-white focus:outline-none h-20 resize-none"
                  placeholder="พิมพ์คำสั่ง SQL สำหรับ Query ได้ที่นี่..."
                />
                <button
                  onClick={handleRunQuery}
                  className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black px-4 rounded-xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] cursor-pointer shrink-0"
                >
                  <Play className="w-4 h-4" />
                  RUN
                </button>
              </div>

              {/* Console Output Result */}
              {queryResult && (
                <div className="border border-teal-muted/15 rounded-xl overflow-hidden font-mono text-[11px] bg-bg-dark/50">
                  <div className="bg-bg-dark px-3 py-2 border-b border-teal-muted/15 flex justify-between items-center text-[10px] text-teal-muted">
                    <span>Query ID: {queryResult.queryId}</span>
                    <span>{queryResult.timestamp}</span>
                  </div>
                  
                  <div className="p-3">
                    {queryResult.isSuccess ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-sans">
                          <CheckCircle2 className="w-4 h-4" />
                          ประมวลผลคำสั่งสำเร็จ (ผลกระทบ {queryResult.affectedRows} แถว)
                        </div>

                        {queryResult.rows && queryResult.rows.length > 0 && queryResult.columns ? (
                          <div className="overflow-x-auto max-h-[160px]">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-teal-muted/25 text-teal-accent text-[10px]">
                                  {queryResult.columns.map((c) => (
                                    <th key={c} className="pb-1.5 font-bold px-2">{c}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="text-text-secondary">
                                {queryResult.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-teal-muted/5 hover:bg-bg-dark">
                                    {queryResult.columns!.map((c) => (
                                      <td key={c} className="py-1.5 px-2 text-white max-w-[200px] truncate">
                                        {typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c])}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-teal-muted italic text-[10px]">ไม่มีแถวข้อมูลที่ส่งกลับมาสำหรับการแสดงผล</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-rose-400">
                        <div className="flex items-center gap-1.5 text-xs font-bold font-sans">
                          <AlertCircle className="w-4 h-4" />
                          SQL Error!
                        </div>
                        <p className="bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-[10px]">
                          {queryResult.error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-4 animate-fade-in" id="db-relationships">
            <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl">
              <h4 className="font-bold text-white text-sm mb-3">🛠️ โครงสร้างความสัมพันธ์เชิงสัมพันธ์ (E-R Diagram Mapping)</h4>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-6 font-mono text-[11px]">
                {/* Table Accounts Card */}
                <div className="border border-teal-accent/30 bg-bg-dark rounded-xl p-4 w-52 shadow-[0_0_12px_rgba(102,252,241,0.1)]">
                  <span className="font-bold text-teal-accent block mb-2 border-b border-teal-accent/20 pb-1">creator_accounts</span>
                  <div className="space-y-1 text-text-secondary text-[10px]">
                    <p className="text-white font-semibold">🔑 id (PK - TEXT)</p>
                    <p>platform (TEXT)</p>
                    <p>username (TEXT - UNIQUE)</p>
                    <p>profile_name (TEXT)</p>
                    <p>proxy_ip (TEXT)</p>
                    <p>status (TEXT)</p>
                  </div>
                </div>

                {/* Connection line */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="h-6 w-0.5 md:h-0.5 md:w-16 bg-teal-muted/30"></div>
                  <span className="text-[10px] font-sans text-teal-accent bg-teal-accent/15 px-2 py-0.5 rounded-full border border-teal-accent/20">
                    1 : N Relationship
                  </span>
                  <div className="h-6 w-0.5 md:h-0.5 md:w-16 bg-teal-muted/30"></div>
                </div>

                {/* Table Workflows Card */}
                <div className="border border-indigo-500/30 bg-bg-dark rounded-xl p-4 w-52 shadow-[0_0_12px_rgba(99,102,241,0.1)]">
                  <span className="font-bold text-indigo-400 block mb-2 border-b border-indigo-500/20 pb-1">publish_workflows</span>
                  <div className="space-y-1 text-text-secondary text-[10px]">
                    <p className="text-white font-semibold">🔑 id (PK - TEXT)</p>
                    <p>title (TEXT)</p>
                    <p className="text-teal-accent font-bold">🔗 account_id (FK)</p>
                    <p>platform (TEXT)</p>
                    <p>content_type (TEXT)</p>
                    <p>scheduled_time (TEXT)</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1f2833]/50 p-4 border border-teal-muted/20 rounded-xl flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-teal-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">🔒 เหตุใดสปอยความปลอดภัยจึงสำคัญ (Cascade Deletion &amp; Referential Integrity)</p>
                  <p className="mt-1 text-text-secondary leading-relaxed">
                    ระบบได้ระบุข้อกำหนด <code>FOREIGN KEY</code> และ <code>ON DELETE CASCADE</code> เชื่อมโยงบัญชีและคิวงาน หมายความว่าเมื่อผู้ใช้เลือกที่จะลบบัญชีผู้ใช้งานออกจากระบบ คิวตารางโพสต์วิดีโอทั้งหมดที่เชื่อมโยงกับไอดีนั้นจะถูกล้างออกจากฐานข้อมูล SQLite โดยอัตโนมัติทันที เพื่อป้องกันข้อมูลขยะค้างอยู่ในหน่วยความจำ ปล่อยให้ฐานข้อมูลสอดคล้องกันแบบเรียลไทม์
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
