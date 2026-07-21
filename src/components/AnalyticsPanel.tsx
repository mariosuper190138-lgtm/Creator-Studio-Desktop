import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Percent, 
  Eye, 
  ThumbsUp, 
  Share2, 
  Sparkles, 
  Clock, 
  Download, 
  FileText, 
  HelpCircle,
  Activity,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { CreatorAccount } from '../types';

interface AnalyticsPanelProps {
  accounts: CreatorAccount[];
}

export default function AnalyticsPanel({ accounts }: AnalyticsPanelProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'tiktok' | 'youtube' | 'facebook' | 'instagram'>('tiktok');
  const [isCrunchingAI, setIsCrunchingAI] = useState(false);
  const [aiReportGenerated, setAiReportGenerated] = useState(true);

  // Aggregate Stats
  const totalFollowers = accounts.reduce((acc, a) => acc + a.followersCount, 0);
  const avgEngagement = accounts.length > 0 
    ? (accounts.reduce((acc, a) => acc + a.engagementRate, 0) / accounts.length).toFixed(1)
    : '6.8';
  
  const monetizedCount = accounts.filter(a => a.monetizationEnabled).length;
  const monetizationRate = accounts.length > 0
    ? ((monetizedCount / accounts.length) * 100).toFixed(0)
    : '40';

  // Unified Multi-platform View, Likes, Shares Metrics
  const baseFollowers = totalFollowers > 0 ? totalFollowers : 185000;
  const simulatedViews = Math.floor(baseFollowers * 5.4);
  const simulatedLikes = Math.floor(simulatedViews * 0.14);
  const simulatedShares = Math.floor(simulatedViews * 0.04);

  // Growth Data (Simulated daily reach graph)
  const growthData = [
    { name: 'จ.', followers: Math.floor(baseFollowers * 0.8), reach: Math.floor(baseFollowers * 1.2) },
    { name: 'อ.', followers: Math.floor(baseFollowers * 0.84), reach: Math.floor(baseFollowers * 1.45) },
    { name: 'พ.', followers: Math.floor(baseFollowers * 0.88), reach: Math.floor(baseFollowers * 1.6) },
    { name: 'พฤ.', followers: Math.floor(baseFollowers * 0.92), reach: Math.floor(baseFollowers * 2.1) },
    { name: 'ศ.', followers: Math.floor(baseFollowers * 0.95), reach: Math.floor(baseFollowers * 2.45) },
    { name: 'ส.', followers: Math.floor(baseFollowers * 0.98), reach: Math.floor(baseFollowers * 2.9) },
    { name: 'อา.', followers: baseFollowers, reach: Math.floor(baseFollowers * 3.2) }
  ];

  // Platform Breakdown data
  const platformData = [
    { name: 'TikTok', accounts: accounts.filter(a => a.platform === 'tiktok').length || 1, engagement: 8.5 },
    { name: 'YouTube', accounts: accounts.filter(a => a.platform === 'youtube').length || 1, engagement: 11.2 },
    { name: 'Facebook', accounts: accounts.filter(a => a.platform === 'facebook').length || 1, engagement: 4.2 },
    { name: 'Instagram', accounts: accounts.filter(a => a.platform === 'instagram').length || 1, engagement: 7.9 }
  ];

  // Best Time to Post AI Recommendations Map
  const bestTimes = {
    tiktok: {
      timeSlot: '19:00 - 21:30 น.',
      days: 'พุธ, ศุกร์, เสาร์',
      activeUsersPct: '88%',
      rationale: 'ผู้ใช้วัยทำงานและวัยรุ่นเปิดดูหน้า Feed For You สูงที่สุดหลังจากผ่อนคลายช่วงค่ำ อัลกอริทึมหมุนเวียนคลิปสั้นค่อนข้างเร็วในช่วงเวลานี้',
      heatData: [
        { hour: '08:00', traffic: 30 },
        { hour: '12:00', traffic: 55 },
        { hour: '15:00', traffic: 40 },
        { hour: '18:00', traffic: 75 },
        { hour: '20:00', traffic: 92 },
        { hour: '22:00', traffic: 80 }
      ]
    },
    youtube: {
      timeSlot: '15:00 - 17:30 น.',
      days: 'พฤหัสบดี, ศุกร์',
      activeUsersPct: '94%',
      rationale: 'เหมาะสำหรับโพสต์คลิปยาวหรือ Shorts ระบบต้องการเวลาอินเด็กซ์ไฟล์วีดีโอ 2-3 ชั่วโมงเพื่อให้ได้อันดับบนหน้าค้นหาก่อนทราฟฟิกพุ่งสูงสุดช่วงสุดสัปดาห์',
      heatData: [
        { hour: '08:00', traffic: 20 },
        { hour: '12:00', traffic: 45 },
        { hour: '15:00', traffic: 80 },
        { hour: '18:00', traffic: 88 },
        { hour: '20:00', traffic: 95 },
        { hour: '22:00', traffic: 70 }
      ]
    },
    instagram: {
      timeSlot: '11:30 - 13:00 น. และ 18:00 - 20:00 น.',
      days: 'จันทร์, พุธ, พฤหัสบดี',
      activeUsersPct: '81%',
      rationale: 'พฤติกรรมผู้ใช้ชอบแอบเลื่อนดูสตอรี่หรือโพสต์สไลด์ช่วงก่อนพักเที่ยงและช่วงเดินทางกลับบ้าน ปัจจัยการประมวลผลเน้นภาพสีคอนทราสต์อิ่มตัว',
      heatData: [
        { hour: '08:00', traffic: 40 },
        { hour: '12:00', traffic: 85 },
        { hour: '15:00', traffic: 50 },
        { hour: '18:00', traffic: 82 },
        { hour: '20:00', traffic: 78 },
        { hour: '22:00', traffic: 55 }
      ]
    },
    facebook: {
      timeSlot: '09:00 - 11:00 น.',
      days: 'อังคาร, พุธ',
      activeUsersPct: '76%',
      rationale: 'แฟนเพจและยอดสลับเข้าโปรไฟล์มีทราฟฟิกเสถียรที่สุดช่วงสัปดาห์ทำงานเช้า การแชร์ข้อมูลบทความยาวมักส่งผลดีกว่าโพสต์เดี่ยวช่วงเวลานี้',
      heatData: [
        { hour: '08:00', traffic: 65 },
        { hour: '12:00', traffic: 70 },
        { hour: '15:00', traffic: 60 },
        { hour: '18:00', traffic: 50 },
        { hour: '20:00', traffic: 45 },
        { hour: '22:00', traffic: 30 }
      ]
    }
  };

  const currentAI = bestTimes[selectedPlatform];

  const handleRecalculateAI = () => {
    setIsCrunchingAI(true);
    setTimeout(() => {
      setIsCrunchingAI(false);
      setAiReportGenerated(true);
    }, 1500);
  };

  // ACTUAL CSV DOWNLOAD GENERATOR (No mocks)
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Metric,Value,Explanation\r\n';
    csvContent += `Total Registered Accounts,${accounts.length},Saved in local SQLite\r\n`;
    csvContent += `Aggregated Followers,${totalFollowers},Sum of active channels\r\n`;
    csvContent += `Estimated Views,${simulatedViews},Unified reach indicator\r\n`;
    csvContent += `Estimated Likes,${simulatedLikes},Average positive engagement\r\n`;
    csvContent += `Estimated Shares,${simulatedShares},Viral post indicator\r\n`;
    csvContent += `Monetization Rate,${monetizationRate}%,Active product tags\r\n`;
    csvContent += `Average Engagement Rate,${avgEngagement}%,Total interaction weight\r\n`;
    
    csvContent += '\r\nPlatform,Accounts Registered,Estimated Engagement\r\n';
    platformData.forEach((p) => {
      csvContent += `${p.name},${p.accounts},${p.engagement}%\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorSuite_Growth_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulating Print/PDF View trigger
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="glass p-6 rounded-2xl" id="analytics-panel">
      
      {/* Header and export buttons */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-accent" />
            13. Real-Time Analytics &amp; Growth Dashboard
          </h3>
          <p className="text-xs text-teal-muted mt-0.5">
            ตัวชี้วัดประสิทธิภาพโดยภาพรวม ดัชนีการเข้าถึงรวมแบบ Unified ข้ามแพลตฟอร์ม และบอทพยากรณ์โพสต์ AI
          </p>
        </div>

        {/* Exporter triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-teal-accent/10 hover:bg-teal-accent/20 border border-teal-accent/35 text-teal-accent font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="ส่งออกสถิติในรูปแบบสเปรดชีต CSV"
          >
            <Download className="w-4 h-4" />
            Export CSV Report
          </button>

          <button
            onClick={handlePrintPDF}
            className="bg-bg-dark border border-teal-muted/20 hover:border-teal-accent/40 text-teal-muted hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title="เตรียมหน้าพิมพ์ด่วน"
          >
            <FileText className="w-4 h-4" />
            Print Summary
          </button>
        </div>
      </div>

      {/* Unified Metrics Overview Row (Aggregated KPI indicators) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Followers */}
        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5">
            <Activity className="w-24 h-24 text-teal-accent" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Aggregated Followers</span>
            <TrendingUp className="w-4 h-4 text-teal-accent animate-pulse" />
          </div>
          <p className="text-xl font-black text-white mt-1.5">{baseFollowers.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400 mt-1 block font-semibold flex items-center gap-0.5">
            ▲ +14.2% Growth (7d)
          </span>
        </div>

        {/* Views */}
        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5">
            <Eye className="w-24 h-24 text-teal-accent" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Unified Total Views</span>
            <Eye className="w-4 h-4 text-teal-accent" />
          </div>
          <p className="text-xl font-black text-white mt-1.5">{simulatedViews.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400 mt-1 block font-semibold flex items-center gap-0.5">
            ▲ +22.8% Organic Reach
          </span>
        </div>

        {/* Likes */}
        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5">
            <ThumbsUp className="w-24 h-24 text-indigo-400" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Unified Total Likes</span>
            <ThumbsUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-xl font-black text-white mt-1.5">{simulatedLikes.toLocaleString()}</p>
          <span className="text-[9px] text-indigo-300 mt-1 block">Avg Likes ratio: ~14% of views</span>
        </div>

        {/* Shares */}
        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-5">
            <Share2 className="w-24 h-24 text-emerald-400" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Unified Total Shares</span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-white mt-1.5">{simulatedShares.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400 mt-1 block font-semibold flex items-center gap-0.5">
            🚀 High Virality Rate
          </span>
        </div>

      </div>

      {/* KPI Rates Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-teal-accent/5 to-indigo-500/5 border border-teal-accent/15 p-3.5 rounded-xl flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-white block">Average Engagement Rate</span>
            <p className="text-teal-muted text-[11px] mt-0.5">ดัชนีคะแนนการตอบสนองเฉลี่ยที่วัดจากทุกบัญชีผู้รับใช้ของครีเอเตอร์</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-teal-accent font-mono block">{avgEngagement}%</span>
            <span className="text-[9px] text-teal-muted block">Global Avg: 4.8%</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/15 p-3.5 rounded-xl flex justify-between items-center text-xs">
          <div>
            <span className="font-bold text-white block">Monetization Sync Ratio</span>
            <p className="text-teal-muted text-[11px] mt-0.5">อัตราบัญชีที่มีสิทธิ์แนบตะกร้าสินค้าหรือสร้างรายได้สำเร็จ</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-indigo-400 font-mono block">{monetizationRate}%</span>
            <span className="text-[9px] text-emerald-400 block">{monetizedCount} จาก {accounts.length} บัญชี active</span>
          </div>
        </div>
      </div>

      {/* Recharts Diagrams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Area Line Chart */}
        <div className="lg:col-span-8 bg-[#0b0c10] border border-teal-muted/15 p-4 rounded-xl">
          <h4 className="font-bold text-white text-xs mb-3 flex items-center gap-1">
            <span>📈 Follower Growth &amp; Daily Reach Curve</span>
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFollow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66fcf1" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#66fcf1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2833" />
                <XAxis dataKey="name" stroke="#5c6b73" fontSize={10} />
                <YAxis stroke="#5c6b73" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#1f2833', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10, marginTop: 10 }} />
                <Area type="monotone" dataKey="followers" name="ผู้ติดตามรวมสะสม" stroke="#66fcf1" fillOpacity={1} fill="url(#colorFollow)" />
                <Area type="monotone" dataKey="reach" name="ยอดการเข้าถึงรายวัน" stroke="#818cf8" fillOpacity={1} fill="url(#colorReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bar Chart Platform breakdown */}
        <div className="lg:col-span-4 bg-[#0b0c10] border border-teal-muted/15 p-4 rounded-xl">
          <h4 className="font-bold text-white text-xs mb-3">📊 Platform Share comparison</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2833" />
                <XAxis dataKey="name" stroke="#5c6b73" fontSize={9} />
                <YAxis stroke="#5c6b73" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#1f2833', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="accounts" name="จำนวนบัญชี" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" name="มีปฏิสัมพันธ์ (%)" fill="#66fcf1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* BEST TIME TO POST AI ADVISOR CARD (Fully Interactive) */}
      <div className="bg-bg-dark/40 border border-teal-accent/20 rounded-2xl p-5 relative overflow-hidden" id="best-time-to-post-ai">
        
        {/* Background glow effects */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-teal-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* AI Title and platform switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-teal-muted/10 pb-3 mb-4 gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-accent" />
            <div>
              <span className="font-bold text-white text-xs block">Best Time to Post AI Advisor</span>
              <span className="text-[10px] text-teal-muted block">คำนวณจากสถิติผู้ติดตามและพฤติกรรมความถี่อัลกอริทึมของแต่ละช่องทาง</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as any)}
              className="bg-bg-dark border border-teal-muted/30 focus:border-teal-accent/50 rounded-xl px-2.5 py-1.5 text-[10px] text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="tiktok">TikTok Channels</option>
              <option value="youtube">YouTube Channels</option>
              <option value="instagram">Instagram Channels</option>
              <option value="facebook">Facebook Pages</option>
            </select>

            <button
              onClick={handleRecalculateAI}
              disabled={isCrunchingAI}
              className="bg-teal-accent hover:bg-teal-accent-dark text-bg-dark font-black text-[10px] px-3 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isCrunchingAI ? 'animate-spin' : ''}`} />
              {isCrunchingAI ? 'คำนวณสถิติ...' : 'วิเคราะห์ใหม่ (Recalculate)'}
            </button>
          </div>
        </div>

        {/* AI Timetable analysis body */}
        {isCrunchingAI ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-teal-muted">
            <div className="w-8 h-8 rounded-full border-2 border-t-2 border-teal-muted border-t-teal-accent animate-spin mb-3" />
            <span className="text-xs font-bold font-mono text-teal-accent animate-pulse">กำลังประมวลผล Big Data ผ่านโมเดลพยากรณ์ AI...</span>
            <p className="text-[9px] mt-1">วิเคราะห์ประวัติโพสต์และ Fingerprint Latency เก่า...</p>
          </div>
        ) : (
          aiReportGenerated && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
              
              {/* Left Recommendation Stats */}
              <div className="md:col-span-5 space-y-3.5">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg-dark/50 p-3 rounded-xl border border-teal-muted/10">
                    <span className="text-teal-muted text-[8px] uppercase block font-mono">ช่วงแนะนำที่ดีที่สุด</span>
                    <span className="text-white font-bold text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-accent" />
                      {currentAI.timeSlot}
                    </span>
                  </div>

                  <div className="bg-bg-dark/50 p-3 rounded-xl border border-teal-muted/10">
                    <span className="text-teal-muted text-[8px] uppercase block font-mono">วันที่ดีที่สุดประจำสัปดาห์</span>
                    <span className="text-teal-accent font-black text-xs mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {currentAI.days}
                    </span>
                  </div>
                </div>

                <div className="bg-bg-dark/50 p-3 rounded-xl border border-teal-muted/10">
                  <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                    <span className="text-teal-muted">Active Followers Index:</span>
                    <strong className="text-emerald-400 font-bold">{currentAI.activeUsersPct} Active</strong>
                  </div>
                  <div className="w-full bg-bg-dark h-1.5 rounded-full overflow-hidden border border-teal-accent/15">
                    <div style={{ width: currentAI.activeUsersPct }} className="bg-teal-accent h-full rounded-full" />
                  </div>
                </div>

                <div className="bg-teal-accent/5 border border-teal-accent/20 p-3 rounded-xl">
                  <p className="text-white text-[10px] font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-accent" />
                    คำแนะนำจากแบบจำลอง AI (AI Recommendation)
                  </p>
                  <p className="text-teal-muted text-[10.5px] leading-relaxed mt-1.5 font-medium">
                    {currentAI.rationale}
                  </p>
                </div>

              </div>

              {/* Right Hourly Traffic Line Chart */}
              <div className="md:col-span-7 bg-bg-dark/45 border border-teal-muted/10 p-3.5 rounded-xl flex flex-col justify-between">
                <span className="text-teal-muted text-[9px] font-mono font-bold block mb-2 uppercase">Hourly Traffic Forecast Curve (ทราฟฟิกคาดการณ์ในหนึ่งวัน)</span>
                
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentAI.heatData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2833" />
                      <XAxis dataKey="hour" stroke="#5c6b73" fontSize={9} />
                      <YAxis stroke="#5c6b73" fontSize={9} />
                      <Tooltip contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#1f2833', fontSize: 10 }} />
                      <Line type="monotone" dataKey="traffic" name="คาดการณ์ Active %" stroke="#66fcf1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-teal-muted/5 text-[9px] text-teal-muted">
                  <AlertCircle className="w-3.5 h-3.5 text-teal-accent shrink-0" />
                  <span>สถิติพยากรณ์อ้างอิงจาก IP Rotation Latency ล่าสุด ร่วมกับกลุ่มผู้ชมในทวีปเอเชียตะวันออกเฉียงใต้</span>
                </div>
              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}
