import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  FileCheck2, 
  Copy, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Search, 
  RefreshCw, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ListChecks,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { AuditPlan, AuditQuestion, StandardClause, StandardType } from '../types/audit';
import { DEPARTMENTS, STANDARDS_DATA, getDepartmentClauses, getDepartmentScopeGuidance } from '../data/standards';

interface QuestionGeneratorProps {
  onUseQuestionInInterview: (questionData: {
    standard: StandardType;
    clause: string;
    clauseTitle: string;
    department: string;
    questionText: string;
    objectiveEvidence: string;
  }) => void;
  selectedPlanForQuestions?: AuditPlan | null;
}

export const QuestionGenerator: React.FC<QuestionGeneratorProps> = ({
  onUseQuestionInInterview,
  selectedPlanForQuestions,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<StandardType>(
    selectedPlanForQuestions?.standard || 'IATF 16949:2016'
  );
  const [selectedDept, setSelectedDept] = useState<string>(
    selectedPlanForQuestions?.department || 'ฝ่ายจัดซื้อและจัดหา (Procurement)'
  );
  const [filterOnlyDeptClauses, setFilterOnlyDeptClauses] = useState<boolean>(true);
  const [selectedClauseCode, setSelectedClauseCode] = useState<string>('8.4.1.2');
  const [processName, setProcessName] = useState<string>('');
  const [focusArea, setFocusArea] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [generationMode, setGenerationMode] = useState<'single' | 'department'>('department');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<AuditQuestion[]>([]);
  const [checklistSummary, setChecklistSummary] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update when selectedPlanForQuestions changes
  useEffect(() => {
    if (selectedPlanForQuestions) {
      setSelectedStandard(selectedPlanForQuestions.standard);
      setSelectedDept(selectedPlanForQuestions.department);
      if (selectedPlanForQuestions.clauses[0]) {
        setSelectedClauseCode(selectedPlanForQuestions.clauses[0]);
      }
    }
  }, [selectedPlanForQuestions]);

  const currentStandardObj = STANDARDS_DATA.find((s) => s.id === selectedStandard) || STANDARDS_DATA[0];

  // Get department matching clauses
  const { coreClauses, supportingClauses, allRelevantClauses } = getDepartmentClauses(
    selectedStandard,
    selectedDept
  );

  const scopeGuidance = getDepartmentScopeGuidance(selectedStandard, selectedDept);

  // Filter clauses list according to toggle
  const availableClauses = filterOnlyDeptClauses && allRelevantClauses.length > 0
    ? allRelevantClauses
    : currentStandardObj.clauses;

  // Ensure selectedClauseCode is valid in the available list
  useEffect(() => {
    const isPresent = availableClauses.some((c) => c.clause === selectedClauseCode);
    if (!isPresent && availableClauses.length > 0) {
      setSelectedClauseCode(availableClauses[0].clause);
    }
  }, [availableClauses, selectedClauseCode]);

  const currentClause =
    currentStandardObj.clauses.find((c) => c.clause === selectedClauseCode) ||
    currentStandardObj.clauses[0];

  // 1. Single Clause Question Generation
  const handleGenerateSingleClause = async () => {
    setIsLoading(true);
    setGenerationMode('single');
    setErrorMessage(null);
    setChecklistSummary(null);

    try {
      const response = await fetch('/api/audit/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standard: selectedStandard,
          clause: currentClause.clause,
          clauseTitle: currentClause.title,
          department: selectedDept,
          processName: processName.trim() || undefined,
          focusArea: focusArea.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        const formatted: AuditQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: `q-ai-${Date.now()}-${idx}`,
          standard: selectedStandard,
          clause: currentClause.clause,
          clauseTitle: currentClause.title,
          department: selectedDept,
          question: q.question,
          objectiveEvidence: q.objectiveEvidence,
          sampleGuideline: q.sampleGuideline,
          potentialRisk: q.potentialRisk,
          clauseReference: q.clauseReference || `${selectedStandard} ข้อ ${currentClause.clause}`,
          isAiGenerated: true,
        }));
        setGeneratedQuestions(formatted);
      } else {
        throw new Error('ไม่พบข้อมูลคำถามจากระบบ');
      }
    } catch (err: any) {
      console.error('Error generating questions:', err);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการสร้างคำถาม กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Comprehensive Department Audit Program Generation
  const handleGenerateDepartmentChecklist = async () => {
    setIsLoading(true);
    setGenerationMode('department');
    setErrorMessage(null);

    const clausesToSend = allRelevantClauses.map((c) => ({
      clause: c.clause,
      title: c.title,
    }));

    try {
      const response = await fetch('/api/audit/generate-department-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standard: selectedStandard,
          department: selectedDept,
          clauses: clausesToSend,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions)) {
        setChecklistSummary(data.summary || data.checklistTitle);
        const formatted: AuditQuestion[] = data.questions.map((q: any, idx: number) => ({
          id: `q-dept-${Date.now()}-${idx}`,
          standard: selectedStandard,
          clause: q.clause || currentClause.clause,
          clauseTitle: q.clauseTitle || currentClause.title,
          department: selectedDept,
          question: q.question,
          objectiveEvidence: q.objectiveEvidence,
          sampleGuideline: q.sampleGuideline,
          potentialRisk: q.potentialRisk,
          clauseReference: q.clauseReference || `${selectedStandard} ข้อ ${q.clause || currentClause.clause}`,
          isAiGenerated: true,
        }));
        setGeneratedQuestions(formatted);
      } else {
        throw new Error('ไม่พบข้อมูลคำถามจากระบบ');
      }
    } catch (err: any) {
      console.error('Error generating department checklist:', err);
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการสร้างชุดคำถามของแผนก');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
                2. Department-Driven Audit Checklist
              </span>
              <span className="text-xs text-blue-200/80">ระบบจับคู่แผนกกับข้อกำหนดอัจฉริยะ</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              สร้างคำถามตรวจประเมินตามข้อกำหนดที่ครอบคลุมแผนก
            </h2>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
              ระบบวิเคราะห์และคัดกรองข้อกำหนดที่เกี่ยวข้องกับแผนกที่ตรวจเป็นหลัก (เช่น IATF 16949 กับฝ่ายจัดซื้อ) เพื่อให้การ Audit ครอบคลุมข้อกำหนดของแผนกนั้นอย่างครบถ้วนทุกมิติ
            </p>
          </div>

          {selectedPlanForQuestions && (
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-xs">
              <div className="text-blue-200 font-semibold">อ้างอิงจากแผนการตรวจ:</div>
              <div className="font-bold text-white text-sm mt-0.5">{selectedPlanForQuestions.planCode}: {selectedPlanForQuestions.title}</div>
              <div className="text-blue-100/80 mt-0.5">{selectedPlanForQuestions.department} | {selectedPlanForQuestions.standard}</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Department & Standard Selection Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span>กำหนดแผนกและมาตรฐานเป้าหมาย</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Department Selector (Primary) */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <label className="block text-xs font-bold text-blue-900 mb-1.5 flex items-center justify-between">
              <span>1. แผนกที่ต้องการตรวจประเมิน (Auditee Department) *</span>
              <span className="text-[11px] font-normal text-blue-600">เป็นเกณฑ์หลักในการจับคู่ข้อกำหนด</span>
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-2xs"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Standard Selector */}
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <label className="block text-xs font-bold text-indigo-900 mb-1.5">
              2. มาตรฐานอ้างอิง (Audit Standard) *
            </label>
            <select
              value={selectedStandard}
              onChange={(e) => {
                const nextStd = e.target.value as StandardType;
                setSelectedStandard(nextStd);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            >
              {STANDARDS_DATA.map((std) => (
                <option key={std.id} value={std.id}>
                  {std.code} - {std.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Intelligent Department Scope & Clauses Overview Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white">{scopeGuidance.scopeTitle}</span>
                <span className="ml-2 text-xs text-emerald-300 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                  {allRelevantClauses.length} ข้อกำหนดที่เกี่ยวข้อง
                </span>
              </div>
            </div>

            {/* Quick Generator Button for Full Department */}
            <button
              onClick={handleGenerateDepartmentChecklist}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                isLoading
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-[1.02]'
              }`}
            >
              {isLoading && generationMode === 'department' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังสร้างชุดคำถามครอบคลุมทั้งแผนก...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>สร้างคำถามครอบคลุมทุกข้อของแผนกนี้ (AI Full Scope)</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {scopeGuidance.scopeSummary}
          </p>

          {/* Interactive Clause Badges of this department */}
          <div className="pt-1">
            <div className="text-[11px] font-semibold text-indigo-200 mb-1.5 flex items-center justify-between">
              <span>คลิกเพื่อสลับข้อกำหนดที่ต้องการเจาะลึก (Quick Clause Selector):</span>
              <span className="text-[10px] text-slate-300">★ = ข้อกำหนดหลักของแผนก</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {allRelevantClauses.map((c) => {
                const isSelected = selectedClauseCode === c.clause;
                return (
                  <button
                    key={c.clause}
                    onClick={() => setSelectedClauseCode(c.clause)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500 text-white shadow-xs ring-2 ring-white/50'
                        : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                    }`}
                  >
                    <span>ข้อ {c.clause}</span>
                    <span className="text-[11px] font-normal truncate max-w-[140px] sm:max-w-[200px]">
                      {c.title}
                    </span>
                    {c.isCore && <span className="text-amber-300 text-[10px]">★</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Single Clause Selector & Options */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-slate-900 block">
                เลือกข้อกำหนดที่ต้องการเจาะลึก (Single Clause Selection):
              </label>
              <span className="text-[11px] text-slate-500">
                ปัจจุบันเลือก: <strong>ข้อ {currentClause.clause} - {currentClause.title}</strong>
              </span>
            </div>

            {/* Filter Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={filterOnlyDeptClauses}
                onChange={(e) => setFilterOnlyDeptClauses(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>กรองเฉพาะข้อกำหนดของ {selectedDept}</span>
            </label>
          </div>

          <select
            value={selectedClauseCode}
            onChange={(e) => setSelectedClauseCode(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
          >
            {availableClauses.map((c) => (
              <option key={c.clause} value={c.clause}>
                ข้อ {c.clause}: {c.title} {c.isCore ? '★ [ข้อกำหนดหลักของแผนก]' : ''}
              </option>
            ))}
          </select>

          {/* Active Clause Info Box */}
          {currentClause && (
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-xs">
                      ข้อ {currentClause.clause}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{currentClause.title}</span>
                    <span className="text-xs text-slate-500 italic hidden sm:inline">({currentClause.englishTitle})</span>
                    {currentClause.isCore && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                        ข้อกำหนดหลัก (Core Mandatory)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    {currentClause.summary}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="text-xs font-semibold text-blue-900">เกณฑ์การตรวจสำคัญ:</span>
                    {currentClause.keyAuditingPoints.map((pt, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-900 text-[11px] font-medium"
                      >
                        ✓ {pt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Optional context */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-medium text-slate-600 block mb-1">
                กระบวนการ / ผลิตภัณฑ์เฉพาะเจาะจง (ถ้ามี):
              </label>
              <input
                type="text"
                placeholder="เช่น การจัดซื้อชิ้นส่วน Direct Material, ชิ้นส่วนอิเล็กทรอนิกส์, วัตถุดิบนำเข้า..."
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-medium text-slate-600 block mb-1">
                จุดเน้นพิเศษหรือประเด็นที่เคยมีปัญหา:
              </label>
              <input
                type="text"
                placeholder="เช่น เคยมีค่าขนส่งพิเศษ (Premium freight), ผู้ขายมีปัญหาจัดส่งล่าช้า..."
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Button: Generate for this specific clause */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateSingleClause}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
                isLoading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isLoading && generationMode === 'single' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังสร้างคำถามเจาะลึกข้อ {currentClause.clause}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>สร้างคำถามเจาะลึกเฉพาะข้อ {currentClause.clause}</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Generated Questions Result Area */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
              <h3 className="text-lg font-bold text-slate-900">
                ชุดคำถามตรวจประเมินสำหรับ {selectedDept} ({generatedQuestions.length} ข้อ)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {generationMode === 'department' ? 'โหมด: ครอบคลุมทั้งแผนก' : `โหมด: เจาะลึกข้อ ${currentClause.clause}`}
              </span>
            </div>
          </div>

          {checklistSummary && (
            <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs text-indigo-900 font-medium">
              <strong>ภาพรวมการตรวจประเมิน:</strong> {checklistSummary}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {generatedQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-indigo-100 hover:border-indigo-400 shadow-sm transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-mono font-bold border border-slate-200">
                          {q.clauseReference || `${selectedStandard} ข้อ ${q.clause}`}
                        </span>
                        <span className="text-xs font-bold text-indigo-700">
                          {q.clauseTitle}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopyQuestion(q.id, q.question)}
                      title="คัดลอกคำถาม"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedId === q.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() =>
                        onUseQuestionInInterview({
                          standard: q.standard,
                          clause: q.clause,
                          clauseTitle: q.clauseTitle,
                          department: q.department,
                          questionText: q.question,
                          objectiveEvidence: q.objectiveEvidence,
                        })
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>ใช้สัมภาษณ์ข้อนี้</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Objective Evidence */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>หลักฐานเชิงประจักษ์ที่ต้องขอดู:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{q.objectiveEvidence}</p>
                  </div>

                  {/* Sampling Guideline */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Search className="w-3.5 h-3.5 text-indigo-600" />
                      <span>แนวทางการสุ่มตรวจ (Sampling):</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{q.sampleGuideline}</p>
                  </div>

                  {/* Potential Risk */}
                  <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-200">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>จุดที่มักพบข้อบกพร่อง (NC Risk):</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">{q.potentialRisk}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Clause Library Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-slate-700" />
              <span>คลังคำถามตามข้อกำหนดมาตรฐาน (Standard Clause Bank)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              คำถามตัวอย่างมาตรฐานสำหรับข้อ {currentClause.clause}: {currentClause.title} สามารถนำไปปรับใช้ได้ทันที
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentClause.sampleQuestions.map((sq, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    ข้อ {currentClause.clause}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">คำถามมาตรฐาน #{idx + 1}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  "{sq}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleCopyQuestion(`preset-${idx}`, sq)}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {copiedId === `preset-${idx}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> คัดลอกแล้ว
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> คัดลอก
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    onUseQuestionInInterview({
                      standard: selectedStandard,
                      clause: currentClause.clause,
                      clauseTitle: currentClause.title,
                      department: selectedDept,
                      questionText: sq,
                      objectiveEvidence: currentClause.keyAuditingPoints.join(', '),
                    })
                  }
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>นำไปใช้ตรวจ</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
