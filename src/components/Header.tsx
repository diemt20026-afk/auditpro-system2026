import React from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';
import { CARRecord, InterviewRecord } from '../types/audit';

interface HeaderProps {
  activeTab: 'plan' | 'question' | 'interview' | 'car';
  setActiveTab: (tab: 'plan' | 'question' | 'interview' | 'car') => void;
  interviews: InterviewRecord[];
  cars: CARRecord[];
  onResetData: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  interviews,
  cars,
  onResetData,
  onOpenReport,
}) => {
  const majorNcCount = interviews.filter((i) => i.findingType === 'Major NC').length;
  const minorNcCount = interviews.filter((i) => i.findingType === 'Minor NC').length;
  const ofiCount = interviews.filter((i) => i.findingType === 'OFI').length;
  const conformCount = interviews.filter((i) => i.findingType === 'Conform').length;
  
  const openCars = cars.filter((c) => c.status !== 'Closed').length;
  const closedCars = cars.filter((c) => c.status === 'Closed').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  AuditPro
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" /> AI Internal Audit & CAR
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ระบบวางแผนตรวจประเมิน สร้างคำถามอัตโนมัติ วิเคราะห์ระดับ NC และติดตามปิด CAR ตามมาตรฐาน ISO
              </p>
            </div>
          </div>

          {/* KPI Pills & Quick Actions */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Finding Summary Pills */}
            <div className="flex items-center bg-slate-100/90 rounded-lg p-1 border border-slate-200 text-xs">
              <span className="px-2 py-1 font-semibold text-slate-600 hidden sm:inline">ผลการตรวจ:</span>
              <span className="px-2 py-1 rounded bg-rose-500 text-white font-bold flex items-center gap-1 shadow-xs" title="Major Non-conformity">
                <AlertTriangle className="w-3 h-3" /> Major {majorNcCount}
              </span>
              <span className="px-2 py-1 rounded bg-amber-500 text-white font-bold flex items-center gap-1 ml-1 shadow-xs" title="Minor Non-conformity">
                <AlertTriangle className="w-3 h-3" /> Minor {minorNcCount}
              </span>
              <span className="px-2 py-1 rounded bg-blue-500 text-white font-bold flex items-center gap-1 ml-1 shadow-xs" title="Opportunity for Improvement">
                <HelpCircle className="w-3 h-3" /> OFI {ofiCount}
              </span>
              <span className="px-2 py-1 rounded bg-emerald-600 text-white font-bold flex items-center gap-1 ml-1 shadow-xs" title="Conforming">
                <CheckCircle2 className="w-3 h-3" /> ผ่าน {conformCount}
              </span>
            </div>

            {/* CAR Summary Pill */}
            <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-900">
              <FileText className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
              <span>CAR รอปิด: <strong className="text-rose-600">{openCars}</strong> / ปิดแล้ว: <strong className="text-emerald-700">{closedCars}</strong></span>
            </div>

            {/* Action Buttons */}
            <button
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>รายงานสรุปตรวจประเมิน</span>
            </button>

            <button
              onClick={onResetData}
              title="รีเซ็ตข้อมูลตัวอย่างมาตรฐาน"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex border-b border-slate-200 gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'plan'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
            <span>กำหนดแผนการตรวจ (Audit Plan)</span>
          </button>

          <button
            onClick={() => setActiveTab('question')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'question'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
            <span>สร้างคำถามตรวจประเมินอัตโนมัติ (AI Checklist)</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'interview'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">3</span>
            <span>บันทึกสัมภาษณ์ & AI วิเคราะห์ระดับ NC</span>
          </button>

          <button
            onClick={() => setActiveTab('car')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'car'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">4</span>
            <span>สรุปผลแผนก & ออก/ติดตามปิด CAR</span>
            {openCars > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {openCars}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
