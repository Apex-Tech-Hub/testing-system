'use client';

import { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Fingerprint, 
  Download, 
  ExternalLink, 
  Activity,
  X,
  CheckCircle2
} from "lucide-react";

// 🟢 FIX: Added optional properties to match exact backend JSON casing
type Job = {
  id?: string | number;
  title?: string;
  jobTitle?: string; 
  JobTitle?: string; 
  department?: string;
  Department?: string;
  appliedDate?: string;
  AppliedDate?: string;
  rollNumber?: string;
  testDate?: string;
  testTime?: string;
  venue?: string;
  status?: string;
  Status?: string;
};

type AppliedJobsTabProps = {
  appliedJobs: Job[];
};

export default function AppliedJobsTab({ appliedJobs }: AppliedJobsTabProps) {
  // 🟢 NEW: States to manage the visibility and data of the modals
  const [viewAppModal, setViewAppModal] = useState<Job | null>(null);
  const [trackModal, setTrackModal] = useState<Job | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Application Tracking</h3>
          <p className="text-sm text-slate-500">Manage and monitor your submitted job applications</p>
        </div>
      </div>

      <div className="grid gap-5">
        {appliedJobs?.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-200">
            You haven't applied for any jobs yet.
          </div>
        )}

        {appliedJobs?.map((job, index) => {
          // 🟢 FIX: Checking all possible JSON casings from C# backend (jobTitle, JobTitle, title)
          const title = job.jobTitle || job.JobTitle || job.title || "Untitled Position";
          const department = job.department || job.Department || "General Department";
          const status = job.status || job.Status || "Pending";
          const isScheduled = status === "Test Scheduled";
          
          const rawDate = job.appliedDate || job.AppliedDate;
          const formattedDate = rawDate 
            ? new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : "Recently";

          const rollNumber = job.rollNumber || `BTS-${Math.floor(Math.random() * 90000) + 10000}`;
          const testDate = job.testDate || "To Be Announced";
          const testTime = job.testTime || "TBA";
          const venue = job.venue || "To Be Assigned";
          const keyId = job.id || index;

          return (
            <div
              key={keyId}
              className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Left Side: Header & Core Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          {title}
                        </h4>
                        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-tight mt-0.5">
                          {department}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isScheduled 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isScheduled ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {status}
                      </span>
                    </div>

                    {/* Logistics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 py-4 px-4 bg-slate-50 rounded-xl border border-slate-100">
                      <InfoItem icon={Calendar} label="Test Date" value={testDate} />
                      <InfoItem icon={Clock} label="Test Time" value={testTime} />
                      <InfoItem icon={Fingerprint} label="Roll Number" value={rollNumber} />
                      <InfoItem 
                        icon={MapPin} 
                        label="Venue" 
                        value={venue} 
                        className="sm:col-span-2 lg:col-span-3" 
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                  {isScheduled && (
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95">
                      <Download size={14} />
                      Download Admit Card
                    </button>
                  )}
                  {/* 🟢 CHANGED: Attached modal state handlers to the buttons */}
                  <button onClick={() => setViewAppModal(job)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                    <ExternalLink size={14} />
                    View Application
                  </button>
                  <button onClick={() => setTrackModal(job)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all">
                    <Activity size={14} />
                    Track History
                  </button>
                  <div className="ml-auto text-[11px] font-medium text-slate-400 italic">
                    Applied on {formattedDate}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🟢 NEW: View Application Modal UI */}
      {viewAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Application Details</h3>
              <button onClick={() => setViewAppModal(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Position Applied</p>
                <p className="font-bold text-slate-900">{viewAppModal.jobTitle || viewAppModal.JobTitle || viewAppModal.title}</p>
                <p className="text-emerald-600 font-medium">{viewAppModal.department || viewAppModal.Department}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                <p className="font-bold text-slate-900">{viewAppModal.status || viewAppModal.Status || "Pending"}</p>
              </div>
              <p className="text-center text-xs text-slate-400 italic mt-4">Full application download will be available soon.</p>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 NEW: Track History Modal UI */}
      {trackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Tracking History</h3>
              <button onClick={() => setTrackModal(null)} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-100 ml-4">
              <div className="relative">
                <div className="absolute -left-[33px] top-0.5 bg-emerald-500 text-white p-1 rounded-full ring-4 ring-white">
                  <CheckCircle2 size={14} />
                </div>
                <p className="font-bold text-slate-900 text-sm">Application Submitted</p>
                <p className="text-xs text-slate-500">Your application was successfully received by the system.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[33px] top-0.5 bg-slate-200 text-slate-400 p-1 rounded-full ring-4 ring-white">
                  <Clock size={14} />
                </div>
                <p className="font-bold text-slate-400 text-sm">Under Review</p>
                <p className="text-xs text-slate-400">Waiting for department screening.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Reusable Info Component for the logistics grid
 */
function InfoItem({ icon: Icon, label, value, className = "" }: any) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="p-1.5 bg-white rounded-md border border-slate-100 text-slate-400">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-700 leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}