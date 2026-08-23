import { ResumeDocument, UserProfile, LearningResource, RecommendedProject, AdminAnalytics, ChatMessage } from '../types';

export const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function loginUser(identifier: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  education: string;
  graduationYear: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function sendOtp(phone: string) {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
  return data;
}

export async function verifyOtp(payload: { phone: string; otpCode: string; name?: string; education?: string; graduationYear?: string }) {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'OTP verification failed');
  return data;
}

export async function forgotPassword(identifier: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, newPassword })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Password reset failed');
  return data;
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Admin login failed');
  return data;
}

export async function fetchUserMe(userId: string) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { 'x-user-id': userId }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
  return data;
}

// Resume API
export async function uploadResumeApi(payload: {
  userId: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  rawText?: string;
  sampleId?: string;
}) {
  const res = await fetch(`${API_BASE}/resume/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export async function triggerAnalyzeResume(userId: string, preferredDomain?: string) {
  const res = await fetch(`${API_BASE}/resume/${userId}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferredDomain })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Analysis failed');
  return data;
}

export async function getResumeApi(userId: string): Promise<ResumeDocument> {
  const res = await fetch(`${API_BASE}/resume/${userId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch resume');
  return data;
}

export async function updateExtractedDataApi(userId: string, extractedData: any) {
  const res = await fetch(`${API_BASE}/resume/${userId}/extracted`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ extractedData })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update details');
  return data;
}

export async function deleteResumeApi(userId: string) {
  const res = await fetch(`${API_BASE}/resume/${userId}`, { method: 'DELETE' });
  return res.json();
}

// Career API
export async function selectCareerDomainApi(userId: string, domain: string) {
  const res = await fetch(`${API_BASE}/career/select-domain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, domain })
  });
  return res.json();
}

export async function selectCareerRoleApi(userId: string, careerRoleId: string) {
  const res = await fetch(`${API_BASE}/career/select-role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, careerRoleId })
  });
  return res.json();
}

// Roadmap API
export async function toggleRoadmapTaskApi(userId: string, taskId: string, completed: boolean, notes?: string) {
  const res = await fetch(`${API_BASE}/roadmap/toggle-task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, taskId, completed, notes })
  });
  return res.json();
}

export async function updateTaskNotesApi(userId: string, taskId: string, notes: string) {
  const res = await fetch(`${API_BASE}/roadmap/update-notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, taskId, notes })
  });
  return res.json();
}

// Resources & Projects API
export async function fetchResourcesApi(params?: { domain?: string; skill?: string; difficulty?: string }) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}/resources?${query}`);
  return res.json();
}

export async function fetchProjectsApi(): Promise<{ projects: RecommendedProject[] }> {
  const res = await fetch(`${API_BASE}/resources/projects`);
  return res.json();
}

// Chat API
export async function fetchChatHistoryApi(userId: string): Promise<{ messages: ChatMessage[] }> {
  const res = await fetch(`${API_BASE}/chat/${userId}`);
  return res.json();
}

export async function sendChatMessageApi(userId: string, message: string, resumeContext?: any) {
  const res = await fetch(`${API_BASE}/chat/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, resumeContext })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}

export async function clearChatHistoryApi(userId: string) {
  const res = await fetch(`${API_BASE}/chat/${userId}`, { method: 'DELETE' });
  return res.json();
}

// Admin API
export async function fetchAdminAnalyticsApi() {
  const res = await fetch(`${API_BASE}/admin/analytics`, {
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function fetchAdminUsersApi(search?: string, status?: string, domain?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (domain) params.append('domain', domain);
  const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function toggleUserStatusApi(userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function deleteUserApi(userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function fetchAdminCareersApi() {
  const res = await fetch(`${API_BASE}/admin/careers`, {
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function createAdminCareerApi(careerData: any) {
  const res = await fetch(`${API_BASE}/admin/careers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
    body: JSON.stringify(careerData)
  });
  return res.json();
}

export async function deleteAdminCareerApi(id: string) {
  const res = await fetch(`${API_BASE}/admin/careers/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function fetchAdminSkillsApi() {
  const res = await fetch(`${API_BASE}/admin/skills`, {
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function createAdminSkillApi(skillData: any) {
  const res = await fetch(`${API_BASE}/admin/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
    body: JSON.stringify(skillData)
  });
  return res.json();
}

export async function deleteAdminSkillApi(id: string) {
  const res = await fetch(`${API_BASE}/admin/skills/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function fetchAdminResourcesApi() {
  const res = await fetch(`${API_BASE}/admin/resources`, {
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function createAdminResourceApi(resourceData: any) {
  const res = await fetch(`${API_BASE}/admin/resources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-role': 'admin' },
    body: JSON.stringify(resourceData)
  });
  return res.json();
}

export async function fetchAdminStatsApi() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function deleteAdminUserApi(userId: string) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function resetDatabaseApi() {
  const res = await fetch(`${API_BASE}/admin/reset-database`, {
    method: 'POST',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}

export async function deleteAdminResourceApi(id: string) {
  const res = await fetch(`${API_BASE}/admin/resources/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-role': 'admin' }
  });
  return res.json();
}
