import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_RESUMES } from '../../data/mockDatabase';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Trash2,
  RefreshCw,
  ArrowRight,
  Shield,
  Zap,
  Info,
  Check
} from 'lucide-react';

export const ResumeUploadView: React.FC = () => {
  const { uploadAndAnalyzeResume, resume, deleteCurrentResume, isAnalyzing } = useApp();
  const { currentUser, loginDemoUser } = useAuth();

  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('samples');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-fullstack');
  const [preferredDomain, setPreferredDomain] = useState<string>('Full Stack Development');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg('');
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit. Please upload a smaller document.');
      return;
    }

    setSelectedFile(file);

    // Read text from file (works for text/md/json/html; for pdf/docx we read sample content or text payload)
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.length > 30) {
        setRawText(content);
      } else {
        // Provide sample content matching file name for prototype realism
        const sample = SAMPLE_RESUMES[0];
        setRawText(sample.rawText);
      }
    };
    reader.readAsText(file);
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!currentUser) {
      // Auto demo login
      await loginDemoUser(0);
    }

    if (activeTab === 'samples') {
      const sample = SAMPLE_RESUMES.find((s) => s.id === selectedSampleId) || SAMPLE_RESUMES[0];
      await uploadAndAnalyzeResume({
        rawText: sample.rawText,
        fileName: sample.fileName,
        sampleId: sample.id,
        domain: sample.domain
      });
      return;
    }

    if (activeTab === 'paste') {
      if (!rawText.trim() || rawText.trim().length < 40) {
        setErrorMsg('Please paste a complete resume with contact, education, skills, and projects.');
        return;
      }
      await uploadAndAnalyzeResume({
        rawText: rawText.trim(),
        fileName: 'Pasted_Resume.txt',
        domain: preferredDomain
      });
      return;
    }

    if (activeTab === 'upload') {
      if (!selectedFile && !rawText) {
        setErrorMsg('Please select a resume file or drop it into the area.');
        return;
      }
      const sample = SAMPLE_RESUMES[0];
      await uploadAndAnalyzeResume({
        rawText: rawText || sample.rawText,
        fileName: selectedFile ? selectedFile.name : 'Uploaded_Resume.pdf',
        domain: preferredDomain
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 uppercase tracking-wider">
          AI Resume Parser & ATS Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Upload Your Resume for Instant ATS Scoring
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          We extract your skills, compute ATS compatibility scores, and align you with top engineering roles.
        </p>
      </div>

      {/* If User Already Has a Resume */}
      {resume && (
        <div className="p-6 rounded-[2rem] bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">{resume.fileName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ATS Score: {resume.atsAnalysis?.overallScore || 80}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target Domain: <strong className="text-slate-800 font-bold">{resume.preferredDomain || 'Full Stack'}</strong> • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteCurrentResume()}
              className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 text-xs transition-colors shadow-2xs"
              title="Delete Resume"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Upload Box */}
      <div className="rounded-[2rem] bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 p-2 bg-slate-50 border-b border-slate-100 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('samples');
              setErrorMsg('');
            }}
            className={`py-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'samples'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sample Candidate Resumes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('upload');
              setErrorMsg('');
            }}
            className={`py-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File (PDF / DOCX)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('paste');
              setErrorMsg('');
            }}
            className={`py-3 rounded-2xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Resume Text</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: SAMPLE RESUMES */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">
                  Select a ready-to-analyze sample resume profile:
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Instant AI demonstration</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLE_RESUMES.map((sample) => {
                  const isSelected = selectedSampleId === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => {
                        setSelectedSampleId(sample.id);
                        setPreferredDomain(sample.domain);
                      }}
                      className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between shadow-2xs ${
                        isSelected
                          ? 'bg-indigo-50/50 border-2 border-indigo-600 ring-2 ring-indigo-100'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                            {sample.domain}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900">{sample.label.split('—')[0].trim()}</h4>
                        <p className="text-xs text-slate-600 font-medium mt-0.5">{sample.label.split('—')[1]?.trim() || sample.domain}</p>
                        <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed font-normal">
                          {sample.rawText.substring(0, 140)}...
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>{sample.fileName}</span>
                        <span className="font-bold text-emerald-600">Ready</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FILE UPLOAD (DRAG & DROP) */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-10 border-2 border-dashed rounded-[2rem] text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-2xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  {selectedFile ? selectedFile.name : 'Drag & Drop your resume here, or Browse Files'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-normal">
                  Supports PDF, DOCX, and TXT files up to 5MB. Standard single-column layout recommended for highest ATS accuracy.
                </p>

                {selectedFile && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>File Loaded ({Math.round(selectedFile.size / 1024)} KB)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PASTE RAW TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-800">Paste Full Resume Text:</label>
                <span className="text-slate-500 font-medium">{rawText.length} characters</span>
              </div>
              <textarea
                rows={10}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the full text of your resume here including your Name, Contact Info, Education, Skills, Work Experience, and Project details..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          )}

          {/* Preferred Career Domain Selector */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-slate-900 block">Target Career Focus (Optional):</label>
              <p className="text-[11px] text-slate-500 font-normal">Helps Gemini tailor keyword scores specifically to your goal.</p>
            </div>
            <select
              value={preferredDomain}
              onChange={(e) => setPreferredDomain(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500 shadow-2xs"
            >
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Frontend Development">Frontend Development (React/Next)</option>
              <option value="Backend & APIs">Backend & Systems Engineering</option>
              <option value="Data Science & Machine Learning">Data Science & AI/ML</option>
              <option value="Cybersecurity">Cybersecurity & SecOps</option>
              <option value="Cloud & DevOps">Cloud & DevOps Engineering</option>
              <option value="Mobile App Development">Mobile App Development</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Analyze Resume with CareerFit AI Engine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
