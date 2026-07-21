import React, { useState } from 'react';
import { 
  Sparkles, 
  Video, 
  Volume2, 
  Clipboard, 
  Check, 
  Hash, 
  Sliders, 
  Upload, 
  Eye, 
  Image as ImageIcon, 
  Flame, 
  Maximize, 
  RefreshCw, 
  Bookmark, 
  FileText 
} from 'lucide-react';
import { CreatorAccount } from '../types';

interface AIContentSuiteProps {
  accounts: CreatorAccount[];
  onAddLog: (message: string, source: "MainProcess" | "SQLiteEngine" | "IPCRouter" | "SchedulerService" | "AccountRepository", level: "info" | "warn" | "error" | "debug") => void;
}

export default function AIContentSuite({ accounts, onAddLog }: AIContentSuiteProps) {
  // Script Generator State
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'fun' | 'formal' | 'selling' | 'dramatic' | 'hype'>('fun');
  const [duration, setDuration] = useState<'15s' | '30s' | '60s' | 'long'>('30s');
  const [platform, setPlatform] = useState<'tiktok' | 'youtube' | 'facebook'>('tiktok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    hooks: string[];
    body: { scene: string; visual: string; audio: string }[];
    captions: string[];
    hashtags: string[];
  } | null>(null);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Thumbnail Preview State
  const [thumbTitle, setThumbTitle] = useState('ความลับที่ช่องใหญ่ไม่เคยบอกคุณ!');
  const [thumbBadge, setThumbBadge] = useState('สายความรู้');
  const [thumbColor, setThumbColor] = useState('#ff2a5f'); // Tiktok pinkish accent
  const [thumbStyle, setThumbStyle] = useState<'bold' | 'minimal' | 'cyberpunk'>('bold');
  const [previewPlatform, setPreviewPlatform] = useState<'tiktok' | 'youtube' | 'instagram'>('tiktok');
  const [thumbFile, setThumbFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Default Thumbnail Presets
  const thumbnailPresets = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=60',
  ];
  const [selectedPreset, setSelectedPreset] = useState(thumbnailPresets[0]);

  // Generate Script Handler
  const handleGenerateScript = () => {
    if (!topic.trim()) {
      onAddLog('กรุณาระบุหัวข้อหรือรายละเอียดคอนเทนต์ที่ต้องการสร้างสคริปต์', 'MainProcess', 'warn');
      return;
    }

    setIsGenerating(true);
    onAddLog(`[AI ENGINE] กำลังส่งคำขอประมวลผลโมดูล Gemini Flash AI วิเคราะห์หัวข้อ: "${topic}"`, 'MainProcess', 'info');

    setTimeout(() => {
      // Logic-based dynamic content generation for real-feeling results
      let hooks: string[] = [];
      let body: { scene: string; visual: string; audio: string }[] = [];
      let captions: string[] = [];
      let hashtags: string[] = [];

      const topicClean = topic.trim();

      if (tone === 'fun') {
        hooks = [
          `🔥 หยุดฟังก่อน! ถ้าคุณไม่อยากพลาดสิ่งนี้...`,
          `😱 ใครจะไปคิดว่า "${topicClean}" จะกลายเป็นเรื่องสุดฮาขนาดนี้!`,
          `👀 รีวิวแบบไม่อวย: ความจริงเบื้องหลัง "${topicClean}" ที่ทุกคนควรรู้`
        ];
        body = [
          { scene: "ฉาก 1: เปิดคลิป", visual: "ทำหน้าตื่นเต้นสุดขีด ชี้ไปที่หัวข้อข้อความตรงหน้า", audio: "ทุกคนนน! รู้จักสิ่งนี้ไหม? วันนี้เราจะมาสรุปเรื่องสุดปังของ " + topicClean + " แบบด่วนจี๋ใน 15 วินาที!" },
          { scene: "ฉาก 2: ขยี้ปม", visual: "ซูมกล้องเข้าใกล้ใบหน้า ใส่เอฟเฟกต์หน้าสั่น", audio: "ปกติคนชอบคิดว่ามันธรรมดาใช่ปะ? แต่จริงๆ แล้วมันมีความลับที่ไม่มีใครบอกคุณเยอะมาก!" },
          { scene: "ฉาก 3: สรุปทีเด็ด", visual: "ตัดภาพสลับไปที่อุปกรณ์ประกอบฉาก หรือตัวอย่างผลลัพธ์", audio: "นั่นแหละครับ! ถ้าไม่อยากตกเทรนด์เรื่องนี้ แนะนำให้กดไลก์แชร์และเซฟคลิปนี้ไว้เลย!" }
        ];
        captions = [
          `สรุปด่วนเรื่อง ${topicClean} แบบเข้าใจง่ายสุดใน 3 โลก! 🤣`,
          `ความลับของ ${topicClean} ที่ไม่มีใครกล้าบอกคุณ... 👀`,
          `ถ้าคุณรู้จัก ${topicClean} คุณจะไม่มีทางก้มหน้ามองมันแบบเดิมอีกต่อไป!`
        ];
        hashtags = [`#${topicClean.replace(/\s+/g, '')}`, '#เรื่องนี้ต้องรู้', '#คลิปฮา', '#ครีเอเตอร์แกะกล่อง', '#เทรนด์วันนี้'];
      } else if (tone === 'selling') {
        hooks = [
          `💰 อย่าเพิ่งซื้อ "${topicClean}" ถ้ายังไม่ได้ดูคลิปนี้!`,
          `🏷️ ป้ายยาด่วน! สรุปความคุ้มค่าของ "${topicClean}" ใน 1 นาที`,
          `✨ อยากชีวิตดีขึ้น 10 เท่า ต้องมีสิ่งนี้ใช่ไหม?`
        ];
        body = [
          { scene: "ฉาก 1: ปัญหาดึงดูด", visual: "ถือของขึ้นมาหน้ากล้องด้วยความมั่นใจ หรือทำท่าวิตกกังวลแก้ไขปัญหา", audio: "กำลังเหนื่อยกับปัญหาเดิมๆ อยู่ใช่ไหมครับ? วันนี้ผมเจอทางออกแล้วด้วย " + topicClean + " ตัวนี้เลย!" },
          { scene: "ฉาก 2: พิสูจน์จุดขาย", visual: "สาธิตการใช้งานจริง เห็นประโยชน์ที่ชัดเจนและจับต้องได้", audio: "ดูตรงนี้สิครับ ใช้งานง่ายแถมประหยัดเวลาสุดๆ เหมาะกับคนยุค 2026 อย่างพวกเรามาก" },
          { scene: "ฉาก 3: Call to Action", visual: "ชี้ไปที่ลิงก์ตะกร้าเหลือง หรือมุมขวาล่างของวิดีโอ", audio: "ใครอยากได้พิกัดความคุ้มค่า กดสั่งซื้อด่วนที่ตะกร้าด้านล่างก่อนของจะหมดนะครับ!" }
        ];
        captions = [
          `ป้ายยาไอเทมเด็ด ${topicClean} ของมันต้องมีจริงๆ ครับรอบนี้! 🛍️`,
          `รีวิวตามจริง ${topicClean} คุ้มค่าแก่การลงทุนไหม? ดูให้จบนะ!`,
          `ลดราคาแรงรอบปี! สนใจพิกัด ${topicClean} อยู่ในตะกร้าเหลืองเลยครับ`
        ];
        hashtags = [`#${topicClean.replace(/\s+/g, '')}`, '#ป้ายยา', '#ของดีบอกต่อ', '#รีวิวของใช้', '#ช้อปปิ้งออนไลน์'];
      } else if (tone === 'hype') {
        hooks = [
          `🚨 ด่วนที่สุด! วงการสั่นสะเทือนเพราะ "${topicClean}"`,
          `😱 พีคมาก! สรุปประเด็นร้อนแรงเกี่ยวกับ "${topicClean}"`,
          `⚠️ เตือนภัย! สิ่งที่คุณต้องระวังด่วนเกี่ยวกับการทำสิ่งนี้`
        ];
        body = [
          { scene: "ฉาก 1: เปิดปมร้อน", visual: "ตัดสลับฉากพาดหัวข่าวใหญ่สีแดงขึ้นเต็มหน้าจอ", audio: "ด่วนที่สุดครับทุกคน! ตอนนี้วงการกำลังเดือดหนักมากเพราะประเด็นของ " + topicClean + " ที่เพิ่งเกิดขึ้น!" },
          { scene: "ฉาก 2: วิเคราะห์ข้อมูลลับ", visual: "โชว์กราฟตัวเลขหรือสถิติขึ้นบนหน้าจอประกอบ", audio: "จากสถิติล่าสุดเผยว่าเรื่องนี้ไม่ใช่เรื่องธรรมดา และมันกำลังส่งผลกระทบต่อเราทุกคนโดยไม่รู้ตัว" },
          { scene: "ฉาก 3: ชวนแชร์ความเห็น", visual: "ก้มเข้าใกล้กล้องชวนคุย", audio: "คุณคิดยังไงกับเรื่องนี้? คอมเมนต์บอกผมหน่อยใต้คลิปนี้ แล้วอย่าลืมแชร์ไปเตือนเพื่อนๆ ด้วยนะครับ!" }
        ];
        captions = [
          `ด่วน! เรื่องนี้เดือดมากสรุปประเด็นร้อน ${topicClean} ที่คุณต้องรู้ด่วน 🚨`,
          `เตือนภัยด่วนระดับสูงสุด! อย่ามองข้ามเรื่อง ${topicClean} เด็ดขาด`,
          `สรุปประเด็นร้อนสัปดาห์นี้ ทุกอย่างเริ่มต้นขึ้นจาก ${topicClean} เท่านั้น`
        ];
        hashtags = [`#${topicClean.replace(/\s+/g, '')}`, '#ข่าววันนี้', '#ประเด็นร้อน', '#เตือนภัย', '#สรุปข่าวสั้น'];
      } else {
        // Formal / Drama
        hooks = [
          `📍 เจาะลึกโครงสร้างระดับลึกของ "${topicClean}"`,
          `💭 บทเรียนราคาแพงจากวิกฤตของ "${topicClean}"`,
          `🧐 ทักษะสำคัญที่คุณต้องมีเพื่อทำความเข้าใจกับเรื่องนี้`
        ];
        body = [
          { scene: "ฉาก 1: เกริ่นนำสารคดี", visual: "จัดแสงสีโทนเย็น นั่งสัมภาษณ์แนวทางการและดูเป็นทางการ", audio: "ยินดีต้อนรับครับ วันนี้เราจะมาเจาะลึกบทวิเคราะห์ที่น่าสนใจเกี่ยวกับ " + topicClean + " ในแง่มุมที่คุณอาจคาดไม่ถึง" },
          { scene: "ฉาก 2: ชำแหละรายละเอียด", visual: "ใช้แอนิเมชั่นอธิบายหัวข้อย่อยๆ สบายตาและเน้นความน่าเชื่อถือ", audio: "ปัจจัยหลักประกอบไปด้วยสามสิ่งที่เราต้องให้ความสำคัญ นั่นคือประสิทธิภาพ การเข้าถึง และการนำไปปรับใช้งานจริง" },
          { scene: "ฉาก 3: บทสรุปเชิงแนวคิด", visual: "ปิดท้ายด้วยโลโก้และช่องทางการติดตามเชิงสาระ", audio: "หวังว่าข้อมูลชุดนี้จะเป็นประโยชน์ต่อการทำงานและการวางแผนของคุณครับ ขอบคุณที่ติดตามชม" }
        ];
        captions = [
          `เจาะลึกสาระสำคัญและบทวิเคราะห์โครงสร้าง ${topicClean} แบบละเอียด 📚`,
          `สรุปถอดบทเรียนธุรกิจระดับโลกจากกรณีศึกษาเรื่อง ${topicClean}`,
          `ทักษะและแนวคิดเชิงลึกเกี่ยวกับการพัฒนาองค์กรด้วย ${topicClean}`
        ];
        hashtags = [`#${topicClean.replace(/\s+/g, '')}`, '#สาระความรู้', '#พัฒนาตนเอง', '#ข้อคิดดีๆ', '#ธุรกิจน่ารู้'];
      }

      setGeneratedScript({ hooks, body, captions, hashtags });
      setIsGenerating(false);
      onAddLog(`[AI ENGINE] สร้างสคริปต์สั้น หัวข้อ "${topicClean}" สำเร็จด้วยโทนเสียง "${tone}"`, 'MainProcess', 'info');
    }, 1500);
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    onAddLog(`[CLIPBOARD] คัดลอกข้อมูลสำเร็จ: ${label}`, 'IPCRouter', 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Drag and Drop handlers for Thumbnail image
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbFile(event.target.result as string);
          onAddLog(`[UPLOAD] โหลดไฟล์ปกคลิปจำลองสำเร็จ: ${file.name}`, 'MainProcess', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbFile(event.target.result as string);
          onAddLog(`[UPLOAD] โหลดไฟล์ปกคลิปจำลองสำเร็จ: ${file.name}`, 'MainProcess', 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="ai-suite-panel">
      
      {/* Upper Grid: Left is Generator, Right is Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Generators (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Script Generator Panel */}
          <div className="glass p-5 rounded-2xl space-y-4" id="ai-script-generator">
            <div className="flex items-center gap-2 pb-2 border-b border-teal-muted/10">
              <Sparkles className="w-5 h-5 text-teal-accent animate-pulse" />
              <div>
                <h3 className="font-bold text-white text-sm">AI Script Generator &amp; Hook Creator</h3>
                <p className="text-[10px] text-teal-muted">สร้างสคริปต์คลิปสั้น วิดีโอสั้น TikTok/Shorts คมชัดด้วย AI อัจฉริยะ</p>
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-teal-muted font-bold block uppercase tracking-wider">หัวข้อไอเดียคอนเทนต์ (Topic / Idea)</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="เช่น เคล็ดลับการแต่งสวนในคอนโด, รีวิวมือถือเรือธง, วิธีออมเงิน 1 แสนแรก..."
                className="w-full bg-bg-dark border border-teal-muted/20 focus:border-teal-accent focus:ring-1 focus:ring-teal-accent rounded-xl p-3 text-white text-xs placeholder:text-teal-muted/40 focus:outline-none"
              />
            </div>

            {/* Grid for parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-teal-muted font-bold block">โทนเสียง / Vibe</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full bg-bg-dark border border-teal-muted/20 focus:border-teal-accent rounded-xl p-2 text-white text-xs focus:outline-none"
                >
                  <option value="fun">🎉 สนุกสนาน / คุยกันเอง</option>
                  <option value="selling">💰 รีวิวป้ายยา / เน้นขายของ</option>
                  <option value="hype">🚨 ดราม่า / ตื่นเต้นกระแสร้อน</option>
                  <option value="formal">📚 เป็นทางการ / ให้สาระจริงจัง</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-teal-muted font-bold block">เป้าหมายวิดีโอ (Target)</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full bg-bg-dark border border-teal-muted/20 focus:border-teal-accent rounded-xl p-2 text-white text-xs focus:outline-none"
                >
                  <option value="tiktok">TikTok Video (9:16)</option>
                  <option value="youtube">YouTube Shorts (9:16)</option>
                  <option value="facebook">Facebook Reels (9:16)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-teal-muted font-bold block">ระยะเวลาคลิป (Duration)</label>
                <div className="flex bg-bg-dark border border-teal-muted/20 rounded-xl p-0.5">
                  {(['15s', '30s', '60s'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 text-[10px] py-1.5 font-bold rounded-lg transition-all ${
                        duration === d 
                          ? 'bg-teal-accent text-bg-dark' 
                          : 'text-teal-muted hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-teal-accent to-emerald-400 hover:opacity-90 active:scale-95 disabled:opacity-50 text-bg-dark font-black py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(102,252,241,0.2)] flex items-center justify-center gap-2 cursor-pointer text-xs uppercase"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  กำลังประมวลผลโมดูล AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Hooks &amp; Full Script (สร้างสคริปต์ด่วน)
                </>
              )}
            </button>
          </div>

          {/* Results display */}
          {generatedScript && (
            <div className="glass p-5 rounded-2xl space-y-5 animate-fade-in border border-teal-accent/20">
              <div className="flex justify-between items-center pb-2 border-b border-teal-muted/10">
                <span className="text-xs font-black text-teal-accent flex items-center gap-1.5 font-mono">
                  <FileText className="w-4 h-4" />
                  AI GENERATED RESULTS
                </span>
                <button
                  onClick={() => copyToClipboard(
                    `=== HOOKS ===\n${generatedScript.hooks.join('\n')}\n\n=== SCRIPT ===\n${generatedScript.body.map(b => `[${b.scene}] Visual: ${b.visual}\nAudio: ${b.audio}`).join('\n\n')}`,
                    'full_script'
                  )}
                  className="text-[10px] text-teal-muted hover:text-white flex items-center gap-1 bg-bg-dark border border-teal-muted/10 px-2 py-1 rounded"
                >
                  {copiedText === 'full_script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                  Copy Full Package
                </button>
              </div>

              {/* Hook creator block */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span className="text-[11px] font-bold text-white uppercase">ประโยคเกริ่นนำสะกดสายตา (Hook Ideas):</span>
                </div>
                <div className="space-y-2">
                  {generatedScript.hooks.map((hook, idx) => (
                    <div key={idx} className="bg-bg-dark/60 border border-teal-muted/15 p-2.5 rounded-xl flex items-start justify-between gap-3 text-xs leading-relaxed">
                      <span className="text-teal-accent font-mono font-bold shrink-0 mt-0.5">#0{idx+1}</span>
                      <p className="text-teal-muted flex-1 text-xs">{hook}</p>
                      <button
                        onClick={() => copyToClipboard(hook, `hook_${idx}`)}
                        className="text-teal-muted hover:text-white shrink-0"
                        title="Copy hook"
                      >
                        {copiedText === `hook_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Clipboard className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Structured Video Script */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-white uppercase block">สคริปต์วิดีโอแบบแยกตอน (Segmented Video Script):</span>
                <div className="space-y-3">
                  {generatedScript.body.map((item, idx) => (
                    <div key={idx} className="bg-bg-dark/40 border border-teal-muted/10 rounded-xl overflow-hidden text-xs">
                      <div className="bg-bg-dark px-3 py-1.5 border-b border-teal-muted/10 flex justify-between items-center">
                        <span className="font-bold text-teal-accent font-mono text-[10px]">{item.scene}</span>
                        <span className="text-[9px] text-teal-muted font-mono">STEP {idx + 1}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1 p-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                            <span className="text-[9px] text-indigo-400 font-bold block uppercase font-mono">🎬 ภาพแนะนำ (Visual Cue)</span>
                            <p className="text-teal-muted text-[11px] leading-relaxed">{item.visual}</p>
                          </div>
                          <div className="space-y-1 p-2 bg-teal-accent/5 border border-teal-accent/10 rounded-lg">
                            <span className="text-[9px] text-teal-accent font-bold block uppercase font-mono">🔊 คำพูด (Audio Dialogue)</span>
                            <p className="text-white text-[11px] leading-relaxed">{item.audio}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Captions and Hashtags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-bg-dark/30 border border-teal-muted/10 p-3 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white font-mono flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-teal-accent" />
                      AUTO CAPTIONS
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedScript.captions.join('\n\n'), 'captions')}
                      className="text-[9px] text-teal-muted hover:text-white"
                    >
                      {copiedText === 'captions' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {generatedScript.captions.map((cap, i) => (
                      <p key={i} className="text-[11px] text-teal-muted/90 bg-bg-dark/50 p-2 rounded border border-teal-muted/5 leading-normal">
                        {cap}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 bg-bg-dark/30 border border-teal-muted/10 p-3 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white font-mono flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      TRENDING HASHTAGS
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedScript.hashtags.join(' '), 'tags')}
                      className="text-[9px] text-teal-muted hover:text-white"
                    >
                      {copiedText === 'tags' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {generatedScript.hashtags.map((tag, i) => (
                      <span 
                        key={i} 
                        onClick={() => copyToClipboard(tag, `tag_${i}`)}
                        className="text-[10px] bg-bg-dark border border-teal-accent/15 text-teal-accent px-2 py-0.5 rounded font-mono font-semibold hover:border-teal-accent cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[9px] text-teal-muted mt-2 leading-relaxed">
                    💡 คลิกที่แฮชแท็กใดๆ เพื่อคัดลอกเฉพาะคำนั้นได้ทันที
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Thumbnail Mockup & Multi-platform previews (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-5 rounded-2xl space-y-4" id="thumbnail-suite">
            <div className="flex items-center gap-2 pb-2 border-b border-teal-muted/10">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-sm">Smart Thumbnail Generator Preview</h3>
                <p className="text-[10px] text-teal-muted">จำลองพรีวิวปกบนแพลตฟอร์มต่างๆ แบบเรียลไทม์</p>
              </div>
            </div>

            {/* Platform select to toggle container layouts */}
            <div className="flex bg-bg-dark border border-teal-muted/20 rounded-xl p-0.5" id="preview-platform-tabs">
              {(['tiktok', 'youtube', 'instagram'] as const).map((plat) => (
                <button
                  key={plat}
                  type="button"
                  onClick={() => setPreviewPlatform(plat)}
                  className={`flex-1 text-[10px] py-1.5 font-bold rounded-lg transition-all capitalize ${
                    previewPlatform === plat 
                      ? 'bg-indigo-500 text-white' 
                      : 'text-teal-muted hover:text-white'
                  }`}
                >
                  {plat === 'tiktok' ? 'TikTok Feed' : plat === 'youtube' ? 'YT Shorts' : 'Instagram Feed'}
                </button>
              ))}
            </div>

            {/* Design Controls */}
            <div className="space-y-3 bg-bg-dark/40 border border-teal-muted/10 p-3 rounded-xl text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-teal-muted font-bold block uppercase">หัวข้อพาดหัวบนปก (Thumbnail Text)</label>
                <input
                  type="text"
                  value={thumbTitle}
                  onChange={(e) => setThumbTitle(e.target.value)}
                  placeholder="พิมพ์หัวข้อปกคลิปด่วน..."
                  className="w-full bg-bg-dark border border-teal-muted/20 focus:border-teal-accent rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-teal-muted font-bold block uppercase">ป้ายกำกับ (Badge)</label>
                  <input
                    type="text"
                    value={thumbBadge}
                    onChange={(e) => setThumbBadge(e.target.value)}
                    placeholder="เช่น รีวิวด่วน, ป้ายยา"
                    className="w-full bg-bg-dark border border-teal-muted/20 focus:border-teal-accent rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-teal-muted font-bold block uppercase">โทนสี Badge</label>
                  <div className="flex items-center gap-1.5 bg-bg-dark border border-teal-muted/20 rounded-lg p-1">
                    <input 
                      type="color" 
                      value={thumbColor} 
                      onChange={(e) => setThumbColor(e.target.value)}
                      className="w-6 h-6 border-0 rounded bg-transparent cursor-pointer shrink-0"
                    />
                    <span className="font-mono text-[10px] text-teal-muted truncate">{thumbColor}</span>
                  </div>
                </div>
              </div>

              {/* Preset Image list / Upload block */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-teal-muted font-bold block uppercase">ภาพพื้นหลัง (Cover Backdrop)</label>
                <div className="grid grid-cols-4 gap-2">
                  {thumbnailPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset);
                        setThumbFile(null); // Clear manual upload when preset selected
                      }}
                      className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all ${
                        selectedPreset === preset && !thumbFile ? 'border-teal-accent scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={preset} alt={`preset ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                  
                  {/* File Upload Button Trigger */}
                  <label className="border-2 border-dashed border-teal-muted/30 hover:border-teal-accent/50 rounded-md aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors text-[9px] text-teal-muted">
                    <Upload className="w-3.5 h-3.5 mb-0.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </label>
                </div>
              </div>
            </div>

            {/* REAL-TIME SIMULATED PHONE VIEW IN THE MIDNIGHT VELVET STYLE */}
            <div className="flex flex-col items-center pt-2">
              <span className="text-[9px] font-mono font-bold text-teal-muted uppercase mb-2 flex items-center gap-1">
                <Eye className="w-3 h-3 text-indigo-400" />
                Live Overlay Simulator Screen
              </span>

              {/* The Phone Container */}
              <div className="w-[280px] h-[497px] bg-[#070709] rounded-[32px] border-[4px] border-[#1d1d24] relative shadow-2xl overflow-hidden flex flex-col justify-between">
                
                {/* Camera punch hole */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#1d1d24] rounded-full z-20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#070709] block" />
                </div>

                {/* Cover backdrop image */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={thumbFile || selectedPreset} 
                    alt="Mock backdrop" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                </div>

                {/* Cover Texts and UI Overlays based on platform selection */}
                {previewPlatform === 'tiktok' && (
                  <>
                    {/* Top icons */}
                    <div className="relative z-10 p-4 pt-6 flex justify-between items-center text-white text-[10px] font-bold">
                      <span className="font-mono">Live</span>
                      <div className="flex gap-3 text-white/80">
                        <span className="underline">Following</span>
                        <span className="text-white border-b-2 border-white pb-0.5">For You</span>
                      </div>
                      <span className="opacity-0">Null</span>
                    </div>

                    {/* Left & Right layout */}
                    <div className="relative z-10 p-3 pb-6 flex justify-between items-end h-full">
                      
                      {/* Left Info (Username, description, text layout overlay) */}
                      <div className="flex-1 space-y-2 pr-4 text-left">
                        {/* THE AI THUMBNAIL TEXT OVERLAY */}
                        <div className="bg-black/75 border-l-4 border-teal-accent p-2 rounded-r-lg max-w-[190px] shadow-lg">
                          {thumbBadge && (
                            <span 
                              style={{ backgroundColor: thumbColor }} 
                              className="text-[7px] text-white font-bold px-1.5 py-0.2 rounded font-sans uppercase block w-max mb-1"
                            >
                              {thumbBadge}
                            </span>
                          )}
                          <p className="text-[10px] font-black text-white leading-snug font-sans tracking-wide">
                            {thumbTitle}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-white">@{accounts[0]?.username || 'creator_suite'}</p>
                          <p className="text-[8px] text-white/90 leading-normal line-clamp-2">
                            {thumbTitle} อย่าลืมกดติดตามพวกเรานะครับ! #automation #ai #reels
                          </p>
                          <span className="text-[7px] text-white/50 bg-white/10 px-1.5 py-0.5 rounded-full inline-block font-mono">
                            🎵 Original Sound - {accounts[0]?.profileName || 'Creator Studio'}
                          </span>
                        </div>
                      </div>

                      {/* Right Icons column */}
                      <div className="flex flex-col items-center gap-3.5 text-white pb-1.5">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full border border-teal-accent bg-bg-dark overflow-hidden flex items-center justify-center font-mono text-[9px] font-bold">
                            CS
                          </div>
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#ff2a5f] text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">+</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">❤️</span>
                          <span className="text-[8px] font-bold">142K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">💬</span>
                          <span className="text-[8px] font-bold">1.2K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">⭐</span>
                          <span className="text-[8px] font-bold">8.4K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">↪️</span>
                          <span className="text-[8px] font-bold">4.2K</span>
                        </div>
                      </div>

                    </div>
                  </>
                )}

                {previewPlatform === 'youtube' && (
                  <>
                    {/* Top icons */}
                    <div className="relative z-10 p-4 pt-6 flex justify-between items-center text-white text-[10px] font-bold">
                      <span className="font-mono text-red-500 font-black flex items-center gap-0.5">⚡ Shorts</span>
                      <span className="text-white/80">Subscriptions</span>
                    </div>

                    {/* YT overlay */}
                    <div className="relative z-10 p-3 pb-6 flex justify-between items-end h-full">
                      <div className="flex-1 space-y-2.5 pr-4 text-left">
                        {/* YT-styled Big Bold text overlay */}
                        <div className="bg-red-600 border border-white/20 p-2.5 rounded shadow-xl max-w-[190px]">
                          {thumbBadge && (
                            <span className="bg-black text-[7px] text-white font-mono font-bold px-1.5 py-0.2 rounded uppercase block w-max mb-1">
                              {thumbBadge}
                            </span>
                          )}
                          <p className="text-[11px] font-extrabold text-white uppercase leading-tight tracking-wider font-sans">
                            {thumbTitle}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[8px] flex items-center justify-center">YT</div>
                            <span className="text-[9px] font-bold text-white">@{accounts[1]?.username || 'companion'}</span>
                            <span className="bg-red-600 text-[8px] text-white font-bold px-1.5 py-0.2 rounded">Subscribe</span>
                          </div>
                          <p className="text-[8px] text-white/90 leading-tight">
                            {thumbTitle} ... เจาะลึก Shorts ยอดนิยมสัปดาห์นี้!
                          </p>
                        </div>
                      </div>

                      {/* Right menu */}
                      <div className="flex flex-col items-center gap-4 text-white pb-1.5">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">👍</span>
                          <span className="text-[8px] font-bold">89K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">👎</span>
                          <span className="text-[8px] font-bold">Dislike</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">💬</span>
                          <span className="text-[8px] font-bold">542</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">↪️</span>
                          <span className="text-[8px] font-bold">Share</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">🔄</span>
                          <span className="text-[8px] font-bold">Remix</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {previewPlatform === 'instagram' && (
                  <>
                    {/* Top icons */}
                    <div className="relative z-10 p-4 pt-6 flex justify-between items-center text-white text-[11px] font-bold">
                      <span className="font-sans">Reels</span>
                      <span>📷</span>
                    </div>

                    {/* Insta overlay */}
                    <div className="relative z-10 p-3 pb-6 flex justify-between items-end h-full">
                      <div className="flex-1 space-y-3 pr-4 text-left">
                        {/* Cyberpunk or minimal text overlay */}
                        <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-purple-500/35 p-2 rounded-xl max-w-[190px] shadow-2xl">
                          <span 
                            style={{ color: thumbColor }} 
                            className="text-[8px] font-mono font-black uppercase tracking-widest block mb-0.5"
                          >
                            ⭐ {thumbBadge || 'REELS TOP'}
                          </span>
                          <p className="text-[10px] font-bold text-slate-100 font-sans">
                            {thumbTitle}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1px]">
                              <div className="w-full h-full rounded-full bg-bg-dark text-white font-bold text-[7px] flex items-center justify-center">IG</div>
                            </div>
                            <span className="text-[9px] font-bold text-white">@{accounts[4]?.username || 'diary'}</span>
                            <span className="border border-white/40 text-[7px] text-white px-1.5 py-0.2 rounded font-semibold">Follow</span>
                          </div>
                          <p className="text-[8px] text-white/90">
                            {thumbTitle} #reels #trend2026 #instagramth
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4 text-white pb-1.5">
                        <div className="flex flex-col items-center">
                          <span className="text-sm">❤️</span>
                          <span className="text-[8px] font-bold">23.5K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">💬</span>
                          <span className="text-[8px] font-bold">184</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">✈️</span>
                          <span className="text-[8px] font-bold">Share</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-sm">⋮</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
