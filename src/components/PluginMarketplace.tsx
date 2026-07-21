import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Download, 
  Check, 
  Cpu, 
  Grid, 
  Sparkles,
  Info
} from 'lucide-react';
import { SystemLog } from '../types';

interface PluginMarketplaceProps {
  featureFlags: Record<string, boolean>;
  onUpdateFeatureFlags: (flags: Record<string, boolean>) => void;
  onAddLog: (message: string, source: SystemLog['source'], level: SystemLog['level']) => void;
}

interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  desc: string;
  flagKey: string; // Toggles this feature flag
  isOfficial: boolean;
  downloadsCount: string;
}

export default function PluginMarketplace({
  featureFlags,
  onUpdateFeatureFlags,
  onAddLog
}: PluginMarketplaceProps) {
  // Local installer state for simulation
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  // Core list of custom plugins
  const availablePlugins: MarketplacePlugin[] = [
    {
      id: 'p1',
      name: 'Auto-Backup & DB Vacuum Engine',
      version: 'v1.2.0',
      author: 'SQLite Dev Team',
      desc: 'สำรองไฟล์ข้อมูล SQLite อัตโนมัติทุกๆ 1 ชั่วโมง พร้อมบีบอัด GZip และเรียกคำสั่ง VACUUM ล้างขยะประหยัดเนื้อหา SSD',
      flagKey: 'autoBackup',
      isOfficial: true,
      downloadsCount: '45.2K'
    },
    {
      id: 'p2',
      name: 'Gemini AI Content Optimizer',
      version: 'v2.1.4',
      author: 'Google AI Studio',
      desc: 'ขยายความสามารถแถบ AI Content ด้วยชุดโมเดลประมวลผลเชิงลึก วิเคราะห์สถิติผู้ติดตามเพื่อสุ่มเลือกเวลาอัปโหลดที่ดีที่สุด',
      flagKey: 'aiScriptAssist',
      isOfficial: true,
      downloadsCount: '128K'
    },
    {
      id: 'p3',
      name: 'High-Density RAM & CPU Telemetry',
      version: 'v1.0.8',
      author: 'Electron Performance',
      desc: 'เพิ่มแถบรายงานประสิทธิภาพและกราฟ CPU/RAM ท้องถิ่น ละเอียดระดับหน่วยความจำไบต์ พร้อมจำลองสลับพรีโหลดรวดเร็ว',
      flagKey: 'advancedMetrics',
      isOfficial: false,
      downloadsCount: '12.4K'
    },
    {
      id: 'p4',
      name: 'ixBrowser Proxy Health Rotator',
      version: 'v3.0.1',
      author: 'Network Security TH',
      desc: 'สแกนตรวจสอบ Proxy IP ท้องถิ่นอัตโนมัติ หากความเร็วตกหรือล้มเหลว ระบบจะสลับไปดึง IP ตัวเครื่องที่ปลอดภัยตัวอื่นทันที',
      flagKey: 'proxyRotator',
      isOfficial: true,
      downloadsCount: '98.5K'
    }
  ];

  const handleInstallToggle = (plugin: MarketplacePlugin) => {
    const isInstalled = featureFlags[plugin.flagKey] || false;

    if (!isInstalled) {
      // Simulate download progress
      setDownloadingId(plugin.id);
      setDownloadProgress(0);
      onAddLog(`[MARKETPLACE] กำลังดาวน์โหลดปลั๊กอิน: "${plugin.name}" จากเซิร์ฟเวอร์สำรอง...`, 'MainProcess', 'info');

      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDownloadingId(null);
            
            // Enable feature flag
            onUpdateFeatureFlags({
              ...featureFlags,
              [plugin.flagKey]: true
            });
            onAddLog(`ดาวน์โหลดและติดตั้งปลั๊กอิน "${plugin.name}" สำเร็จและลงทะเบียน Feature Flag แล้ว!`, 'MainProcess', 'info');
            return 100;
          }
          return prev + 25;
        });
      }, 200);
    } else {
      // Disable feature flag immediately
      onUpdateFeatureFlags({
        ...featureFlags,
        [plugin.flagKey]: false
      });
      onAddLog(`ยกเลิกการติดตั้งและระงับการทำงานของปลั๊กอิน: "${plugin.name}"`, 'MainProcess', 'warn');
    }
  };

  return (
    <div className="space-y-6" id="plugins-marketplace-view">
      {/* Header Banner */}
      <div className="glass p-5 rounded-2xl border border-teal-muted/15 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-teal-accent animate-bounce" />
          <div>
            <h3 className="font-bold text-white text-sm">Modular Plugin Marketplace &amp; Feature Flags</h3>
            <p className="text-[10px] text-teal-muted mt-0.5">
              ระบบส่วนเสริมยืดหยุ่นสูง (Micro-kernel architecture) ติดตั้งและปลดล็อกฟีเจอร์ระดับองค์กรผ่านสวิตช์ Feature Flags ทันที
            </p>
          </div>
        </div>

        <div className="bg-bg-dark/60 p-2 border border-teal-muted/15 rounded-xl flex items-center gap-2 text-[10px] font-mono">
          <Check className="w-3.5 h-3.5 text-teal-accent" />
          <span>MICRO-KERNEL MODULES: <strong className="text-white">READY</strong></span>
        </div>
      </div>

      {/* Grid of Plugins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="plugins-grid">
        {availablePlugins.map((plugin) => {
          const isInstalled = featureFlags[plugin.flagKey] || false;
          const isDownloading = downloadingId === plugin.id;

          return (
            <div 
              key={plugin.id} 
              className={`glass p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isInstalled 
                  ? 'border-teal-accent/30 bg-teal-accent/5' 
                  : 'border-teal-muted/15 hover:border-teal-muted/25'
              }`}
            >
              <div className="space-y-2">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs">{plugin.name}</h4>
                      {plugin.isOfficial && (
                        <span className="text-[8px] bg-teal-accent/15 border border-teal-accent/25 text-teal-accent font-black rounded px-1 tracking-wider uppercase font-sans">
                          OFFICIAL
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-teal-muted block">
                      เวอร์ชัน {plugin.version} • โดย {plugin.author}
                    </span>
                  </div>

                  <span className="text-[9px] font-mono text-teal-muted/80 shrink-0">
                    ดาวน์โหลด: {plugin.downloadsCount}
                  </span>
                </div>

                <p className="text-teal-muted text-[11px] leading-relaxed select-text">
                  {plugin.desc}
                </p>
              </div>

              {/* Install Progress bar / button row */}
              <div className="pt-3 border-t border-teal-muted/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-4 h-4 ${isInstalled ? 'text-teal-accent' : 'text-teal-muted/40'}`} />
                  <span className="text-[9px] font-mono text-teal-muted">
                    FEATURE FLAG: <strong className="text-white">{plugin.flagKey}</strong> = {isInstalled ? 'TRUE' : 'FALSE'}
                  </span>
                </div>

                {isDownloading ? (
                  <div className="w-32 text-right">
                    <span className="text-[8px] font-mono text-teal-accent block mb-0.5 font-bold">DOWNLOADING: {downloadProgress}%</span>
                    <div className="w-full bg-bg-dark h-1 rounded-full overflow-hidden">
                      <div className="bg-teal-accent h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleInstallToggle(plugin)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                      isInstalled
                        ? 'bg-rose-500/10 hover:bg-rose-500 border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-bg-dark'
                        : 'bg-teal-accent text-bg-dark hover:bg-teal-accent-dark border-teal-accent'
                    }`}
                  >
                    {isInstalled ? 'UNINSTALL / DEACTIVATE' : 'INSTALL / ACTIVATE'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Tip about dependency injection */}
      <div className="bg-teal-accent/5 border border-teal-accent/25 p-4 rounded-xl flex items-start gap-2.5">
        <Info className="w-5 h-5 text-teal-accent shrink-0 mt-0.5" />
        <div className="text-xs text-teal-muted space-y-1">
          <p className="font-bold text-white">⚙️ สถาปัตยกรรม Feature Flags &amp; Plugin Sandbox (Electron Plugin System)</p>
          <p className="leading-relaxed">
            ระบบทำงานบนสถาปัตยกรรมแบบ Micro-kernel เลเยอร์หลักของแอปจะสแกนหาไฟล์ปลั๊กอิน (Plugin Discovery) จาก SQLite Database และใช้เทคนิค Dynamic Dependency Injection ในการส่งต่อฟังก์ชันให้เข้าควบคุมชุดคำสั่ง ตัวกรอง (Network Proxy Optimizer) หรือฟีดสถิติแบบเรียลไทม์ ทำให้สามารถเปิดปิดฟังก์ชันหลักของแอปได้ทันทีโดยไม่ต้องทำการคอมไพล์โค้ดใหม่ (Dynamic Code Loading Mode)
          </p>
        </div>
      </div>
    </div>
  );
}
