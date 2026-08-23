import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  fetchAdminStatsApi,
  fetchAdminUsersApi,
  deleteAdminUserApi,
  createAdminCareerApi,
  createAdminResourceApi,
  resetDatabaseApi
} from '../../lib/api';
import {
  Users,
  FileText,
  TrendingUp,
  BookOpen,
  Plus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  Database,
  CheckCircle2,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { adminUser, logoutAdmin } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'careers' | 'resources' | 'system'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState('');

  // Career form state
  const [newCareerDomain, setNewCareerDomain] = useState('');
  const [newCareerRole, setNewCareerRole] = useState('');
  const [newCareerDesc, setNewCareerDesc] = useState('');
  const [newCareerSalary, setNewCareerSalary] = useState('');
  const [newCareerSkills, setNewCareerSkills] = useState('');

  // Resource form state
  const [newResTitle, setNewResTitle] = useState('');
  const [newResPlatform, setNewResPlatform] = useState('YouTube');
  const [newResChannel, setNewResChannel] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResSkill, setNewResSkill] = useState('');
  const [newResDuration, setNewResDuration] = useState('');
  const [newResDiff, setNewResDiff] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newResDesc, setNewResDesc] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const s = await fetchAdminStatsApi();
      setStats(s.stats);
      const u = await fetchAdminUsersApi();
      setUsersList(u.users || []);
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user and their resume data?')) {
      await deleteAdminUserApi(userId);
      showToast('info', 'User Deleted', 'User and resume data removed.');
      loadData();
    }
  };

  const handleAddCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareerRole.trim() || !newCareerDomain.trim()) return;

    await createAdminCareerApi({
      domain: newCareerDomain.trim(),
      roleName: newCareerRole.trim(),
      shortDescription: newCareerDesc.trim() || 'Role benchmark profile',
      averageSalaryRange: newCareerSalary.trim() || '$100,000 - $140,000',
      requiredSkills: newCareerSkills.split(',').map((s) => s.trim()).filter(Boolean)
    });

    showToast('success', 'Career Benchmark Created', 'New career role added to system.');
    setNewCareerRole('');
    setNewCareerDesc('');
    setNewCareerSalary('');
    setNewCareerSkills('');
    loadData();
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResUrl.trim()) return;

    await createAdminResourceApi({
      title: newResTitle.trim(),
      platform: newResPlatform,
      channelOrAuthor: newResChannel.trim() || 'Tech Educator',
      url: newResUrl.trim(),
      skill: newResSkill.trim() || 'Software Engineering',
      duration: newResDuration.trim() || '45 mins',
      difficulty: newResDiff,
      description: newResDesc.trim() || 'Curated video guide.'
    });

    showToast('success', 'Resource Added', 'Learning resource added to library.');
    setNewResTitle('');
    setNewResChannel('');
    setNewResUrl('');
    setNewResSkill('');
    setNewResDuration('');
    setNewResDesc('');
    loadData();
  };

  const handleResetDatabase = async () => {
    if (confirm('Reset prototype database back to initial seed data?')) {
      await resetDatabaseApi();
      showToast('info', 'Database Reset', 'Database reset and re-seeded successfully.');
      loadData();
    }
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.targetDomain && u.targetDomain.toLowerCase().includes(searchUser.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Admin Control Center
            </span>
            <span className="text-xs text-slate-500 font-medium">Authenticated: {adminUser?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Platform Management & Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-normal">
            Monitor applicant intake, manage curated YouTube lectures, configure industry benchmark standards, and inspect ATS algorithms.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-2 text-xs font-bold shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors shadow-2xs"
          >
            Exit Admin Mode
          </button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Total Candidates</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats?.totalUsers || 3}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Active Profiles</span>
        </div>

        <div className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Resumes Uploaded</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats?.totalResumes || 3}</p>
          <span className="text-[10px] text-indigo-600 font-bold">ATS Indexed</span>
        </div>

        <div className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Avg. ATS Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{stats?.avgAtsScore || 82}%</p>
          <span className="text-[10px] text-slate-500 font-bold">Market Benchmark</span>
        </div>

        <div className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Curated Resources</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats?.totalResources || 6}</p>
          <span className="text-[10px] text-amber-600 font-bold">YouTube & Guides</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold">
        {[
          { id: 'overview', label: 'Candidates & Resumes' },
          { id: 'careers', label: 'Add Career Benchmark' },
          { id: 'resources', label: 'Curate YouTube Resources' },
          { id: 'system', label: 'System & Database' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === t.id
                ? 'bg-white text-purple-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CANDIDATES TABLE */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-black text-slate-900">Registered Candidates & ATS Status</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search candidate..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-2xs"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Target Domain</th>
                  <th className="p-4">ATS Score</th>
                  <th className="p-4">Roadmap Progress</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                        {u.targetDomain || 'Full Stack'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900">{u.atsScore ? `${u.atsScore}/100` : '—'}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">{u.roadmapProgress || 0}%</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${u.roadmapProgress || 0}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors shadow-2xs"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ADD CAREER BENCHMARK */}
      {activeTab === 'careers' && (
        <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 max-w-2xl mx-auto space-y-4 shadow-sm">
          <h3 className="font-black text-base text-slate-900">Add New Career Role Benchmark</h3>
          <p className="text-xs text-slate-500 font-normal">Expand the platform by defining a new target career role with required industry skills.</p>

          <form onSubmit={handleAddCareer} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Domain</label>
                <input
                  type="text"
                  value={newCareerDomain}
                  onChange={(e) => setNewCareerDomain(e.target.value)}
                  placeholder="e.g. AI / Machine Learning"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  value={newCareerRole}
                  onChange={(e) => setNewCareerRole(e.target.value)}
                  placeholder="e.g. LLM Systems Engineer"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Average Salary Range</label>
              <input
                type="text"
                value={newCareerSalary}
                onChange={(e) => setNewCareerSalary(e.target.value)}
                placeholder="e.g. $130,000 - $185,000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Required Skills (Comma separated)</label>
              <input
                type="text"
                value={newCareerSkills}
                onChange={(e) => setNewCareerSkills(e.target.value)}
                placeholder="e.g. Python, PyTorch, LangChain, Vector Databases, FastEmbed, Docker"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <textarea
                rows={3}
                value={newCareerDesc}
                onChange={(e) => setNewCareerDesc(e.target.value)}
                placeholder="Description of role responsibilities..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Publish Career Benchmark
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CURATE YOUTUBE RESOURCES */}
      {activeTab === 'resources' && (
        <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 max-w-2xl mx-auto space-y-4 shadow-sm">
          <h3 className="font-black text-base text-slate-900">Add Curated YouTube Video Tutorial</h3>
          <p className="text-xs text-slate-500 font-normal">Add free, high-yield lectures to the student resource feed.</p>

          <form onSubmit={handleAddResource} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Video Title</label>
              <input
                type="text"
                value={newResTitle}
                onChange={(e) => setNewResTitle(e.target.value)}
                placeholder="e.g. Docker & Kubernetes Full Course 2025"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Channel / Author</label>
                <input
                  type="text"
                  value={newResChannel}
                  onChange={(e) => setNewResChannel(e.target.value)}
                  placeholder="e.g. freeCodeCamp / TechWorld with Nana"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={newResUrl}
                  onChange={(e) => setNewResUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Skill</label>
                <input
                  type="text"
                  value={newResSkill}
                  onChange={(e) => setNewResSkill(e.target.value)}
                  placeholder="e.g. Docker"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={newResDuration}
                  onChange={(e) => setNewResDuration(e.target.value)}
                  placeholder="e.g. 3 Hours"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={newResDiff}
                  onChange={(e) => setNewResDiff(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Short Description</label>
              <textarea
                rows={2}
                value={newResDesc}
                onChange={(e) => setNewResDesc(e.target.value)}
                placeholder="What candidates will learn..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              Add Video to Resource Library
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: SYSTEM & DATABASE */}
      {activeTab === 'system' && (
        <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 max-w-2xl mx-auto space-y-6 shadow-sm">
          <div>
            <h3 className="font-black text-base text-slate-900">System Diagnostics & Database Controls</h3>
            <p className="text-xs text-slate-500 mt-1 font-normal">Manage prototype seed state and inspect system services.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Backend Architecture</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Express + In-Memory Database
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">AI Engine</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                Gemini 3.7 Flash (@google/genai)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">ATS Algorithm Model</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                9-Factor Weighted Scoring v4.2
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Danger Zone</h4>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div>
                <p className="font-bold text-xs text-rose-900">Reset Database to Default Seed</p>
                <p className="text-[11px] text-rose-700 font-medium">Restores all sample resumes, benchmarks, and chat logs.</p>
              </div>
              <button
                onClick={handleResetDatabase}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
