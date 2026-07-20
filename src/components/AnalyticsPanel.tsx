import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Award, Percent } from 'lucide-react';
import { CreatorAccount } from '../types';

interface AnalyticsPanelProps {
  accounts: CreatorAccount[];
}

export default function AnalyticsPanel({ accounts }: AnalyticsPanelProps) {
  // Aggregate Stats
  const totalFollowers = accounts.reduce((acc, a) => acc + a.followersCount, 0);
  const avgEngagement = accounts.length > 0 
    ? (accounts.reduce((acc, a) => acc + a.engagementRate, 0) / accounts.length).toFixed(1)
    : '0.0';
  const monetizedCount = accounts.filter(a => a.monetizationEnabled).length;
  const monetizationRate = accounts.length > 0
    ? ((monetizedCount / accounts.length) * 100).toFixed(0)
    : '0';

  // Growth Data (Simulated daily reach graph)
  const growthData = [
    { name: 'จ.', followers: 160000, reach: 240000 },
    { name: 'อ.', followers: 168000, reach: 290000 },
    { name: 'พ.', followers: 172000, reach: 310000 },
    { name: 'พฤ.', followers: 185000, reach: 420000 },
    { name: 'ศ.', followers: 198000, reach: 490000 },
    { name: 'ส.', followers: 215000, reach: 580000 },
    { name: 'อา.', followers: totalFollowers > 0 ? totalFollowers : 221400, reach: 640000 }
  ];

  // Platform Breakdown data
  const platformData = [
    { name: 'TikTok', accounts: accounts.filter(a => a.platform === 'tiktok').length, engagement: 6.8 },
    { name: 'YouTube', accounts: accounts.filter(a => a.platform === 'youtube').length, engagement: 12.1 },
    { name: 'Facebook', accounts: accounts.filter(a => a.platform === 'facebook').length, engagement: 3.1 },
    { name: 'Instagram', accounts: accounts.filter(a => a.platform === 'instagram').length, engagement: 6.8 }
  ];

  return (
    <div className="glass p-6 rounded-2xl" id="analytics-panel">
      {/* Header */}
      <div className="border-b border-teal-muted/15 pb-4 mb-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-accent" />
          13. Real-Time Analytics &amp; Cross-Platform KPI
        </h3>
        <p className="text-xs text-teal-muted mt-0.5">
          ตัวชี้วัดประสิทธิภาพโดยภาพรวมของครีเอเตอร์ ดัชนีการเข้าถึงผู้ชม และยอดติดตาม
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Total Followers</span>
            <TrendingUp className="w-4 h-4 text-teal-accent" />
          </div>
          <p className="text-lg font-black text-white mt-1">{(totalFollowers > 0 ? totalFollowers : 221400).toLocaleString()}</p>
          <span className="text-[9px] text-emerald-400 mt-0.5 block font-semibold">▲ +12% เทียบกับสัปดาห์ก่อน</span>
        </div>

        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Avg Engagement</span>
            <Percent className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-black text-teal-accent mt-1">{avgEngagement}%</p>
          <span className="text-[9px] text-teal-muted mt-0.5 block">คำนวณเฉลี่ยจากทุกบัญชีผู้ใช้งาน</span>
        </div>

        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Monetization Active</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-black text-white mt-1">{monetizedCount} บัญชี</p>
          <span className="text-[9px] text-emerald-400 mt-0.5 block font-semibold">{monetizationRate}% อัตราสิทธิ์เปิดปักตะกร้า</span>
        </div>

        <div className="bg-bg-dark/40 border border-teal-muted/15 p-4 rounded-xl">
          <div className="flex justify-between items-start">
            <span className="text-teal-muted text-[10px] uppercase font-bold font-mono">Total Registry</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-lg font-black text-white mt-1">{accounts.length} บัญชีในระบบ</p>
          <span className="text-[9px] text-teal-muted mt-0.5 block">จัดเก็บข้อมูลลงฐาน SQLite</span>
        </div>
      </div>

      {/* Recharts Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Area Line Chart */}
        <div className="lg:col-span-8 bg-[#0b0c10] border border-teal-muted/15 p-4 rounded-xl">
          <h4 className="font-bold text-white text-xs mb-3 flex items-center gap-1">
            <span>📈 Follower Growth &amp; View Reach Index</span>
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
                <Area type="monotone" dataKey="followers" name="ผู้ติดตามรวม" stroke="#66fcf1" fillOpacity={1} fill="url(#colorFollow)" />
                <Area type="monotone" dataKey="reach" name="ยอดเข้าถึงรายวัน" stroke="#818cf8" fillOpacity={1} fill="url(#colorReach)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Bar Chart Platform breakdown */}
        <div className="lg:col-span-4 bg-[#0b0c10] border border-teal-muted/15 p-4 rounded-xl">
          <h4 className="font-bold text-white text-xs mb-3">📊 Platform Metrics Comparison</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2833" />
                <XAxis dataKey="name" stroke="#5c6b73" fontSize={9} />
                <YAxis stroke="#5c6b73" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0b0c10', borderColor: '#1f2833', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="accounts" name="จำนวนบัญชี" fill="#818cf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="engagement" name="การมีปฏิสัมพันธ์ (%)" fill="#66fcf1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
