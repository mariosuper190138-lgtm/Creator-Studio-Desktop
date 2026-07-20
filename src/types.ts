export interface DailyTasks {
  scrollFeed: boolean;
  watchFullVideo: boolean;
  likeAndComment: boolean;
  postVideo: boolean;
}

export interface TikTokAccount {
  id: number;
  username: string;
  groupId: number; // 1 to 8 (5 accounts per group)
  ixProfileName: string;
  isCreated: boolean;
  createdDate: string;
  status: 'new' | 'farming' | 'ready' | 'shadowbanned';
  dailyTasks: DailyTasks;
  notes: string;
  lastFarmedDate: string | null;
}

export interface IPGroupState {
  groupId: number;
  isIPRotated: boolean;
  lastRotatedTime: string | null;
  currentIP: string;
}

export interface FarmingLog {
  id: string;
  timestamp: string;
  accountId: number;
  accountName: string;
  taskType: keyof DailyTasks | 'create' | 'rotate_ip' | 'sql_query' | 'workflow';
  description: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  message: string;
  timestamp: string;
  read: boolean;
}

// Model & Architecture Interactive Types
export interface CreatorAccount {
  id: string;
  platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram';
  username: string;
  profileName: string;
  proxyIp: string;
  status: 'active' | 'suspended' | 'verification_required' | 'cooldown';
  followersCount: number;
  engagementRate: number;
  monetizationEnabled: boolean;
  createdDate: string;
  notes: string;
  lastActive: string;
}

export interface PublishWorkflow {
  id: string;
  title: string;
  accountId: string;
  platform: 'tiktok' | 'youtube' | 'facebook' | 'instagram';
  contentType: 'video' | 'short_video' | 'image_post';
  scheduledTime: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  videoPath: string;
  description: string;
}

export interface SQLiteTable {
  name: string;
  columns: { name: string; type: string; constraints?: string }[];
  rowCount: number;
}

export interface SQLQueryResult {
  queryId: string;
  sql: string;
  timestamp: string;
  isSuccess: boolean;
  affectedRows: number;
  error?: string;
  columns?: string[];
  rows?: any[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: 'MainProcess' | 'SQLiteEngine' | 'IPCRouter' | 'SchedulerService' | 'AccountRepository';
  message: string;
}

export interface AppConfig {
  theme: 'dark-cyber' | 'light-enterprise' | 'midnight-velvet';
  localDbPath: string;
  autoUpdateBranch: 'stable' | 'beta' | 'nightly';
  isBackupEnabled: boolean;
  securityPin: string;
  apiToken: string;
}
