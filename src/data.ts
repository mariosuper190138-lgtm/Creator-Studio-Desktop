import { TikTokAccount, IPGroupState } from './types';

// รายการ IP มือถือของไทยจำลอง (AIS, True, DTAC) ที่จะเปลี่ยนเมื่อสลับ Airplane Mode
export const THAI_MOBILE_IPS = [
  '223.24.182.45',
  '223.24.95.121',
  '49.228.102.13',
  '49.228.241.87',
  '182.232.14.201',
  '182.232.88.54',
  '171.96.220.15',
  '171.96.44.110',
  '115.87.192.64',
  '115.87.23.109',
  '58.8.152.190',
  '58.8.81.42',
  '124.122.203.9',
  '124.122.15.54'
];

export const getRandomMobileIP = (): string => {
  const index = Math.floor(Math.random() * THAI_MOBILE_IPS.length);
  return THAI_MOBILE_IPS[index];
};

export const getInitialAccounts = (): TikTokAccount[] => {
  const accounts: TikTokAccount[] = [];
  
  // สร้าง 40 บัญชี แบ่งเป็น 8 กลุ่ม กลุ่มละ 5 บัญชี
  for (let i = 1; i <= 40; i++) {
    const groupId = Math.ceil(i / 5);
    
    // ตั้งค่าตามหลักความเป็นจริง: 
    // - บัญชี 1-15: สร้างแล้วและกำลังฟาร์มอย่างปลอดภัย (ฟาร์มมาแล้วหลายวัน)
    // - บัญชี 16-25: ทยอยสร้างและเริ่มฟาร์ม
    // - บัญชี 26-30: สร้างวันนี้
    // - บัญชี 31-40: ยังไม่ได้สร้าง (จำกัด 10 บัญชีต่อวันในแผน ixBrowser ฟรี)
    
    let isCreated = false;
    let status: 'new' | 'farming' | 'ready' | 'shadowbanned' = 'new';
    let createdDate = '';
    let notes = '';

    if (i <= 15) {
      isCreated = true;
      status = 'ready'; // บัญชีแข็งแรงแล้ว ท่องฟีดผ่าน
      createdDate = `2026-07-${10 + Math.floor(i / 3)}`;
      notes = 'บัญชีแข็งแรงดี วิดีโอผ่านการฟาร์ม 5 วันแรกแล้ว';
    } else if (i <= 25) {
      isCreated = true;
      status = 'farming'; // อยู่ในระหว่างฟาร์ม 5 วันแรก
      createdDate = `2026-07-${15 + Math.floor(i / 3)}`;
      notes = 'ฟาร์มปฏิสัมพันธ์รายวัน ท่องฟีดและกดไลก์';
    } else if (i <= 30) {
      isCreated = true;
      status = 'new';
      createdDate = '2026-07-20'; // สร้างวันนี้
      notes = 'สมัครวันนี้จาก ixBrowser โปรไฟล์ที่ ' + i;
    } else {
      isCreated = false;
      status = 'new';
      createdDate = '';
      notes = 'รอสมัครในวันถัดไป (รักษาระยะห่าง 10 โปรไฟล์/วัน)';
    }

    accounts.push({
      id: i,
      username: isCreated ? `tiktok.user_${i.toString().padStart(2, '0')}` : `(ยังไม่ได้ลงทะเบียน)`,
      groupId,
      ixProfileName: `ix-profile-tk${i.toString().padStart(2, '0')}`,
      isCreated,
      createdDate,
      status,
      dailyTasks: {
        scrollFeed: false,
        watchFullVideo: false,
        likeAndComment: false,
        postVideo: false,
      },
      notes,
      lastFarmedDate: null,
    });
  }

  return accounts;
};

export const getInitialIPGroups = (): IPGroupState[] => {
  const groups: IPGroupState[] = [];
  for (let i = 1; i <= 8; i++) {
    groups.push({
      groupId: i,
      isIPRotated: false,
      lastRotatedTime: null,
      currentIP: '182.232.xx.xx (ยังไม่ระบุ)',
    });
  }
  return groups;
};
