import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  Sparkles, 
  Printer, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Calendar, 
  HelpCircle,
  TrendingUp,
  Award,
  RefreshCw,
  Check,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CARRecord, CarStatus, FindingSeverity, InterviewRecord } from '../types/audit';
import { DEPARTMENTS, STANDARDS_DATA } from '../data/standards';

interface CarManagementProps {
  cars: CARRecord[];
  interviews: InterviewRecord[];
  onAddCar: (car: CARRecord) => void;
  onUpdateCar: (car: CARRecord) => void;
  onDeleteCar: (carId: string) => void;
  onPrintCar: (car: CARRecord) => void;
}

export const CarManagement: React.FC<CarManagementProps> = ({
  cars,
  interviews,
  onAddCar,
  onUpdateCar,
  onDeleteCar,
  onPrintCar,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDeptSummaryDetails, setShowDeptSummaryDetails] = useState<boolean>(true);

  // Modal State for Viewing/Editing CAR
  const [selectedCar, setSelectedCar] = useState<CARRecord | null>(null);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState<boolean>(false);
  const [isAiSuggesting, setIsAiSuggesting] = useState<boolean>(false);

  // New Manual CAR Modal
  const [isNewCarModalOpen, setIsNewCarModalOpen] = useState<boolean>(false);
  const [newCarData, setNewCarData] = useState<Partial<CARRecord>>({
    carNo: `CAR-2026-00${cars.length + 1}`,
    department: DEPARTMENTS[0],
    standard: 'ISO 9001:2015',
    clause: '8.5.1',
    severity: 'Major NC',
    issuedBy: 'อัครพล เกียรติสกุล (Lead Auditor)',
    issuedDate: new Date().toISOString().split('T')[0],
    replyDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    problemStatement: '',
    objectiveEvidence: '',
    isoRequirementViolated: '',
  });

  // Calculate Departmental Summary
  const departmentSummary = DEPARTMENTS.map((dept) => {
    const deptInterviews = interviews.filter((i) => i.department === dept);
    const majorCount = deptInterviews.filter((i) => i.findingType === 'Major NC').length;
    const minorCount = deptInterviews.filter((i) => i.findingType === 'Minor NC').length;
    const ofiCount = deptInterviews.filter((i) => i.findingType === 'OFI').length;
    const conformCount = deptInterviews.filter((i) => i.findingType === 'Conform').length;
    const deptCars = cars.filter((c) => c.department === dept);
    const openCars = deptCars.filter((c) => c.status !== 'Closed').length;
    const closedCars = deptCars.filter((c) => c.status === 'Closed').length;

    let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
    if (majorCount > 0 || openCars >= 2) riskLevel = 'High';
    else if (minorCount > 0 || ofiCount >= 3) riskLevel = 'Medium';

    return {
      department: dept,
      majorCount,
      minorCount,
      ofiCount,
      conformCount,
      totalFindings: deptInterviews.length,
      openCars,
      closedCars,
      totalCars: deptCars.length,
      riskLevel,
    };
  }).filter((d) => d.totalFindings > 0 || d.totalCars > 0);

  // Filter CARs
  const filteredCars = cars.filter((car) => {
    const matchesStatus = selectedStatusFilter === 'ALL' || car.status === selectedStatusFilter;
    const matchesDept = selectedDeptFilter === 'ALL' || car.department === selectedDeptFilter;
    const matchesSearch =
      car.carNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.problemStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.issuedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDept && matchesSearch;
  });

  const getStatusBadge = (status: CarStatus) => {
    switch (status) {
      case 'Issued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Clock className="w-3 h-3" /> ออกใบ CAR แล้ว (Issued)
          </span>
        );
      case 'Action Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> ส่งแผนแก้ไขแล้ว (In Review)
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3" /> ตรวจติดตามแล้ว (Verified)
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> ปิด CAR เรียบร้อย (Closed)
          </span>
        );
    }
  };

  const handleOpenCarDetail = (car: CARRecord) => {
    setSelectedCar(JSON.parse(JSON.stringify(car)));
    setIsEditingModalOpen(true);
  };

  const handleSaveCarDetail = () => {
    if (!selectedCar) return;
    onUpdateCar(selectedCar);
    setIsEditingModalOpen(false);
  };

  const handleCloseCarWithConfetti = () => {
    if (!selectedCar) return;

    const updated: CARRecord = {
      ...selectedCar,
      status: 'Closed',
      closedDate: new Date().toISOString().split('T')[0],
      verification: {
        ...selectedCar.verification,
        result: 'Effective',
        verifiedDate: selectedCar.verification.verifiedDate || new Date().toISOString().split('T')[0],
      },
    };

    onUpdateCar(updated);
    setSelectedCar(updated);

    // Fire Confetti animation
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    alert(`อนุมัติปิดใบแจ้งข้อบกพร่อง ${updated.carNo} เรียบร้อยแล้ว (Effective Close)`);
  };

  // AI 5-Whys & Root Cause Assistant
  const handleAiSuggestCarPlan = async () => {
    if (!selectedCar) return;
    setIsAiSuggesting(true);

    try {
      const response = await fetch('/api/audit/suggest-car-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          findingDescription: selectedCar.problemStatement,
          objectiveEvidence: selectedCar.objectiveEvidence,
          clauseReference: `${selectedCar.standard} ข้อ ${selectedCar.clause}`,
          department: selectedCar.department,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setSelectedCar({
        ...selectedCar,
        rootCauseAnalysis: {
          ...selectedCar.rootCauseAnalysis,
          fiveWhys: data.fiveWhys || selectedCar.rootCauseAnalysis.fiveWhys,
          summary: data.rootCauseSummary || selectedCar.rootCauseAnalysis.summary,
        },
        correctiveAction: {
          ...selectedCar.correctiveAction,
          description: data.correctiveAction || selectedCar.correctiveAction.description,
        },
        preventiveAction: {
          ...selectedCar.preventiveAction,
          description: data.preventiveAction || selectedCar.preventiveAction.description,
        },
        verification: {
          ...selectedCar.verification,
          notes: data.verificationCriteria || selectedCar.verification.notes,
        },
      });

      alert('AI ช่วยวิเคราะห์ 5 Whys และร่างแผน CAPA เรียบร้อยแล้ว!');
    } catch (err: any) {
      console.error('Error suggesting CAR plan:', err);
      alert('เกิดข้อผิดพลาดในการเรียก AI: ' + err.message);
    } finally {
      setIsAiSuggesting(false);
    }
  };

  const handleCreateNewManualCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarData.problemStatement) {
      alert('กรุณาระบุรายละเอียดข้อบกพร่อง');
      return;
    }

    const newRecord: CARRecord = {
      id: `car-${Date.now()}`,
      carNo: newCarData.carNo || `CAR-2026-00${cars.length + 1}`,
      department: newCarData.department || DEPARTMENTS[0],
      standard: (newCarData.standard as any) || 'ISO 9001:2015',
      clause: newCarData.clause || '8.5.1',
      severity: (newCarData.severity as any) || 'Major NC',
      issuedBy: newCarData.issuedBy || 'Lead Auditor',
      issuedDate: newCarData.issuedDate || new Date().toISOString().split('T')[0],
      replyDueDate: newCarData.replyDueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      problemStatement: newCarData.problemStatement || '',
      objectiveEvidence: newCarData.objectiveEvidence || '',
      isoRequirementViolated: newCarData.isoRequirementViolated || `${newCarData.standard} ข้อ ${newCarData.clause}`,
      immediateCorrection: {
        action: '',
        completedDate: '',
        personInCharge: '',
      },
      rootCauseAnalysis: {
        method: '5Whys',
        fiveWhys: [
          { level: 1, question: 'ทำไมจึงเกิดข้อผิดพลาดนี้?', answer: '' },
          { level: 2, question: 'ทำไม?', answer: '' },
          { level: 3, question: 'ทำไม?', answer: '' },
          { level: 4, question: 'ทำไม?', answer: '' },
          { level: 5, question: 'ทำไม? (Root Cause)', answer: '' },
        ],
        summary: '',
      },
      correctiveAction: {
        description: '',
        dueDate: '',
        personInCharge: '',
      },
      preventiveAction: {
        description: '',
        dueDate: '',
        personInCharge: '',
      },
      verification: {
        auditorName: newCarData.issuedBy || 'Lead Auditor',
        verifiedDate: '',
        result: 'Pending',
        notes: '',
      },
      status: 'Issued',
    };

    onAddCar(newRecord);
    setIsNewCarModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 text-xs font-medium border border-rose-400/30">
                4. NC Summary & CAR Management
              </span>
              <span className="text-xs text-rose-200/80">Corrective Action Workflow</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              สรุปข้อบกพร่องตามแผนก & จัดการออกและปิด CAR
            </h2>
            <p className="text-sm text-rose-100/90 mt-1 max-w-2xl">
              รายงานสรุป Major NC, Minor NC, OFI รายแผนก ออกใบแจ้งการปฏิบัติการแก้ไข (CAR) วิเคราะห์สาเหตุด้วย 5 Whys และตรวจติดตามเพื่อปิด CAR
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsNewCarModalOpen(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>ออกใบ CAR ใหม่ (New CAR)</span>
            </button>
          </div>
        </div>

        {/* Global CAR metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-rose-200">ใบ CAR ทั้งหมด</div>
            <div className="text-2xl font-extrabold text-white mt-1">{cars.length} ฉบับ</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-rose-200">ออกใหม่ / รอดำเนินการ (Issued)</div>
            <div className="text-2xl font-extrabold text-rose-300 mt-1">
              {cars.filter((c) => c.status === 'Issued').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-amber-200">ส่งแผนแก้ไขแล้ว (In Review)</div>
            <div className="text-2xl font-extrabold text-amber-300 mt-1">
              {cars.filter((c) => c.status === 'Action Submitted').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-emerald-200">ปิด CAR สมบูรณ์ (Closed)</div>
            <div className="text-2xl font-extrabold text-emerald-300 mt-1">
              {cars.filter((c) => c.status === 'Closed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Departmental NC & Findings Matrix Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>สรุปผลการตรวจและข้อบกพร่องแยกตามแผนก (Departmental Finding Summary)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงจำนวน Major NC, Minor NC, OFI, ผ่าน (Conform) และสถานะใบ CAR ของแต่ละแผนก
            </p>
          </div>

          <button
            onClick={() => setShowDeptSummaryDetails(!showDeptSummaryDetails)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{showDeptSummaryDetails ? 'ย่อตาราง' : 'ขยายตาราง'}</span>
            {showDeptSummaryDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showDeptSummaryDetails && (
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">แผนกที่รับการตรวจ</th>
                  <th className="px-4 py-3 text-center text-rose-600">Major NC</th>
                  <th className="px-4 py-3 text-center text-amber-600">Minor NC</th>
                  <th className="px-4 py-3 text-center text-blue-600">OFI</th>
                  <th className="px-4 py-3 text-center text-emerald-600">Conform</th>
                  <th className="px-4 py-3 text-center">รวมข้อค้นพบ</th>
                  <th className="px-4 py-3 text-center">สถานะ CAR</th>
                  <th className="px-4 py-3 text-right">ระดับความเสี่ยง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentSummary.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-slate-400">
                      ยังไม่มีข้อมูลการตรวจประเมินของแผนก
                    </td>
                  </tr>
                ) : (
                  departmentSummary.map((d) => (
                    <tr key={d.department} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{d.department}</td>
                      <td className="px-4 py-3 text-center">
                        {d.majorCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-rose-500 text-white font-bold text-xs">
                            {d.majorCount}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {d.minorCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-xs">
                            {d.minorCount}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {d.ofiCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-blue-500 text-white font-bold text-xs">
                            {d.ofiCount}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {d.conformCount > 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                            {d.conformCount}
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800">
                        {d.totalFindings}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {d.totalCars > 0 ? (
                          <span className="text-[11px] font-semibold text-slate-700">
                            รอปิด: <strong className="text-rose-600">{d.openCars}</strong> / ปิดแล้ว: <strong className="text-emerald-600">{d.closedCars}</strong>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {d.riskLevel === 'High' && (
                          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                            ความเสี่ยงสูง (High)
                          </span>
                        )}
                        {d.riskLevel === 'Medium' && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                            ปานกลาง (Medium)
                          </span>
                        )}
                        {d.riskLevel === 'Low' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                            ความเสี่ยงต่ำ (Low)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CAR List & Tracking Management */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-600" />
              <span>ทะเบียนและระบบติดตามปิด CAR (Corrective Action Register)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คลิกที่แต่ละใบ CAR เพื่อบันทึกมาตรการแก้ไข วิเคราะห์ 5 Whys ตรวจติดตาม และอนุมัติปิด CAR
            </p>
          </div>
        </div>

        {/* Filter and Search Bar for CARs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาเลขที่ CAR, แผนก, หรือประเด็น..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500"
            >
              <option value="ALL">ทุกสถานะ CAR (All Status)</option>
              <option value="Issued">ออกใบ CAR แล้ว (Issued)</option>
              <option value="Action Submitted">ส่งแผนแก้ไขแล้ว (Action Submitted)</option>
              <option value="Verified">ตรวจติดตามแล้ว (Verified)</option>
              <option value="Closed">ปิด CAR แล้ว (Closed)</option>
            </select>
          </div>

          <div>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-rose-500"
            >
              <option value="ALL">ทุกแผนก (All Departments)</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CAR Cards / Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">เลขที่ CAR</th>
                <th className="px-4 py-3">แผนกที่รับ CAR</th>
                <th className="px-4 py-3">มาตรฐาน & ข้อกำหนด</th>
                <th className="px-4 py-3">ระดับความรุนแรง</th>
                <th className="px-4 py-3">กำหนดตอบกลับ</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    ไม่พบรายการใบแจ้ง CAR ตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-rose-700">
                      {car.carNo}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {car.department}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{car.standard}</div>
                      <div className="text-slate-500 font-mono text-[11px]">ข้อ {car.clause}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[11px] ${
                          car.severity === 'Major NC'
                            ? 'bg-rose-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {car.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{car.replyDueDate}</div>
                      <div className="text-slate-400 text-[10px]">ออกเมื่อ: {car.issuedDate}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(car.status)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintCar(car)}
                          title="พิมพ์แบบฟอร์ม CAR มาตรฐาน"
                          className="p-1.5 hover:bg-slate-100 text-slate-600 rounded cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenCarDetail(car)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs shadow-xs cursor-pointer"
                        >
                          จัดการ / ปิด CAR
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`คุณต้องการลบใบ CAR ${car.carNo} ใช่หรือไม่?`)) {
                              onDeleteCar(car.id);
                            }
                          }}
                          className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive CAR Workflow Modal (Full 5-Stage LifeCycle) */}
      {isEditingModalOpen && selectedCar && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      ใบแจ้งข้อบกพร่องและการแก้ไข (CAR No. {selectedCar.carNo})
                    </h3>
                    {getStatusBadge(selectedCar.status)}
                  </div>
                  <p className="text-xs text-slate-500">
                    แผนก: {selectedCar.department} | มาตรฐาน: {selectedCar.standard} ข้อ {selectedCar.clause}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrintCar(selectedCar)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>พิมพ์ฟอร์ม ISO</span>
                </button>
                <button
                  onClick={() => setIsEditingModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-2">
              {/* STAGE 1: Problem Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                    ตอนที่ 1: รายละเอียดข้อบกพร่องที่ตรวจพบ (Statement of Nonconformity)
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500 text-white">
                    {selectedCar.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-500">ผู้ออกใบ CAR:</span>{' '}
                    <strong className="text-slate-800">{selectedCar.issuedBy}</strong>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">กำหนดส่งแผนแก้ไขภายใน:</span>{' '}
                    <strong className="text-rose-700">{selectedCar.replyDueDate}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">ข้อบกพร่อง (Problem Statement):</label>
                  <textarea
                    rows={2}
                    value={selectedCar.problemStatement}
                    onChange={(e) =>
                      setSelectedCar({ ...selectedCar, problemStatement: e.target.value })
                    }
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">หลักฐานเชิงประจักษ์ (Objective Evidence):</label>
                  <input
                    type="text"
                    value={selectedCar.objectiveEvidence}
                    onChange={(e) =>
                      setSelectedCar({ ...selectedCar, objectiveEvidence: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* AI Auto-Suggest Button for Stage 2, 3, 4 */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>ผู้ช่วย AI วิเคราะห์ 5 Whys และร่างแผนแก้ไข CAPA</span>
                  </div>
                  <p className="text-indigo-800 text-[11px] mt-0.5">
                    ให้ AI ช่วยวิเคราะห์บันได 5 Whys หาสาเหตุเชิงระบบ และร่างมาตรการแก้ไขป้องกันให้ทันที
                  </p>
                </div>

                <button
                  onClick={handleAiSuggestCarPlan}
                  disabled={isAiSuggesting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {isAiSuggesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังวิเคราะห์...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>วิเคราะห์ 5 Whys ด้วย AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* STAGE 2: Immediate Containment Action */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                <span className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                  ตอนที่ 2: การแก้ไขเฉพาะหน้าเร่งด่วน (Immediate Containment Action)
                </span>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">การดำเนินการแก้ไขเฉพาะหน้า:</label>
                  <textarea
                    rows={2}
                    placeholder="เช่น กักกันล็อตชิ้นงานทันที, นำส่งเครื่องมือวัดไปสอบเทียบด่วน, ปิดวาล์วสารเคมี..."
                    value={selectedCar.immediateCorrection.action}
                    onChange={(e) =>
                      setSelectedCar({
                        ...selectedCar,
                        immediateCorrection: {
                          ...selectedCar.immediateCorrection,
                          action: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">วันที่แก้ไขแล้วเสร็จ:</label>
                    <input
                      type="date"
                      value={selectedCar.immediateCorrection.completedDate}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          immediateCorrection: {
                            ...selectedCar.immediateCorrection,
                            completedDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ผู้รับผิดชอบ:</label>
                    <input
                      type="text"
                      value={selectedCar.immediateCorrection.personInCharge}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          immediateCorrection: {
                            ...selectedCar.immediateCorrection,
                            personInCharge: e.target.value,
                          },
                        })
                      }
                      placeholder="ชื่อผู้รับผิดชอบ"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* STAGE 3: Root Cause Analysis (5 Whys) */}
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
                <span className="text-xs font-bold uppercase text-purple-900 tracking-wider">
                  ตอนที่ 3: การวิเคราะห์สาเหตุที่แท้จริง (Root Cause Analysis - 5 Whys)
                </span>

                <div className="space-y-2">
                  {selectedCar.rootCauseAnalysis.fiveWhys.map((why, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs bg-white p-2.5 rounded-lg border border-purple-100">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        W{idx + 1}
                      </span>
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          placeholder={`คำถามทำไมที่ ${idx + 1}`}
                          value={why.question}
                          onChange={(e) => {
                            const newWhys = [...selectedCar.rootCauseAnalysis.fiveWhys];
                            newWhys[idx].question = e.target.value;
                            setSelectedCar({
                              ...selectedCar,
                              rootCauseAnalysis: {
                                ...selectedCar.rootCauseAnalysis,
                                fiveWhys: newWhys,
                              },
                            });
                          }}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="คำตอบสาเหตุ..."
                          value={why.answer}
                          onChange={(e) => {
                            const newWhys = [...selectedCar.rootCauseAnalysis.fiveWhys];
                            newWhys[idx].answer = e.target.value;
                            setSelectedCar({
                              ...selectedCar,
                              rootCauseAnalysis: {
                                ...selectedCar.rootCauseAnalysis,
                                fiveWhys: newWhys,
                              },
                            });
                          }}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-purple-900">
                    สรุปสาเหตุที่แท้จริงเชิงระบบ (Systemic Root Cause Summary):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="สรุปสาเหตุรากเหง้าของปัญหา..."
                    value={selectedCar.rootCauseAnalysis.summary}
                    onChange={(e) =>
                      setSelectedCar({
                        ...selectedCar,
                        rootCauseAnalysis: {
                          ...selectedCar.rootCauseAnalysis,
                          summary: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-purple-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              {/* STAGE 4: Corrective & Preventive Action (CAPA) */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
                <span className="text-xs font-bold uppercase text-blue-900 tracking-wider">
                  ตอนที่ 4: มาตรการแก้ไขและป้องกันการเกิดซ้ำ (CAPA)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Corrective Action */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-xs text-blue-900 block">
                      มาตรการแก้ไขเพื่อขจัดสาเหตุ (Corrective Action):
                    </span>
                    <textarea
                      rows={3}
                      value={selectedCar.correctiveAction.description}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          correctiveAction: {
                            ...selectedCar.correctiveAction,
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                      placeholder="อธิบายขั้นตอนการแก้ไขเชิงระบบ..."
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-500">กำหนดเสร็จ:</label>
                        <input
                          type="date"
                          value={selectedCar.correctiveAction.dueDate}
                          onChange={(e) =>
                            setSelectedCar({
                              ...selectedCar,
                              correctiveAction: {
                                ...selectedCar.correctiveAction,
                                dueDate: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500">ผู้รับผิดชอบ:</label>
                        <input
                          type="text"
                          value={selectedCar.correctiveAction.personInCharge}
                          onChange={(e) =>
                            setSelectedCar({
                              ...selectedCar,
                              correctiveAction: {
                                ...selectedCar.correctiveAction,
                                personInCharge: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preventive Action */}
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-xs text-blue-900 block">
                      มาตรการป้องกันการเกิดซ้ำ / ขยายผล (Preventive Action):
                    </span>
                    <textarea
                      rows={3}
                      value={selectedCar.preventiveAction.description}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          preventiveAction: {
                            ...selectedCar.preventiveAction,
                            description: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-slate-200 rounded text-xs"
                      placeholder="การนำไปปรับใช้กับแผนกหรือไลน์อื่น..."
                    />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[11px] text-slate-500">กำหนดเสร็จ:</label>
                        <input
                          type="date"
                          value={selectedCar.preventiveAction.dueDate}
                          onChange={(e) =>
                            setSelectedCar({
                              ...selectedCar,
                              preventiveAction: {
                                ...selectedCar.preventiveAction,
                                dueDate: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500">ผู้รับผิดชอบ:</label>
                        <input
                          type="text"
                          value={selectedCar.preventiveAction.personInCharge}
                          onChange={(e) =>
                            setSelectedCar({
                              ...selectedCar,
                              preventiveAction: {
                                ...selectedCar.preventiveAction,
                                personInCharge: e.target.value,
                              },
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 5: Verification of Effectiveness & Close CAR */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-emerald-900 tracking-wider">
                    ตอนที่ 5: การตรวจติดตามประสิทธิผลและปิด CAR (Verification & Close CAR)
                  </span>
                  <span className="text-xs font-bold text-emerald-800">
                    สถานะการประเมิน: {selectedCar.verification.result}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    บันทึกหลักฐานการตรวจติดตามประสิทธิผล (Auditor Verification Notes):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="เช่น สุ่มตรวจบันทึก Checklist หน้างาน 10 ชุด ไม่พบความผิดปกติซ้ำ, ทดสอบระบบ Alert ทำงานได้จริง..."
                    value={selectedCar.verification.notes}
                    onChange={(e) =>
                      setSelectedCar({
                        ...selectedCar,
                        verification: {
                          ...selectedCar.verification,
                          notes: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ผู้ตรวจประเมินติดตาม:</label>
                    <input
                      type="text"
                      value={selectedCar.verification.auditorName}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          verification: {
                            ...selectedCar.verification,
                            auditorName: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">วันที่ตรวจติดตาม:</label>
                    <input
                      type="date"
                      value={selectedCar.verification.verifiedDate}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          verification: {
                            ...selectedCar.verification,
                            verifiedDate: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ผลการประเมิน:</label>
                    <select
                      value={selectedCar.verification.result}
                      onChange={(e) =>
                        setSelectedCar({
                          ...selectedCar,
                          verification: {
                            ...selectedCar.verification,
                            result: e.target.value as any,
                          },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="Pending">อยู่ระหว่างดำเนินการ (Pending)</option>
                      <option value="Effective">มีประสิทธิผล - อนุมัติปิด CAR (Effective)</option>
                      <option value="Ineffective">ไม่มีประสิทธิผล - ต้องเปิด CAR ซ้ำ (Ineffective)</option>
                    </select>
                  </div>
                </div>

                {/* Big Close CAR Action */}
                {selectedCar.status !== 'Closed' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleCloseCarWithConfetti}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>อนุมัติปิด CAR สมบูรณ์ (Effective Close CAR)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-500 font-mono">
                สถานะปัจจุบัน: <strong>{selectedCar.status}</strong>
                {selectedCar.closedDate && ` (ปิดเมื่อ: ${selectedCar.closedDate})`}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  type="button"
                  onClick={handleSaveCarDetail}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  บันทึกข้อมูล CAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Manual CAR */}
      {isNewCarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">
                ออกใบแจ้งข้อบกพร่องใหม่ (Issue New CAR)
              </h3>
              <button
                onClick={() => setIsNewCarModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewManualCar} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">เลขที่ CAR *</label>
                  <input
                    type="text"
                    required
                    value={newCarData.carNo}
                    onChange={(e) => setNewCarData({ ...newCarData, carNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ระดับความรุนแรง *</label>
                  <select
                    value={newCarData.severity}
                    onChange={(e) => setNewCarData({ ...newCarData, severity: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="Major NC">Major NC (ข้อบกพร่องรุนแรง)</option>
                    <option value="Minor NC">Minor NC (ข้อบกพร่องเล็กน้อย)</option>
                    <option value="OFI">OFI (ข้อเสนอแนะปรับปรุง)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">แผนกที่รับการตรวจ *</label>
                  <select
                    value={newCarData.department}
                    onChange={(e) => setNewCarData({ ...newCarData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">มาตรฐาน *</label>
                  <select
                    value={newCarData.standard}
                    onChange={(e) => setNewCarData({ ...newCarData, standard: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {STANDARDS_DATA.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ผู้ออกใบ CAR *</label>
                  <input
                    type="text"
                    required
                    value={newCarData.issuedBy}
                    onChange={(e) => setNewCarData({ ...newCarData, issuedBy: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">กำหนดส่งแผนแก้ไข (Due Date) *</label>
                  <input
                    type="date"
                    required
                    value={newCarData.replyDueDate}
                    onChange={(e) => setNewCarData({ ...newCarData, replyDueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  รายละเอียดข้อบกพร่อง (Problem Statement) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="ระบุข้อเท็จจริงที่พบ ณ จุดตรวจ..."
                  value={newCarData.problemStatement}
                  onChange={(e) => setNewCarData({ ...newCarData, problemStatement: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  หลักฐานเชิงประจักษ์ (Objective Evidence) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น เลขที่เอกสาร, หมายเลขล็อต, ป้ายหมดอายุ..."
                  value={newCarData.objectiveEvidence}
                  onChange={(e) => setNewCarData({ ...newCarData, objectiveEvidence: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewCarModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                >
                  บันทึกและออกใบ CAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
