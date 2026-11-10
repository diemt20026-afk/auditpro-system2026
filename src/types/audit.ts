export type StandardType = 
  | 'ISO 9001:2015' 
  | 'ISO 14001:2015' 
  | 'ISO 45001:2018' 
  | 'ISO/IEC 27001:2022' 
  | 'GHPs / HACCP' 
  | 'IATF 16949:2016';

export type FindingSeverity = 'Major NC' | 'Minor NC' | 'OFI' | 'Conform';

export type PlanStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Postponed';

export type CarStatus = 'Issued' | 'Action Submitted' | 'Verified' | 'Closed';

export interface StandardClause {
  clause: string;
  title: string;
  englishTitle: string;
  summary: string;
  keyAuditingPoints: string[];
  sampleQuestions: string[];
  applicableDepartments?: string[];
  isCore?: boolean;
  category?: string;
}

export interface StandardDefinition {
  id: StandardType;
  name: string;
  code: string;
  description: string;
  color: string;
  badgeBg: string;
  clauses: StandardClause[];
}

export interface AuditPlan {
  id: string;
  planCode: string;
  title: string;
  department: string;
  standard: StandardType;
  clauses: string[];
  leadAuditor: string;
  auditorTeam: string[];
  auditee: string;
  auditeeRole: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  scope: string;
  status: PlanStatus;
  checklistQuestionIds?: string[];
  notes?: string;
}

export interface AuditQuestion {
  id: string;
  standard: StandardType;
  clause: string;
  clauseTitle: string;
  department: string;
  question: string;
  objectiveEvidence: string;
  sampleGuideline: string;
  potentialRisk: string;
  clauseReference?: string;
  isAiGenerated?: boolean;
}

export interface InterviewRecord {
  id: string;
  planId?: string;
  planCode?: string;
  department: string;
  standard: StandardType;
  clause: string;
  clauseTitle: string;
  interviewee: string;
  intervieweeRole: string;
  auditorName: string;
  interviewDate: string;
  interviewNotes: string;
  evidenceObserved: string;
  findingType: FindingSeverity;
  findingDescription: string;
  objectiveEvidence: string;
  severityRationale: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  immediateCorrection?: string;
  rootCauseGuidance?: string;
  carId?: string;
  carIssued?: boolean;
}

export interface FiveWhyItem {
  level: number;
  question: string;
  answer: string;
}

export interface CARRecord {
  id: string;
  carNo: string;
  findingId?: string;
  planId?: string;
  department: string;
  standard: StandardType;
  clause: string;
  severity: 'Major NC' | 'Minor NC' | 'OFI';
  issuedBy: string;
  issuedDate: string;
  replyDueDate: string;
  problemStatement: string;
  objectiveEvidence: string;
  isoRequirementViolated: string;
  
  // Step 1: Immediate Containment
  immediateCorrection: {
    action: string;
    completedDate: string;
    personInCharge: string;
  };

  // Step 2: Root Cause Analysis
  rootCauseAnalysis: {
    method: '5Whys' | 'Fishbone' | 'Other';
    fiveWhys: FiveWhyItem[];
    summary: string;
  };

  // Step 3: Corrective & Preventive Action (CAPA)
  correctiveAction: {
    description: string;
    dueDate: string;
    personInCharge: string;
  };
  preventiveAction: {
    description: string;
    dueDate: string;
    personInCharge: string;
  };

  // Step 4: Verification & Closure
  verification: {
    auditorName: string;
    verifiedDate: string;
    result: 'Effective' | 'Ineffective' | 'Pending';
    notes: string;
    followUpCarNo?: string;
  };

  status: CarStatus;
  closedDate?: string;
}
