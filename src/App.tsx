import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PlanManagement } from './components/PlanManagement';
import { QuestionGenerator } from './components/QuestionGenerator';
import { InterviewWorkspace } from './components/InterviewWorkspace';
import { CarManagement } from './components/CarManagement';
import { CarPrintModal } from './components/CarPrintModal';
import { AuditSummaryReportModal } from './components/AuditSummaryReportModal';
import { AuditPlan, CARRecord, InterviewRecord, StandardType } from './types/audit';
import { INITIAL_CARS, INITIAL_INTERVIEWS, INITIAL_PLANS } from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'question' | 'interview' | 'car'>('plan');

  // Persistence State
  const [plans, setPlans] = useState<AuditPlan[]>(() => {
    try {
      const saved = localStorage.getItem('auditpro_plans');
      return saved ? JSON.parse(saved) : INITIAL_PLANS;
    } catch {
      return INITIAL_PLANS;
    }
  });

  const [interviews, setInterviews] = useState<InterviewRecord[]>(() => {
    try {
      const saved = localStorage.getItem('auditpro_interviews');
      return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
    } catch {
      return INITIAL_INTERVIEWS;
    }
  });

  const [cars, setCars] = useState<CARRecord[]>(() => {
    try {
      const saved = localStorage.getItem('auditpro_cars');
      return saved ? JSON.parse(saved) : INITIAL_CARS;
    } catch {
      return INITIAL_CARS;
    }
  });

  // Cross-tab transfer states
  const [selectedPlanForQuestions, setSelectedPlanForQuestions] = useState<AuditPlan | null>(null);
  const [selectedPlanForInterview, setSelectedPlanForInterview] = useState<AuditPlan | null>(null);
  const [prefilledInterviewData, setPrefilledInterviewData] = useState<{
    standard: StandardType;
    clause: string;
    clauseTitle: string;
    department: string;
    questionText: string;
    objectiveEvidence: string;
  } | null>(null);

  // Print Modals
  const [carToPrint, setCarToPrint] = useState<CARRecord | null>(null);
  const [isSummaryReportOpen, setIsSummaryReportOpen] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('auditpro_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('auditpro_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('auditpro_cars', JSON.stringify(cars));
  }, [cars]);

  // Handlers for Plans
  const handleAddPlan = (newPlan: AuditPlan) => {
    setPlans([newPlan, ...plans]);
  };

  const handleUpdatePlan = (updatedPlan: AuditPlan) => {
    setPlans(plans.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  const handleDeletePlan = (planId: string) => {
    setPlans(plans.filter((p) => p.id !== planId));
  };

  const handleSelectPlanForQuestions = (plan: AuditPlan) => {
    setSelectedPlanForQuestions(plan);
    setActiveTab('question');
  };

  const handleSelectPlanForInterview = (plan: AuditPlan) => {
    setSelectedPlanForInterview(plan);
    setActiveTab('interview');
  };

  // Handlers for Questions -> Interview
  const handleUseQuestionInInterview = (data: {
    standard: StandardType;
    clause: string;
    clauseTitle: string;
    department: string;
    questionText: string;
    objectiveEvidence: string;
  }) => {
    setPrefilledInterviewData(data);
    setActiveTab('interview');
  };

  // Handlers for Interviews
  const handleAddInterview = (record: InterviewRecord) => {
    setInterviews([record, ...interviews]);
  };

  const handleDeleteInterview = (id: string) => {
    setInterviews(interviews.filter((i) => i.id !== id));
  };

  // Issue CAR from an Interview finding
  const handleIssueCarFromFinding = (finding: InterviewRecord) => {
    const nextCarNumber = cars.length + 1;
    const carNo = `CAR-2026-00${nextCarNumber}`;

    const newCar: CARRecord = {
      id: `car-${Date.now()}`,
      carNo,
      findingId: finding.id,
      planId: finding.planId,
      department: finding.department,
      standard: finding.standard,
      clause: finding.clause,
      severity: (finding.findingType === 'Major NC' ? 'Major NC' : 'Minor NC') as any,
      issuedBy: finding.auditorName || 'Lead Auditor',
      issuedDate: finding.interviewDate || new Date().toISOString().split('T')[0],
      replyDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      problemStatement: finding.findingDescription,
      objectiveEvidence: finding.objectiveEvidence,
      isoRequirementViolated: `${finding.standard} ข้อ ${finding.clause} ${finding.clauseTitle}`,
      immediateCorrection: {
        action: finding.immediateCorrection && finding.immediateCorrection !== '-' ? finding.immediateCorrection : '',
        completedDate: '',
        personInCharge: '',
      },
      rootCauseAnalysis: {
        method: '5Whys',
        fiveWhys: [
          { level: 1, question: 'ทำไมจึงเกิดข้อผิดพลาดนี้ในกระบวนการ?', answer: '' },
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
        auditorName: finding.auditorName || 'Lead Auditor',
        verifiedDate: '',
        result: 'Pending',
        notes: '',
      },
      status: 'Issued',
    };

    setCars([newCar, ...cars]);

    // Mark interview finding as CAR issued
    setInterviews(
      interviews.map((i) => (i.id === finding.id ? { ...i, carIssued: true, carId: newCar.id } : i))
    );

    // Switch to CAR tab
    setActiveTab('car');
  };

  // Handlers for CARs
  const handleAddCar = (newCar: CARRecord) => {
    setCars([newCar, ...cars]);
  };

  const handleUpdateCar = (updatedCar: CARRecord) => {
    setCars(cars.map((c) => (c.id === updatedCar.id ? updatedCar : c)));
  };

  const handleDeleteCar = (carId: string) => {
    setCars(cars.filter((c) => c.id !== carId));
  };

  // Reset Data to sample
  const handleResetData = () => {
    if (confirm('คุณต้องการรีเซ็ตข้อมูลตัวอย่างเริ่มต้นใช่หรือไม่? (ข้อมูลที่บันทึกไว้จะกลับสู่ค่าตั้งต้น)')) {
      setPlans(INITIAL_PLANS);
      setInterviews(INITIAL_INTERVIEWS);
      setCars(INITIAL_CARS);
      localStorage.removeItem('auditpro_plans');
      localStorage.removeItem('auditpro_interviews');
      localStorage.removeItem('auditpro_cars');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Global Header & Nav */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        interviews={interviews}
        cars={cars}
        onResetData={handleResetData}
        onOpenReport={() => setIsSummaryReportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Audit Planning */}
        {activeTab === 'plan' && (
          <PlanManagement
            plans={plans}
            onAddPlan={handleAddPlan}
            onUpdatePlan={handleUpdatePlan}
            onDeletePlan={handleDeletePlan}
            onSelectPlanForInterview={handleSelectPlanForInterview}
            onSelectPlanForQuestions={handleSelectPlanForQuestions}
          />
        )}

        {/* Tab 2: Automated AI Question Generator */}
        {activeTab === 'question' && (
          <QuestionGenerator
            onUseQuestionInInterview={handleUseQuestionInInterview}
            selectedPlanForQuestions={selectedPlanForQuestions}
          />
        )}

        {/* Tab 3: Interview Recording & AI NC Analysis */}
        {activeTab === 'interview' && (
          <InterviewWorkspace
            plans={plans}
            interviews={interviews}
            onAddInterview={handleAddInterview}
            onDeleteInterview={handleDeleteInterview}
            onIssueCarFromFinding={handleIssueCarFromFinding}
            prefilledInterviewData={prefilledInterviewData}
            selectedPlanForInterview={selectedPlanForInterview}
          />
        )}

        {/* Tab 4: NC Summary & CAR Management */}
        {activeTab === 'car' && (
          <CarManagement
            cars={cars}
            interviews={interviews}
            onAddCar={handleAddCar}
            onUpdateCar={handleUpdateCar}
            onDeleteCar={handleDeleteCar}
            onPrintCar={(car) => setCarToPrint(car)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>AuditPro</strong> — ระบบตรวจประเมินภายในและจัดการ CAR อัจฉริยะ (ISO 9001 / 14001 / 45001 / 27001 / GHPs / IATF)
          </div>
          <div>มาตรฐานการตรวจประเมิน ISO 19011:2018 Guidelines for Auditing Management Systems</div>
        </div>
      </footer>

      {/* Modal: Official Printable CAR Form */}
      {carToPrint && (
        <CarPrintModal car={carToPrint} onClose={() => setCarToPrint(null)} />
      )}

      {/* Modal: Executive Audit Summary Report */}
      {isSummaryReportOpen && (
        <AuditSummaryReportModal
          plans={plans}
          interviews={interviews}
          cars={cars}
          onClose={() => setIsSummaryReportOpen(false)}
        />
      )}
    </div>
  );
}
