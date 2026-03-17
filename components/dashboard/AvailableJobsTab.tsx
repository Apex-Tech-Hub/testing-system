'use client';

// 🟢 NEW: Imported useState for state management and Loader2 for the loading spinner
import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  GraduationCap, 
  Banknote, 
  Users, 
  Calendar, 
  Download, 
  ArrowRight,
  Loader2
} from "lucide-react";

type Job = {
  id: string | number;
  title: string;
  department: string;
  location: string;
  positions: number;
  salary: string;
  education: string;
  lastDate: string;
  status: string;
  advertisementUrl?: string; // 🟢 NEW: Optional field for future PDF/Image downloads
};

type AvailableJobsTabProps = {
  availableJobs: Job[];
};

export default function AvailableJobsTab({ availableJobs }: AvailableJobsTabProps) {
  // 🟢 NEW: State to track the ID of the job currently being applied to
  const [applyingTo, setApplyingTo] = useState<string | number | null>(null);

  // 🟢 NEW: Asynchronous handler to submit the job application to the backend API
  const handleApply = async (jobId: string | number) => {
    if (!confirm("Are you sure you want to apply for this position?")) return;

    setApplyingTo(jobId);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5064';

      const response = await fetch(`${apiUrl}/api/CandidateDashboard/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobId: Number(jobId) })
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Application Submitted Successfully!");
        
        // 🟢 NEW: Page reload to fetch updated dashboard data (Applied Jobs & Stats)
        window.location.reload(); 
        
      } else {
        alert(`Failed: ${data.message || "Could not submit application."}`);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("A network error occurred while submitting your application.");
    } finally {
      setApplyingTo(null);
    }
  };

  // 🟢 NEW: Handler function for the download advertisement button
  const handleDownload = (url?: string) => {
    if (url) {
      // Opens the advertisement link in a new browser tab
      window.open(url, '_blank');
    } else {
      // Fallback alert if no file link is provided by the backend
      alert("The official advertisement document for this position has not been uploaded yet.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* Search & Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Open Opportunities</h3>
          <p className="text-xs text-slate-500 font-medium">Discover your next career move</p>
        </div>
        
        <div className="flex items-center gap-2 group">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by title or dept..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Filter
          </button>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="grid gap-4">
        {availableJobs.map((job) => (
          <div
            key={job.id}
            className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
          >
            {/* Top Row: Title and Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {job.title}
                </h4>
                <p className="text-sm font-bold text-emerald-600 tracking-tight uppercase italic">
                  {job.department}
                </p>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {job.status}
              </span>
            </div>

            {/* Middle Row: Job Attributes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-50">
              <JobMeta icon={MapPin} label="Location" value={job.location} />
              <JobMeta icon={Users} label="Vacancies" value={`${job.positions} Posts`} />
              <JobMeta icon={Banknote} label="Salary Scale" value={job.salary} />
              <JobMeta icon={GraduationCap} label="Requirement" value={job.education} />
            </div>

            {/* Bottom Row: Date and Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5">
              <div className="flex items-center gap-2 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Calendar size={14} className="text-rose-500" />
                <span className="text-xs font-bold">Deadline: <span className="text-slate-900">{job.lastDate}</span></span>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* 🟢 CHANGED: Added onClick handler, disabled state, and dynamic loading UI */}
                <button 
                  onClick={() => handleApply(job.id)}
                  disabled={applyingTo === job.id}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {applyingTo === job.id ? (
                    <><Loader2 size={14} className="animate-spin" /> Submitting...</>
                  ) : (
                    <>Apply Now <ArrowRight size={14} /></>
                  )}
                </button>
                {/* 🟢 CHANGED: Attached handleDownload function to the download button */}
                <button 
                  onClick={() => handleDownload(job.advertisementUrl)}
                  className="p-2.5 bg-white text-slate-400 border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all" 
                  title="Download Advertisement"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable component for job metadata
 */
function JobMeta({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700 truncate max-w-[120px] md:max-w-none">{value}</p>
      </div>
    </div>
  );
}