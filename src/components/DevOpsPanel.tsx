import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Database, 
  HelpCircle, 
  Copy, 
  Check, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Workflow
} from 'lucide-react';
import { SystemLog } from '../types';

interface DevOpsPanelProps {
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

export default function DevOpsPanel({ onAddLog }: DevOpsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'cicd' | 'build-scripts' | 'er-diagram' | 'troubleshooting'>('cicd');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onAddLog(`[DEVOPS UTILITY] คัดลอกซอร์สโค้ดคอนฟิก "${id}" ลงใน Clipboard สำเร็จ`, 'IPCRouter', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // GitHub Actions YAML for Windows Electron release
  const cicdYaml = `# .github/workflows/electron-build-release.yml
name: Enterprise Electron Windows Release CI/CD

on:
  push:
    tags:
      - 'v*' # Trigger only on version tags

jobs:
  build_on_windows:
    runs-on: windows-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime Environment
        uses: actions/setup-node@v4
        with:
          node-size: 18
          cache: 'npm'

      - name: Install Base and Native Dependencies
        run: npm ci

      - name: Run Code Linter and Pre-Build Checks
        run: npm run lint

      - name: Run Full Testing Suites (Unit + Integration)
        run: npm run test

      - name: Compile and Bundle Application assets (Vite + React)
        run: npm run build

      - name: Package & Compile Electron binaries for Windows (x64 / Portable)
        run: npx electron-builder --windows --publish always
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          CSC_LINK: \${{ secrets.WINDOWS_SIGNING_CERTIFICATE }}
          CSC_KEY_PASSWORD: \${{ secrets.WINDOWS_CERTIFICATE_PASSWORD }}`;

  // Custom Electron Builder configurations
  const buildConfigJson = `// electron-builder.json
{
  "appId": "com.creator.studio.desktop",
  "productName": "CreatorDesktopSuite",
  "copyright": "Copyright © 2026 Enterprise Creator Studio",
  "directories": {
    "output": "dist/release"
  },
  "files": [
    "dist/**/*",
    "node_modules/**/*",
    "package.json",
    "main.js",
    "preload.js"
  ],
  "win": {
    "target": [
      {
        "target": "nsis", // Windows Executable Installer
        "arch": ["x64"]
      },
      {
        "target": "portable", // Portable EXE mode
        "arch": ["x64"]
      }
    ],
    "icon": "assets/icons/win/icon.ico",
    "requestedExecutionLevel": "asInvoker"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "Creator Desktop Suite",
    "runAfterFinish": true
  }
}`;

  // SQL Schema & ER Diagram mapping
  const dbSchemaText = `-- Creator Desktop Suite - Core SQLite Schema (DDD Model mappings)

-- 1. Accounts table (Repository Layer)
CREATE TABLE IF NOT EXISTS creator_accounts (
    id TEXT PRIMARY KEY,
    platform TEXT CHECK(platform IN ('tiktok', 'youtube', 'facebook', 'instagram')) NOT NULL,
    username TEXT UNIQUE NOT NULL,
    profile_name TEXT NOT NULL,
    proxy_ip TEXT NOT NULL,
    status TEXT CHECK(status IN ('active', 'suspended', 'verification_required', 'cooldown')) DEFAULT 'active',
    followers_count INTEGER NOT NULL DEFAULT 0,
    engagement_rate REAL NOT NULL DEFAULT 0.0,
    monetization_enabled INTEGER CHECK(monetization_enabled IN (0, 1)) DEFAULT 0,
    created_date TEXT NOT NULL,
    notes TEXT,
    last_active TEXT
);

-- 2. Workflows table (Service Layer scheduler, Cascading foreign key to accounts)
CREATE TABLE IF NOT EXISTS publish_workflows (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    account_id TEXT NOT NULL,
    platform TEXT CHECK(platform IN ('tiktok', 'youtube', 'facebook', 'instagram')) NOT NULL,
    content_type TEXT CHECK(content_type IN ('video', 'short_video', 'image_post')) NOT NULL,
    scheduled_time TEXT NOT NULL,
    status TEXT CHECK(status IN ('queued', 'running', 'completed', 'failed', 'paused')) DEFAULT 'queued',
    progress INTEGER DEFAULT 0,
    video_path TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY(account_id) REFERENCES creator_accounts(id) ON DELETE CASCADE
);

-- 3. Live Telemetry Logs Table (Audit and Error log tracking)
CREATE TABLE IF NOT EXISTS system_telemetry_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    level TEXT CHECK(level IN ('info', 'warn', 'error', 'debug')) NOT NULL,
    source TEXT CHECK(source IN ('MainProcess', 'SQLiteEngine', 'IPCRouter', 'SchedulerService', 'AccountRepository')) NOT NULL,
    message TEXT NOT NULL
);

-- Index optimizations for lightning fast search and priority queuing
CREATE INDEX IF NOT EXISTS idx_workflow_scheduled ON publish_workflows(scheduled_time, status);
CREATE INDEX IF NOT EXISTS idx_accounts_username ON creator_accounts(username);`;

  return (
    <div className="glass p-6 rounded-2xl" id="devops-center-panel">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex justify-between items-start flex-col md:flex-row gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Workflow className="w-5 h-5 text-teal-accent animate-pulse" />
            DevOps &amp; Compilation Pipelines Control Room
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            สแกนโค้ดและคีย์แผนจำลอง CI/CD, บิลด์ Windows, ตาราง ER Diagram, และแนวทางแก้ไขสถานการณ์ขัดข้อง (Safe Boot-up Guide)
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex gap-1 bg-bg-dark/60 p-1 rounded-xl border border-teal-muted/15">
          <button
            onClick={() => setActiveSubTab('cicd')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'cicd' ? 'bg-teal-accent text-bg-dark' : 'text-teal-muted hover:text-white'
            }`}
          >
            GitHub Actions CI
          </button>
          <button
            onClick={() => setActiveSubTab('build-scripts')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'build-scripts' ? 'bg-teal-accent text-bg-dark' : 'text-teal-muted hover:text-white'
            }`}
          >
            Win Builder Config
          </button>
          <button
            onClick={() => setActiveSubTab('er-diagram')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'er-diagram' ? 'bg-teal-accent text-bg-dark' : 'text-teal-muted hover:text-white'
            }`}
          >
            SQLite ER Schema
          </button>
          <button
            onClick={() => setActiveSubTab('troubleshooting')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'troubleshooting' ? 'bg-teal-accent text-bg-dark' : 'text-teal-muted hover:text-white'
            }`}
          >
            Troubleshooting Guide
          </button>
        </div>
      </div>

      {/* Contents based on active sub tab */}
      <div className="text-xs text-text-secondary leading-relaxed">
        {activeSubTab === 'cicd' && (
          <div className="space-y-4 animate-fade-in" id="cicd-tab">
            <div className="flex justify-between items-center bg-bg-dark/40 p-4 border border-teal-muted/15 rounded-xl">
              <div>
                <span className="font-bold text-white text-xs block mb-1">GitHub Action Automated Build &amp; Sign</span>
                <p className="text-teal-muted text-[10px]">
                  เวิร์กโฟลว์ CI/CD สำหรับคอมไพล์ซอร์สโค้ดและรันชุดทดสอบความถูกต้องระดับองค์กร พร้อมปล่อยรีลีส Windows x64 ทันทีที่มีการทริกเกอร์แท็กเวอร์ชันใหม่
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(cicdYaml, 'github-workflow')}
                className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-[10px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copiedId === 'github-workflow' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'github-workflow' ? 'COPIED!' : 'COPY WORKFLOW'}
              </button>
            </div>

            <pre className="bg-[#0b0c10] border border-teal-muted/20 p-4 rounded-xl overflow-x-auto text-[10px] font-mono text-white leading-relaxed max-h-[350px]">
              {cicdYaml}
            </pre>
          </div>
        )}

        {activeSubTab === 'build-scripts' && (
          <div className="space-y-4 animate-fade-in" id="build-config-tab">
            <div className="flex justify-between items-center bg-bg-dark/40 p-4 border border-teal-muted/15 rounded-xl">
              <div>
                <span className="font-bold text-white text-xs block mb-1">Electron-Builder Multi-Target Windows Specification</span>
                <p className="text-teal-muted text-[10px]">
                  ไฟล์กำหนดแผนการสร้างบิลด์โปรแกรม ได้แก่ บิลด์ติดตั้งผ่าน NSIS Setup และบิลด์พกพาแบบเดี่ยว (Portable Mode .exe) ที่ไม่จำเป็นต้องรันโปรแกรมติดตั้ง
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(buildConfigJson, 'builder-config')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-black text-[10px] px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                {copiedId === 'builder-config' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'builder-config' ? 'COPIED!' : 'COPY JSON CONFIG'}
              </button>
            </div>

            <pre className="bg-[#0b0c10] border border-teal-muted/20 p-4 rounded-xl overflow-x-auto text-[10px] font-mono text-teal-accent leading-relaxed max-h-[350px]">
              {buildConfigJson}
            </pre>
          </div>
        )}

        {activeSubTab === 'er-diagram' && (
          <div className="space-y-4 animate-fade-in" id="er-schema-tab">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Left description */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1">
                    <Database className="w-4 h-4 text-teal-accent" />
                    SQLite Schema Design (ER)
                  </h4>
                  <p className="text-[10px] text-teal-muted leading-relaxed">
                    สตรักเจอร์การแมปปิ้งฐานข้อมูลท้องถิ่นมีความเชื่อมโยงอย่างเหนียวแน่น:
                  </p>
                  <ul className="space-y-1.5 pl-4 list-disc text-[10px]">
                    <li>
                      <strong className="text-white">One-to-Many Relationship:</strong> หนึ่งบัญชีผู้สร้าง (creator_accounts) สามารถครอบครองคิวงานอัปโหลด (publish_workflows) ได้ไม่จำกัดจำนวนงาน
                    </li>
                    <li>
                      <strong className="text-white">Cascade Deletion:</strong> การลบบัญชีหลักในฐานข้อมูลระบบจะทำการจำลองลบงานอัปโหลดที่พ่วงค้างอยู่ทั้งหมดทันที เพื่อความคงสภาพโครงสร้างฐานข้อมูล (Referential Integrity)
                    </li>
                    <li>
                      <strong className="text-white">Performance Indexing:</strong> มีการจารึก index ลงบนคอลัมน์ <code className="text-emerald-400">scheduled_time</code> และคีย์เพื่อการค้นหาประมวลผลงานระดับเสี้ยววินาที
                    </li>
                  </ul>
                </div>

                <div className="bg-teal-accent/5 border border-teal-accent/25 p-4 rounded-xl text-[10px] text-teal-muted leading-relaxed">
                  <span className="font-bold text-white block mb-1">🧠 SQLite optimization guidelines</span>
                  - เรียกคำสั่ง <code className="text-emerald-400">VACUUM</code> เพื่อกวาดคืนเนื้อที่จัดเก็บที่สูญเปล่าของไฟล์ .db
                  <br />
                  - ใช้คำสั่ง <code className="text-emerald-400">PRAGMA journal_mode = WAL</code> เพื่อทริกเกอร์ฟังก์ชันเขียนเขียนสับหลีกระดับคอร์เพื่อความทนทานสูงสุด
                </div>
              </div>

              {/* Right SQL code block */}
              <div className="lg:col-span-2 flex flex-col gap-2">
                <div className="flex justify-between items-center bg-bg-dark/40 p-2 px-4 border border-teal-muted/10 rounded-xl select-none">
                  <span className="text-[10px] text-teal-muted font-bold font-mono">Drizzle schema mapping script</span>
                  <button
                    onClick={() => handleCopyCode(dbSchemaText, 'sqlite-schema')}
                    className="text-teal-accent hover:text-white font-bold text-[9px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'sqlite-schema' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedId === 'sqlite-schema' ? 'COPY SQL' : 'COPY'}
                  </button>
                </div>
                <pre className="bg-[#0b0c10] border border-teal-muted/20 p-4 rounded-xl overflow-x-auto text-[9px] font-mono text-white leading-relaxed max-h-[350px]">
                  {dbSchemaText}
                </pre>
              </div>

            </div>
          </div>
        )}

        {activeSubTab === 'troubleshooting' && (
          <div className="space-y-4 animate-fade-in" id="troubleshooting-tab">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Column 1 */}
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-accent" />
                  SQLite Database Lock Recovery (ฟื้นฟูดาต้าเบสถูกล็อก)
                </h4>
                <p className="text-[11px] text-teal-muted leading-relaxed">
                  เมื่อระบบขัดข้องหรือเกิดข้อผิดพลาด SQLite "Database locked" หรือ "database disk image is malformed" ซึ่งส่งผลให้แอปพลิเคชันค้าง ให้ดำเนินการขั้นตอนเหล่านี้เพื่อแก้ไข:
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[10px] text-text-secondary">
                  <li>ปิดแอปพลิเคชันหลักของ Electron ใน Task Manager ให้สนิท</li>
                  <li>เปิดหน้าต่าง Command Prompt หรือ Terminal ขึ้นมาและพิมพ์:
                    <code className="block bg-[#0b0c10] p-1.5 text-white rounded mt-1 font-mono text-[9px]">sqlite3 database/creator_studio.db "PRAGMA integrity_check;"</code>
                  </li>
                  <li>หากพบความเสียหาย คืนค่าด้วยไฟล์สำรองที่เราส่งออกโดยไปที่แถบ <strong>Settings &gt; Backup &amp; Restore</strong> และนำเข้าไฟล์ JSON ล่าสุด</li>
                  <li>รันคำสั่งทำความสะอาดกวาดคืน RAM โดยกด <strong>Settings &gt; System Cleanup</strong> ในแอปพลิเคชัน</li>
                </ol>
              </div>

              {/* Column 2 */}
              <div className="bg-bg-dark/40 border border-teal-muted/15 p-5 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-rose-400" />
                  Electron Native Proxy Error Safe Mode (เครือข่ายขัดข้องเซฟโหมด)
                </h4>
                <p className="text-[11px] text-teal-muted leading-relaxed">
                  กรณีแอปพลิเคชันสลับ Dynamic Proxy แล้วเกิดอาการหน้าเพจโหลดหมุนค้าง (Iframe Connection Block / SSL Proxy Handshake Failure):
                </p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[10px] text-text-secondary">
                  <li>ไปที่ระบบสลับกลุ่มเครือข่าย IP ด้านขวา เพื่อตรวจเช็คสถานะการ Rotate และ Ping ของ Proxy เครื่องหลัก</li>
                  <li>หากการจำลอง Ping พุ่งขึ้นสูง (ตัวเลขสีแดง &gt; 400ms) ให้กดปุ่ม <strong>"Rotate IP"</strong> ใน Workspace เพื่อส่งสัญญาณสั่งให้เร้าเตอร์เครื่องฟาร์มหรือ Air-mode หมุนสลับสัญญาณใหม่ระดับเซลลูลาร์</li>
                  <li>หาก Proxy โดนแบนอย่างถาวร (Status: suspended) ให้แก้ไขรายละเอียด Proxy แล้วเปลี่ยนไปกรอก Proxy IP แพลนสำรองที่เตรียมไว้ในเครื่องทันที</li>
                </ol>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
