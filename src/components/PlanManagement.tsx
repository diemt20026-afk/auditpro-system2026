import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock3, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AuditPlan, PlanStatus, StandardType } from '../types/audit';
import { DEPARTMENTS, STANDARDS_DATA, getDepartmentClauses } from '../data/standards';

interface PlanManagementProps {
  plans: AuditPlan[];
  onAddPlan: (plan: AuditPlan) => void;
  onUpdatePlan: (plan: AuditPlan) => void;
  onDeletePlan: (planId: string) => void;
  onSelectPlanForInterview: (plan: AuditPlan) => void;
  onSelectPlanForQuestions: (plan: AuditPlan) => void;
}

export const PlanManagement: React.FC<PlanManagementProps> = ({
  plans,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  onSelectPlanForInterview,
  onSelectPlanForQuestions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStandardFilter, setSelectedStandardFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modal State for New/Edit Plan
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AuditPlan | null>(null);

  // Form Fields
  const [formData, setFormData] = useState<Partial<AuditPlan>>({
    planCode: `AUD-2026-00${plans.length + 1}`,
    title: '',
    department: DEPARTMENTS[0],
    standard: 'ISO 9001:2015',
    clauses: ['8.5.1'],
    leadAuditor: '',
    auditorTeam: [],
    auditee: '',
    auditeeRole: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    location: '',
    scope: '',
    status: 'Scheduled',
    notes: '',
  });

  const [auditorTeamInput, setAuditorTeamInput] = useState('');

  const currentStandardObj = STANDARDS_DATA.find((s) => s.id === formData.standard) || STANDARDS_DATA[0];

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      planCode: `AUD-2026-00${plans.length + 1}`,
      title: '',
      department: DEPARTMENTS[0],
      standard: 'ISO 9001:2015',
      clauses: ['8.5.1'],
      leadAuditor: 'อัครพล เกียรติสกุล (Lead Auditor)',
      auditorTeam: ['กนกวรรณ จิตต์จำนงค์'],
      auditee: '',
      auditeeRole: 'หัวหน้าแผนก',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '12:00',
      location: 'ห้องประชุมแผนก',
      scope: 'ตรวจประเมินความสอดคล้องตามข้อกำหนดของกระบวนการ',
      status: 'Scheduled',
      notes: '',
    });
    setAuditorTeamInput('กนกวรรณ จิตต์จำนงค์');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: AuditPlan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
    setAuditorTeamInput(plan.auditorTeam.join(', '));
    setIsModalOpen(true);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.leadAuditor) {
      alert('กรุณากรอกหัวข้อการตรวจและชื่อผู้ตรวจประเมินหลัก (Lead Auditor)');
      return;
    }

    const teamArray = auditorTeamInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingPlan) {
      onUpdatePlan({
        ...editingPlan,
        ...(formData as AuditPlan),
        auditorTeam: teamArray,
      });
    } else {
      const newPlan: AuditPlan = {
        id: `plan-${Date.now()}`,
        planCode: formData.planCode || `AUD-2026-00${plans.length + 1}`,
        title: formData.title || 'การตรวจประเมินภายใน',
        department: formData.department || DEPARTMENTS[0],
        standard: formData.standard || 'ISO 9001:2015',
        clauses: formData.clauses && formData.clauses.length > 0 ? formData.clauses : ['4.1'],
        leadAuditor: formData.leadAuditor || 'Lead Auditor',
        auditorTeam: teamArray,
        auditee: formData.auditee || 'ผู้รับการตรวจ',
        auditeeRole: formData.auditeeRole || 'หัวหน้างาน',
        date: formData.date || new Date().toISOString().split('T')[0],
        startTime: formData.startTime || '09:00',
        endTime: formData.endTime || '12:00',
        location: formData.location || 'สถานที่ตรวจ',
        scope: formData.scope || 'ขอบข่ายการตรวจประเมิน',
        status: formData.status || 'Scheduled',
        notes: formData.notes || '',
      };
      onAddPlan(newPlan);
    }

    setIsModalOpen(false);
  };

  const handleClauseToggle = (clauseCode: string) => {
    const currentClauses = formData.clauses || [];
    if (currentClauses.includes(clauseCode)) {
      setFormData({
        ...formData,
        clauses: currentClauses.filter((c) => c !== clauseCode),
      });
    } else {
      setFormData({
        ...formData,
        clauses: [...currentClauses, clauseCode],
      });
    }
  };

  // Filtered Plans
  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.planCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.auditee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.leadAuditor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDeptFilter === 'ALL' || plan.department === selectedDeptFilter;
    const matchesStandard = selectedStandardFilter === 'ALL' || plan.standard === selectedStandardFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || plan.status === selectedStatusFilter;

    return matchesSearch && matchesDept && matchesStandard && matchesStatus;
  });

  const getStatusBadge = (status: PlanStatus) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock3 className="w-3 h-3" /> วางแผนไว้ (Scheduled)
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
            <AlertCircle className="w-3 h-3" /> กำลังตรวจ (In Progress)
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> ตรวจเสร็จแล้ว (Completed)
          </span>
        );
      case 'Postponed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            เลื่อนการตรวจ (Postponed)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Overview */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/30">
                1. Audit Planning & Scheduling
              </span>
              <span className="text-xs text-blue-200/80">ISO 19011 Guidelines</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              กำหนดแผนการตรวจประเมินภายใน (Internal Audit Plan)
            </h2>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
              วางตารางเวลา กำหนดขอบข่ายการตรวจของแต่ละแผนก ระบุมาตรฐานและข้อกำหนดที่เกี่ยวข้อง พร้อมจัดทีมผู้ตรวจประเมิน (Audit Team)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มแผนการตรวจใหม่</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats inside banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-blue-200">แผนการตรวจทั้งหมด</div>
            <div className="text-2xl font-extrabold text-white mt-1">{plans.length} แผน</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-amber-200">รอดำเนินการ (Scheduled)</div>
            <div className="text-2xl font-extrabold text-amber-300 mt-1">
              {plans.filter((p) => p.status === 'Scheduled').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-sky-200">กำลังตรวจ (In Progress)</div>
            <div className="text-2xl font-extrabold text-sky-300 mt-1">
              {plans.filter((p) => p.status === 'In Progress').length}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="text-emerald-200">ตรวจเสร็จสิ้น (Completed)</div>
            <div className="text-2xl font-extrabold text-emerald-300 mt-1">
              {plans.filter((p) => p.status === 'Completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหารหัสแผน, ชื่อการตรวจ, แผนก, หรือชื่อผู้ตรวจประเมิน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-end md:self-auto text-xs font-semibold">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              มุมมองการ์ด (Cards)
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              มุมมองตาราง (Table)
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">กรองตามแผนก:</label>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกแผนก (All Departments)</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">กรองตามมาตรฐาน:</label>
            <select
              value={selectedStandardFilter}
              onChange={(e) => setSelectedStandardFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกมาตรฐาน (All Standards)</option>
              {STANDARDS_DATA.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.code} - {std.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">กรองตามสถานะ:</label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">ทุกสถานะ (All Status)</option>
              <option value="Scheduled">วางแผนไว้ (Scheduled)</option>
              <option value="In Progress">กำลังตรวจ (In Progress)</option>
              <option value="Completed">ตรวจเสร็จแล้ว (Completed)</option>
              <option value="Postponed">เลื่อนการตรวจ (Postponed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans View: Cards Mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
              <Filter className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold">ไม่พบแผนการตรวจที่ตรงกับเงื่อนไขการค้นหา</p>
              <p className="text-xs mt-1">ลองเปลี่ยนตัวกรอง หรือกดปุ่ม "เพิ่มแผนการตรวจใหม่"</p>
            </div>
          ) : (
            filteredPlans.map((plan) => {
              const stdDef = STANDARDS_DATA.find((s) => s.id === plan.standard);
              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Top Row: Plan Code & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {plan.planCode}
                      </span>
                      {getStatusBadge(plan.status)}
                    </div>

                    {/* Standard Badge */}
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${stdDef?.badgeBg || 'bg-slate-100'}`}>
                        {plan.standard}
                      </span>
                    </div>

                    {/* Title & Department */}
                    <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {plan.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>{plan.department}</span>
                    </p>

                    {/* Clauses Covered */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className="text-[11px] font-medium text-slate-400">ข้อกำหนด:</span>
                      {plan.clauses.map((c) => (
                        <span
                          key={c}
                          className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[11px] font-mono font-medium border border-slate-200"
                        >
                          ข้อ {c}
                        </span>
                      ))}
                    </div>

                    {/* Date & Time */}
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>วันที่: <strong className="text-slate-800">{plan.date}</strong> ({plan.startTime} - {plan.endTime} น.)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Lead Auditor: <strong className="text-slate-800">{plan.leadAuditor}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>ผู้รับการตรวจ: <strong className="text-slate-800">{plan.auditee}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectPlanForQuestions(plan)}
                        title="สร้างคำถามสำหรับแผนนี้"
                        className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded text-xs font-medium border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" /> คำถาม AI
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(plan)}
                        title="แก้ไขแผน"
                        className="p-1 hover:bg-slate-200 text-slate-500 rounded transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบแผนการตรวจ ${plan.planCode} ใช่หรือไม่?`)) {
                            onDeletePlan(plan.id);
                          }
                        }}
                        title="ลบแผน"
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Primary Action Button: Jump to Interview */}
                    <button
                      onClick={() => onSelectPlanForInterview(plan)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>เริ่มตรวจ / สัมภาษณ์</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Plans View: Table Mode */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">รหัสแผน</th>
                  <th className="px-4 py-3">หัวข้อการตรวจ / แผนก</th>
                  <th className="px-4 py-3">มาตรฐาน & ข้อกำหนด</th>
                  <th className="px-4 py-3">วัน-เวลา</th>
                  <th className="px-4 py-3">Lead Auditor</th>
                  <th className="px-4 py-3">ผู้รับการตรวจ</th>
                  <th className="px-4 py-3">สถานะ</th>
                  <th className="px-4 py-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      ไม่พบแผนการตรวจที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{plan.planCode}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{plan.title}</div>
                        <div className="text-slate-500 font-medium">{plan.department}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{plan.standard}</div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          ข้อ {plan.clauses.join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{plan.date}</div>
                        <div className="text-slate-500 text-[11px]">{plan.startTime} - {plan.endTime} น.</div>
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">{plan.leadAuditor}</td>
                      <td className="px-4 py-3 text-slate-800">{plan.auditee}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(plan.status)}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectPlanForQuestions(plan)}
                            title="สร้างคำถามอัตโนมัติ"
                            className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectPlanForInterview(plan)}
                            title="สัมภาษณ์และบันทึกผล"
                            className="px-2.5 py-1 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded text-xs cursor-pointer"
                          >
                            บันทึกผล
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(plan)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 rounded cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบแผน ${plan.planCode}?`)) {
                                onDeletePlan(plan.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Modal: Create or Edit Plan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingPlan ? 'แก้ไขแผนการตรวจประเมิน' : 'กำหนดแผนการตรวจประเมินภายในใหม่'}
                  </h3>
                  <p className="text-xs text-slate-500">ระบุรายละเอียดแผนก มาตรฐาน ข้อกำหนด และทีมผู้ตรวจ</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    รหัสแผนการตรวจ (Plan Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.planCode}
                    onChange={(e) => setFormData({ ...formData, planCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    หัวข้อการตรวจประเมิน (Audit Title) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น การตรวจประเมินระบบคุณภาพและสายการประกอบ"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    แผนกที่รับการตรวจ (Department) *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    มาตรฐานอ้างอิง (Standard) *
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) => {
                      const newStd = e.target.value as StandardType;
                      const matched = STANDARDS_DATA.find((s) => s.id === newStd);
                      setFormData({
                        ...formData,
                        standard: newStd,
                        clauses: matched && matched.clauses[0] ? [matched.clauses[0].clause] : [],
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {STANDARDS_DATA.map((std) => (
                      <option key={std.id} value={std.id}>
                        {std.id} - {std.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clause Checklist selection */}
              <div>
                {(() => {
                  const deptClauses = getDepartmentClauses(formData.standard || 'ISO 9001:2015', formData.department || DEPARTMENTS[0]);
                  const allDeptCodes = deptClauses.allRelevantClauses.map((c) => c.clause);

                  return (
                    <>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          ข้อกำหนดที่ตรวจประเมินในครั้งนี้ (เลือกได้หลายข้อ) *
                        </label>
                        {allDeptCodes.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                clauses: Array.from(new Set([...(formData.clauses || []), ...allDeptCodes])),
                              });
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 cursor-pointer"
                          >
                            + เลือกข้อกำหนดของ {formData.department?.split(' ')[0]} ทั้งหมด ({allDeptCodes.length} ข้อ)
                          </button>
                        )}
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 max-h-48 overflow-y-auto space-y-1.5">
                        {currentStandardObj.clauses.map((c) => {
                          const isChecked = (formData.clauses || []).includes(c.clause);
                          const isDeptSpecific = allDeptCodes.includes(c.clause);
                          return (
                            <label
                              key={c.clause}
                              className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                isChecked ? 'bg-blue-50 text-blue-900 border border-blue-200' : 'hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleClauseToggle(c.clause)}
                                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold">
                                    ข้อ {c.clause}: {c.title}
                                  </span>
                                  {isDeptSpecific && (
                                    <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                      ตรงกับแผนกนี้
                                    </span>
                                  )}
                                  {c.isCore && (
                                    <span className="text-amber-500 text-[10px] font-bold">★ ข้อกำหนดหลัก</span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500">{c.summary}</div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Date, Time, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">วันที่ตรวจ *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">เวลาเริ่ม</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">เวลาสิ้นสุด</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">สถานะแผน</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as PlanStatus })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Scheduled">วางแผนไว้ (Scheduled)</option>
                    <option value="In Progress">กำลังตรวจ (In Progress)</option>
                    <option value="Completed">ตรวจเสร็จแล้ว (Completed)</option>
                    <option value="Postponed">เลื่อนการตรวจ (Postponed)</option>
                  </select>
                </div>
              </div>

              {/* Personnel: Lead Auditor, Team, Auditee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ผู้ตรวจหลัก (Lead Auditor) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.leadAuditor}
                    onChange={(e) => setFormData({ ...formData, leadAuditor: e.target.value })}
                    placeholder="เช่น อัครพล เกียรติสกุล"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ทีมผู้ตรวจร่วม (คั่นด้วยจุลภาค)
                  </label>
                  <input
                    type="text"
                    value={auditorTeamInput}
                    onChange={(e) => setAuditorTeamInput(e.target.value)}
                    placeholder="กนกวรรณ, พงศกร"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ผู้รับการตรวจ (Auditee) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.auditee}
                    onChange={(e) => setFormData({ ...formData, auditee: e.target.value })}
                    placeholder="เช่น สมเกียรติ ยิ่งเจริญ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Scope & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    สถานที่ตรวจ (Location)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="เช่น อาคารผลิต 1 ห้องควบคุม"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ขอบข่าย / วัตถุประสงค์ (Scope)
                  </label>
                  <input
                    type="text"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    placeholder="เช่น การควบคุมกระบวนการผลิตและการจัดการของเสีย"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingPlan ? 'บันทึกการแก้ไข' : 'บันทึกแผนการตรวจ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
