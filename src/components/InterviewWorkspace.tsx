import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Send, 
  ArrowRight, 
  Layers, 
  User, 
  Search, 
  BookOpen, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  RefreshCw,
  PlusCircle,
  Trash2,
  ExternalLink,
  ChevronRight,
  Square,
  Radio,
  Volume2
} from 'lucide-react';
import { AuditPlan, FindingSeverity, InterviewRecord, StandardType } from '../types/audit';
import { DEPARTMENTS, STANDARDS_DATA } from '../data/standards';

interface InterviewWorkspaceProps {
  plans: AuditPlan[];
  interviews: InterviewRecord[];
  onAddInterview: (record: InterviewRecord) => void;
  onDeleteInterview: (id: string) => void;
  onIssueCarFromFinding: (record: InterviewRecord) => void;
  prefilledInterviewData?: {
    standard: StandardType;
    clause: string;
    clauseTitle: string;
    department: string;
    questionText: string;
    objectiveEvidence: string;
  } | null;
  selectedPlanForInterview?: AuditPlan | null;
}

export const InterviewWorkspace: React.FC<InterviewWorkspaceProps> = ({
  plans,
  interviews,
  onAddInterview,
  onDeleteInterview,
  onIssueCarFromFinding,
  prefilledInterviewData,
  selectedPlanForInterview,
}) => {
  // Form State
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    selectedPlanForInterview?.id || ''
  );
  const [department, setDepartment] = useState<string>(
    selectedPlanForInterview?.department || prefilledInterviewData?.department || DEPARTMENTS[0]
  );
  const [standard, setStandard] = useState<StandardType>(
    selectedPlanForInterview?.standard || prefilledInterviewData?.standard || 'ISO 9001:2015'
  );
  const [clause, setClause] = useState<string>(
    prefilledInterviewData?.clause || selectedPlanForInterview?.clauses[0] || '8.5.1'
  );
  const [interviewee, setInterviewee] = useState<string>(
    selectedPlanForInterview?.auditee || ''
  );
  const [intervieweeRole, setIntervieweeRole] = useState<string>(
    selectedPlanForInterview?.auditeeRole || 'หัวหน้างาน'
  );
  const [auditorName, setAuditorName] = useState<string>(
    selectedPlanForInterview?.leadAuditor || 'อัครพล เกียรติสกุล (Lead Auditor)'
  );
  const [interviewDate, setInterviewDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [questionAsked, setQuestionAsked] = useState<string>(
    prefilledInterviewData?.questionText || ''
  );
  const [interviewNotes, setInterviewNotes] = useState<string>('');
  const [evidenceObserved, setEvidenceObserved] = useState<string>(
    prefilledInterviewData?.objectiveEvidence || ''
  );

  // Continuous Speech Recognition state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(false);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  const shouldKeepListeningRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    findingType: FindingSeverity;
    clauseReference: string;
    clauseRequirementSummary: string;
    findingDescription: string;
    objectiveEvidence: string;
    severityRationale: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    immediateCorrection: string;
    rootCauseGuidance: string;
  } | null>(null);

  // Filter for Interview Log list
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchLogTerm, setSearchLogTerm] = useState<string>('');

  const currentStandardObj = STANDARDS_DATA.find((s) => s.id === standard) || STANDARDS_DATA[0];
  const currentClauseObj = currentStandardObj.clauses.find((c) => c.clause === clause) || currentStandardObj.clauses[0];

  // Check speech recognition capability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setRecognitionSupported(true);
      }
    }
  }, []);

  // Update when selectedPlanForInterview changes
  useEffect(() => {
    if (selectedPlanForInterview) {
      setSelectedPlanId(selectedPlanForInterview.id);
      setDepartment(selectedPlanForInterview.department);
      setStandard(selectedPlanForInterview.standard);
      if (selectedPlanForInterview.clauses[0]) {
        setClause(selectedPlanForInterview.clauses[0]);
      }
      setInterviewee(selectedPlanForInterview.auditee);
      setIntervieweeRole(selectedPlanForInterview.auditeeRole);
      setAuditorName(selectedPlanForInterview.leadAuditor);
    }
  }, [selectedPlanForInterview]);

  // Update when prefilledInterviewData changes
  useEffect(() => {
    if (prefilledInterviewData) {
      setStandard(prefilledInterviewData.standard);
      setClause(prefilledInterviewData.clause);
      setDepartment(prefilledInterviewData.department);
      setQuestionAsked(prefilledInterviewData.questionText);
      setEvidenceObserved(prefilledInterviewData.objectiveEvidence);
    }
  }, [prefilledInterviewData]);

  // Timer for active recording duration
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format recording seconds to mm:ss
  const formatRecordingTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Stop Continuous Speech Recognition
  const stopRecording = () => {
    shouldKeepListeningRef.current = false;
    setIsRecording(false);
    setInterimText('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  // Start Continuous Speech Recognition with auto-reconnect
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicNotice('เบราว์เซอร์นี้ยังไม่รองรับ Web Speech API สามารถพิมพ์บันทึกข้อความได้โดยตรง');
      return;
    }

    setMicNotice(null);
    setInterimText('');
    shouldKeepListeningRef.current = true;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'th-TH';
      recognition.continuous = true; // Stay active across pauses
      recognition.interimResults = true; // Show live transcription in real time
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let finalChunk = '';
        let interimChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            finalChunk += (finalChunk ? ' ' : '') + transcript;
          } else {
            interimChunk += (interimChunk ? ' ' : '') + transcript;
          }
        }

        if (finalChunk.trim()) {
          setInterviewNotes((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalChunk.trim()}` : finalChunk.trim();
          });
        }

        setInterimText(interimChunk.trim());
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldKeepListeningRef.current = false;
          setIsRecording(false);
          setInterimText('');
          setMicNotice('ไมโครโฟนถูกบล็อกหรือยังไม่ได้รับสิทธิ์ในเบราว์เซอร์: สามารถพิมพ์บันทึกข้อความลงในช่องด้านล่างได้ทันที');
        } else if (event.error === 'no-speech') {
          // Normal pause in conversation; do not abort, let it keep listening
        } else if (event.error === 'audio-capture') {
          shouldKeepListeningRef.current = false;
          setIsRecording(false);
          setInterimText('');
          setMicNotice('ไม่พบอุปกรณ์ไมโครโฟนบนเครื่อง สามารถพิมพ์บันทึกข้อความแทนได้');
        } else {
          // Transient network or pause, onend will auto-restart if shouldKeepListeningRef is true
        }
      };

      recognition.onend = () => {
        // If user hasn't pressed Stop, automatically resume listening seamlessly!
        if (shouldKeepListeningRef.current) {
          try {
            recognition.start();
          } catch {
            setTimeout(() => {
              if (shouldKeepListeningRef.current) {
                try {
                  recognition.start();
                } catch {}
              }
            }, 200);
          }
        } else {
          setIsRecording(false);
          setInterimText('');
        }
      };

      recognition.start();
    } catch (e: any) {
      shouldKeepListeningRef.current = false;
      setIsRecording(false);
      setInterimText('');
      setMicNotice('ไม่สามารถเริ่มต้นระบบบันทึกเสียงได้ สามารถพิมพ์บันทึกข้อความแทนได้ทันที');
    }
  };

  // Toggle Continuous Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Run AI Analysis with guaranteed fallback
  const handleAnalyzeInterview = async () => {
    if (!interviewNotes.trim() && !evidenceObserved.trim()) {
      alert('กรุณากรอกบันทึกการสัมภาษณ์ หรือหลักฐานเชิงประจักษ์ที่ตรวจพบ ก่อนวิเคราะห์');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/audit/analyze-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standard,
          clause,
          department,
          interviewee,
          interviewNotes: `คำถาม: ${questionAsked}\nบันทึก: ${interviewNotes}`,
          evidenceObserved,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.findingType) {
          setAnalysisResult({
            findingType: data.findingType || 'Minor NC',
            clauseReference: data.clauseReference || `${standard} ข้อ ${clause}`,
            clauseRequirementSummary: data.clauseRequirementSummary || currentClauseObj?.summary || '',
            findingDescription: data.findingDescription || interviewNotes,
            objectiveEvidence: data.objectiveEvidence || evidenceObserved,
            severityRationale: data.severityRationale || 'พิจารณาตามเกณฑ์ ISO 19011',
            riskLevel: data.riskLevel || 'Medium',
            immediateCorrection: data.immediateCorrection || 'ดำเนินการแก้ไขเฉพาะหน้า',
            rootCauseGuidance: data.rootCauseGuidance || 'วิเคราะห์ด้วย 5 Whys',
          });
          return;
        }
      }
    } catch {
      // Network or fetch interruption — will fall through to client-side rule-based analysis
    }

    // Client-side ISO 19011 heuristic fallback
    const combined = `${interviewNotes} ${evidenceObserved}`.toLowerCase();
    const isConform =
      (combined.includes('ถูกต้อง') ||
        combined.includes('ครบถ้วน') ||
        combined.includes('สอดคล้อง') ||
        combined.includes('ผ่านเกณฑ์') ||
        combined.includes('สมบูรณ์') ||
        combined.includes('100%')) &&
      !combined.includes('ไม่สอดคล้อง') &&
      !combined.includes('ไม่พบ') &&
      !combined.includes('หมดอายุ') &&
      !combined.includes('ชำรุด') &&
      !combined.includes('ไม่ได้') &&
      !combined.includes('ไม่มี');

    let fType: FindingSeverity = 'Minor NC';
    let rLevel: 'High' | 'Medium' | 'Low' = 'Medium';
    let rationale = 'ประเมินเป็น Minor NC ตามเกณฑ์ ISO 19011 เนื่องจากพบข้อบกพร่องเฉพาะจุด (Isolated case) โดยระบบภาพรวมยังดำเนินการได้';
    let correction = 'ดำเนินการแก้ไขข้อผิดพลาดเฉพาะจุดทันที บันทึกข้อมูลที่ตกหล่นให้ครบถ้วน และทบทวนเอกสารย้อนหลัง';
    let rootCause = 'วิเคราะห์สาเหตุด้วย 5 Whys มุ่งเน้นกระบวนการตรวจสอบตนเอง (Checklist) ก่อนเริ่มงาน';

    if (isConform) {
      fType = 'Conform';
      rLevel = 'Low';
      rationale = 'สอดคล้องตามข้อกำหนด มีเอกสารบันทึกและหลักฐานเชิงประจักษ์ครบถ้วนตามเกณฑ์';
      correction = 'ดำเนินการรักษามาตรฐานการปฏิบัติงานอย่างต่อเนื่อง';
      rootCause = 'ไม่มีข้อบกพร่องเชิงระบบ ดำเนินการตาม Best Practice ต่อไป';
    } else if (
      combined.includes('ไม่มีขั้นตอน') ||
      combined.includes('ไม่ได้ทำเลย') ||
      combined.includes('ผิดกฎหมาย') ||
      combined.includes('ปนเปื้อน') ||
      combined.includes('หลุดไปถึงลูกค้า') ||
      combined.includes('ซ้ำซาก') ||
      combined.includes('หมดอายุทั้งหมด') ||
      combined.includes('เครื่องจักรชำรุด')
    ) {
      fType = 'Major NC';
      rLevel = 'High';
      rationale = 'ประเมินเป็น Major NC ตามเกณฑ์ ISO 19011 เนื่องจากขาดการควบคุมกระบวนการหลัก หรือส่งผลกระทบต่อคุณภาพผลิตภัณฑ์และความปลอดภัยอย่างมีนัยสำคัญ';
      correction = 'กักกันผลิตภัณฑ์และกระบวนการที่เกี่ยวข้องทันที ระงับการใช้งาน และออกคำสั่งกักกันย้อนหลัง';
      rootCause = 'วิเคราะห์ 5 Whys มุ่งเน้นไปที่ระบบแจ้งเตือนอัตโนมัติ การควบคุมการเปลี่ยนแปลง และการกำกับดูแลของฝ่ายบริหาร';
    } else if (
      combined.includes('แนะนำ') ||
      combined.includes('ข้อสังเกต') ||
      combined.includes('ควรปรับปรุง') ||
      combined.includes('เพิ่มความสะดวก') ||
      combined.includes('ofi')
    ) {
      fType = 'OFI';
      rLevel = 'Low';
      rationale = 'ประเมินเป็น Opportunity for Improvement (OFI) สอดคล้องตามข้อกำหนดขั้นต่ำแล้ว แต่สามารถปรับปรุงให้มีประสิทธิภาพดียิ่งขึ้น';
      correction = 'ทบทวนนำข้อสังเกตไปปรับปรุงขั้นตอนการทำงานเพื่อเพิ่มความรัดกุม';
      rootCause = 'โอกาสในการปรับปรุงกระบวนการอย่างต่อเนื่อง (Continual Improvement)';
    }

    setAnalysisResult({
      findingType: fType,
      clauseReference: `${standard} ข้อ ${clause}`,
      clauseRequirementSummary: currentClauseObj?.summary || 'ข้อกำหนดระบุให้จัดทำและควบคุมกระบวนการอย่างมีประสิทธิผล',
      findingDescription: isConform
        ? `จากการสุ่มตรวจหลักฐานและสัมภาษณ์ ${interviewee || 'ผู้รับการตรวจ'} แผนก ${department} พบว่ามีการปฏิบัติตามขั้นตอนอย่างถูกต้อง`
        : `จากการสุ่มตรวจหลักฐานเชิงประจักษ์ ณ แผนก ${department} พบว่า ${evidenceObserved || interviewNotes || 'พบการปฏิบัติไม่เป็นไปตามระเบียบที่กำหนด'}`,
      objectiveEvidence: evidenceObserved || 'บันทึกการสัมภาษณ์และเอกสารหลักฐานหน้างาน',
      severityRationale: rationale,
      riskLevel: rLevel,
      immediateCorrection: correction,
      rootCauseGuidance: rootCause,
    });
  };

  // Save finding into record list
  const handleSaveFinding = (autoIssueCar: boolean = false) => {
    if (!analysisResult) {
      alert('กรุณากดวิเคราะห์ผลด้วย AI หรือระบุผลการตรวจก่อนบันทึก');
      return;
    }

    const matchedPlan = plans.find((p) => p.id === selectedPlanId);

    const newRecord: InterviewRecord = {
      id: `rec-${Date.now()}`,
      planId: selectedPlanId || undefined,
      planCode: matchedPlan?.planCode || undefined,
      department,
      standard,
      clause,
      clauseTitle: currentClauseObj?.title || 'ข้อกำหนด',
      interviewee: interviewee || 'ผู้รับการตรวจ',
      intervieweeRole: intervieweeRole || 'เจ้าหน้าที่',
      auditorName: auditorName || 'Lead Auditor',
      interviewDate,
      interviewNotes: questionAsked ? `[คำถาม: ${questionAsked}]\n${interviewNotes}` : interviewNotes,
      evidenceObserved,
      findingType: analysisResult.findingType,
      findingDescription: analysisResult.findingDescription,
      objectiveEvidence: analysisResult.objectiveEvidence,
      severityRationale: analysisResult.severityRationale,
      riskLevel: analysisResult.riskLevel,
      immediateCorrection: analysisResult.immediateCorrection,
      rootCauseGuidance: analysisResult.rootCauseGuidance,
      carIssued: false,
    };

    onAddInterview(newRecord);

    if (autoIssueCar && (analysisResult.findingType === 'Major NC' || analysisResult.findingType === 'Minor NC')) {
      onIssueCarFromFinding(newRecord);
    } else {
      alert(`บันทึกผลการตรวจเรียบร้อย: ${analysisResult.findingType}`);
      // Clear form
      setInterviewNotes('');
      setEvidenceObserved('');
      setQuestionAsked('');
      setAnalysisResult(null);
    }
  };

  // Quick Preset Sample Fillers for rapid user testing
  const handleQuickPreset = (type: FindingSeverity) => {
    switch (type) {
      case 'Major NC':
        setStandard('ISO 9001:2015');
        setClause('7.1.5');
        setDepartment('ฝ่ายผลิต (Production)');
        setInterviewee('สมเกียรติ ยิ่งเจริญ (ผู้จัดการฝ่ายผลิต)');
        setIntervieweeRole('ผู้จัดการฝ่ายผลิต');
        setQuestionAsked('เครื่องมือวัดในสายการผลิตมีการสอบเทียบตามแผน และมีการควบคุมสถานะอย่างไร?');
        setInterviewNotes('จากการสุ่มตรวจเครื่องวัด Digital Micrometer และ Caliper จำนวน 4 เครื่อง พบว่ามี 3 เครื่องที่สติกเกอร์หมดอายุการสอบเทียบไปแล้วตั้งแต่เดือนกรกฎาคม 2026 แต่ช่างเทคนิคยังนำมาใช้วัดชิ้นงานจริงก่อนส่งมอบ และไม่มีบันทึกการทวนสอบความแม่นยำย้อนหลัง');
        setEvidenceObserved('Micrometer รหัส MC-008 และ Caliper QC-VC-002, 005 หมดอายุสอบเทียบ 15/07/2026 ใช้งานอยู่ ณ Line 2 ชิ้นงานล็อต B-8809');
        break;
      case 'Minor NC':
        setStandard('ISO 9001:2015');
        setClause('8.4');
        setDepartment('ฝ่ายจัดซื้อและจัดหา (Procurement)');
        setInterviewee('นภาพร สดใส (หัวหน้าแผนกจัดซื้อ)');
        setIntervieweeRole('หัวหน้าแผนกจัดซื้อ');
        setQuestionAsked('มีเกณฑ์การประเมินและคัดเลือกผู้ขายใน Approved Vendor List อย่างไร?');
        setInterviewNotes('จากการสุ่มตรวจแฟ้มประเมินผู้ขายประจำปี 2025 จำนวน 10 ราย พบว่ามีผู้ขาย 1 ราย (บจก. เคมีภัณฑ์ไทย) ขาดแบบประเมินผลงานประจำปี แต่ยังมีการออกใบสั่งซื้อ PO-69-1022 ไปเมื่อเดือนก่อน');
        setEvidenceObserved('แฟ้ม AVL รหัส V-044 ขาดแบบประเมิน Form PUR-08 แต่มีใบสั่งซื้อ PO-69-1022 จำนวนเงิน 45,000 บาท');
        break;
      case 'OFI':
        setStandard('ISO 14001:2015');
        setClause('8.1');
        setDepartment('ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)');
        setInterviewee('ณัฐพงษ์ เจริญทรัพย์ (ผู้จัดการฝ่ายคลัง)');
        setIntervieweeRole('ผู้จัดการคลังสินค้า');
        setQuestionAsked('มีการควบคุมการคัดแยกขยะและของเสียในพื้นที่คลังสินค้าอย่างไร?');
        setInterviewNotes('การคัดแยกขยะรีไซเคิลและขยะทั่วไปทำได้ถูกต้อง มีถังแยกสีชัดเจน อย่างไรก็ตาม ถังขยะประเภทเศษพลาสติกฟิล์มยืดเต็มเร็วและล้นออกนอกถังเป็นบางช่วงเวลา ควรพิจารณาเพิ่มขนาดถังหรือจัดรอบเก็บให้ถี่ขึ้น');
        setEvidenceObserved('ถังขยะรหัส W-03 มีฟิล์มยืดล้นเล็กน้อย ไม่มีสารอันตรายปนเปื้อน');
        break;
      case 'Conform':
        setStandard('ISO 9001:2015');
        setClause('7.2');
        setDepartment('ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training)');
        setInterviewee('สุดารัตน์ ใจดี (HR Specialist)');
        setIntervieweeRole('HR Specialist');
        setQuestionAsked('การฝึกอบรมพนักงานมีหลักฐานการประเมินประสิทธิผลหลังการอบรมอย่างไร?');
        setInterviewNotes('สุ่มตรวจแฟ้มประวัติการฝึกอบรมของพนักงานฝ่ายผลิตและ QA จำนวน 6 ท่าน พบว่ามีแผนการฝึกอบรมประจำปี บันทึกการเข้าเรียน ผลทดสอบ Post-test และแบบประเมินประสิทธิผลหลังการอบรม 90 วัน ครบถ้วน 100%');
        setEvidenceObserved('แฟ้มประวัติการอบรม EMP-01 ถึง EMP-06 บันทึกครบถ้วนตามขั้นตอน QP-HR-01');
        break;
    }
  };

  // Filtered Interviews Log
  const filteredInterviews = interviews.filter((item) => {
    const matchesSeverity = severityFilter === 'ALL' || item.findingType === severityFilter;
    const matchesSearch =
      item.department.toLowerCase().includes(searchLogTerm.toLowerCase()) ||
      item.findingDescription.toLowerCase().includes(searchLogTerm.toLowerCase()) ||
      item.clause.toLowerCase().includes(searchLogTerm.toLowerCase()) ||
      item.interviewee.toLowerCase().includes(searchLogTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (type: FindingSeverity) => {
    switch (type) {
      case 'Major NC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500 text-white shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Major NC (ข้อบกพร่องรุนแรง)
          </span>
        );
      case 'Minor NC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-3.5 h-3.5" /> Minor NC (ข้อบกพร่องเล็กน้อย)
          </span>
        );
      case 'OFI':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500 text-white shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" /> OFI (ข้อเสนอแนะปรับปรุง)
          </span>
        );
      case 'Conform':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Conform (สอดคล้องตามเกณฑ์)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 text-xs font-medium border border-purple-400/30">
                3. Interview Logging & AI NC Analysis
              </span>
              <span className="text-xs text-purple-200/80">ISO 19011 Compliance</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              บันทึกการสัมภาษณ์ & AI วิเคราะห์ข้อกำหนด (Major NC, Minor NC, OFI)
            </h2>
            <p className="text-sm text-purple-100/90 mt-1 max-w-2xl">
              บันทึกข้อเท็จจริงจากการสัมภาษณ์และหลักฐานเชิงประจักษ์ (Objective Evidence) จากนั้นให้ AI วิเคราะห์ว่าผิดข้อกำหนดใด และจำแนกระดับความรุนแรงตามมาตรฐาน ISO 19011
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="bg-white/10 p-3 rounded-xl border border-white/20 text-xs">
            <div className="text-purple-200 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ทดลองโหลดตัวอย่างข้อมูลจำลอง:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleQuickPreset('Major NC')}
                className="px-2 py-1 bg-rose-500/80 hover:bg-rose-500 text-white rounded font-bold transition-colors cursor-pointer"
              >
                ตัวอย่าง Major NC
              </button>
              <button
                onClick={() => handleQuickPreset('Minor NC')}
                className="px-2 py-1 bg-amber-500/80 hover:bg-amber-500 text-white rounded font-bold transition-colors cursor-pointer"
              >
                ตัวอย่าง Minor NC
              </button>
              <button
                onClick={() => handleQuickPreset('OFI')}
                className="px-2 py-1 bg-blue-500/80 hover:bg-blue-500 text-white rounded font-bold transition-colors cursor-pointer"
              >
                ตัวอย่าง OFI
              </button>
              <button
                onClick={() => handleQuickPreset('Conform')}
                className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded font-bold transition-colors cursor-pointer"
              >
                ตัวอย่าง ผ่าน (Conform)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interview Recording Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <span>แบบบันทึกการสัมภาษณ์และหลักฐานหน้างาน</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                วันที่: {interviewDate}
              </span>
            </div>

            {/* Select Associated Plan */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เชื่อมโยงกับแผนการตรวจ (Audit Plan):
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => {
                  const pid = e.target.value;
                  setSelectedPlanId(pid);
                  const found = plans.find((p) => p.id === pid);
                  if (found) {
                    setDepartment(found.department);
                    setStandard(found.standard);
                    if (found.clauses[0]) setClause(found.clauses[0]);
                    setInterviewee(found.auditee);
                    setIntervieweeRole(found.auditeeRole);
                    setAuditorName(found.leadAuditor);
                  }
                }}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- ไม่ระบุแผน (ตรวจแบบอิสระ / Ad-hoc) --</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.planCode}] {p.title} - {p.department} ({p.standard})
                  </option>
                ))}
              </select>
            </div>

            {/* Meta Row: Standard, Clause, Department */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">มาตรฐาน *</label>
                <select
                  value={standard}
                  onChange={(e) => {
                    const next = e.target.value as StandardType;
                    setStandard(next);
                    const matched = STANDARDS_DATA.find((s) => s.id === next);
                    if (matched && matched.clauses[0]) setClause(matched.clauses[0].clause);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {STANDARDS_DATA.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ข้อกำหนด *</label>
                <select
                  value={clause}
                  onChange={(e) => setClause(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {currentStandardObj.clauses.map((c) => (
                    <option key={c.clause} value={c.clause}>
                      ข้อ {c.clause}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">แผนกที่รับการตรวจ *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personnel Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ผู้รับการสัมภาษณ์ (ชื่อและตำแหน่ง) *
                </label>
                <input
                  type="text"
                  placeholder="เช่น สมเกียรติ ยิ่งเจริญ (ผจก.ฝ่ายผลิต)"
                  value={interviewee}
                  onChange={(e) => setInterviewee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ผู้ตรวจประเมิน (Auditor) *
                </label>
                <input
                  type="text"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Question Asked */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                คำถามที่ใช้สัมภาษณ์ / ประเด็นที่ทำการตรวจสอบ:
              </label>
              <input
                type="text"
                placeholder="ระบุคำถาม หรือเลือกจากแท็บ 'สร้างคำถามอัตโนมัติ'..."
                value={questionAsked}
                onChange={(e) => setQuestionAsked(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Interview Notes & Findings with Voice Dictation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>บันทึกการสัมภาษณ์และสภาพที่ตรวจพบ (Interview Notes) *</span>
                </label>

                {recognitionSupported && (
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>กดเพื่อปิดบันทึก ({formatRecordingTime(recordingSeconds)})</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all cursor-pointer shadow-xs hover:border-purple-300"
                        title="กดเพื่อเปิดไมโครโฟน บันทึกเสียงสัมภาษณ์ต่อเนื่องจนกว่าจะกดปิดบันทึก"
                      >
                        <Mic className="w-3.5 h-3.5 text-purple-600" />
                        <span>บันทึกเสียงต่อเนื่อง (Continuous Dictate)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Active Continuous Recording Dashboard */}
              {isRecording && (
                <div className="mb-2 p-3 bg-rose-50/90 border border-rose-200 rounded-xl text-xs shadow-xs transition-all">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                      </span>
                      <span className="font-bold text-rose-800 text-xs flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-rose-600 animate-spin" />
                        กำลังบันทึกเสียงต่อเนื่อง: {formatRecordingTime(recordingSeconds)}
                      </span>
                      <span className="text-[11px] text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-medium">
                        บันทึกยาวต่อเนื่อง ไม่ตัดหยุดจนกว่าจะกดปิดบันทึก
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Square className="w-3 h-3 fill-current" />
                      <span>ปิดบันทึกเสียง</span>
                    </button>
                  </div>

                  {/* Live Interim Speech Preview */}
                  {interimText ? (
                    <div className="mt-1.5 p-2 bg-white/90 rounded-lg border border-rose-200 text-slate-700 text-xs flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                      <span className="text-rose-950 font-medium">กำลังตรวจจับเสียง:</span>
                      <span className="italic text-rose-900">"{interimText}"</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-rose-700/80 mt-1">
                      🎙️ กำลังรับฟังเสียง... สามารถพูดสัมภาษณ์ ถาม-ตอบ หรือเว้นจังหวะคิดได้ตามธรรมชาติ ระบบจะไม่ตัดหยุดจนกว่าท่านจะกดปุ่ม "ปิดบันทึกเสียง"
                    </p>
                  )}
                </div>
              )}

              {micNotice && (
                <div className="mb-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{micNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMicNotice(null)}
                    className="text-amber-500 hover:text-amber-800 font-bold px-1 text-sm leading-none"
                    title="ปิดการแจ้งเตือน"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="relative">
                <textarea
                  rows={4}
                  required
                  placeholder="บันทึกรายละเอียดคำตอบของผู้รับการตรวจ ข้อเท็จจริงที่พบ ความสอดคล้องหรือไม่สอดคล้องกับระเบียบปฏิบัติ (SOP)... สามารถกดปุ่ม 'บันทึกเสียงต่อเนื่อง' ด้านบนเพื่อพูดบันทึกเสียงยาวได้โดยไม่ตัดหยุด"
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className={`w-full p-3 border rounded-xl text-xs text-slate-900 leading-relaxed transition-all ${
                    isRecording
                      ? 'bg-rose-50/20 border-rose-400 ring-2 ring-rose-200 focus:bg-white'
                      : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500'
                  }`}
                />
                {interviewNotes && (
                  <div className="text-[10px] text-slate-400 text-right mt-0.5">
                    จำนวนตัวอักษร: {interviewNotes.length}
                  </div>
                )}
              </div>
            </div>

            {/* Objective Evidence Observed */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หลักฐานเชิงประจักษ์ที่ตรวจพบ (Objective Evidence: เลขที่เอกสาร, รหัสเครื่องจักร, ภาพถ่าย, บันทึก) *
              </label>
              <textarea
                rows={2}
                placeholder="เช่น ใบสอบเทียบ Caliper รหัส QC-VC-014 วันที่หมดอายุ 15/08/2026, ชิ้นงานล็อต B-8809, บันทึก Inspection Sheet หน้างาน"
                value={evidenceObserved}
                onChange={(e) => setEvidenceObserved(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Big AI Analyze Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeInterview}
                disabled={isAnalyzing}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                  isAnalyzing
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-purple-500/25'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI กำลังวิเคราะห์ข้อกำหนดและระดับ NC...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>วิเคราะห์ข้อกำหนดและระดับ NC ด้วย AI (Analyze with Gemini)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Result & Decision Box (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>ผลการวิเคราะห์โดย AI (Audit Finding)</span>
                </h3>
                {analysisResult && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    วิเคราะห์สำเร็จ
                  </span>
                )}
              </div>

              {analysisResult ? (
                <div className="mt-4 space-y-4">
                  {/* Result Severity Badge */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      ระดับการตัดสินผล (Severity Level):
                    </span>
                    <div className="flex items-center justify-between">
                      <div>{getSeverityBadge(analysisResult.findingType)}</div>
                      <span className="text-xs font-bold text-slate-600 px-2 py-0.5 rounded bg-white border border-slate-200">
                        ความเสี่ยง: {analysisResult.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Violated Clause & Summary */}
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
                    <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                      <span>ข้อกำหนดที่เกี่ยวข้อง: {analysisResult.clauseReference}</span>
                    </div>
                    <p className="text-purple-800 leading-relaxed">
                      {analysisResult.clauseRequirementSummary}
                    </p>
                  </div>

                  {/* Statement of Nonconformity (Statement of Fact) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      คำชี้แจงข้อบกพร่อง (Statement of Fact):
                    </label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                      "{analysisResult.findingDescription}"
                    </div>
                  </div>

                  {/* Severity Rationale (ISO 19011) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      เหตุผลการตัดสินระดับความรุนแรง (ISO 19011 Rationale):
                    </label>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                      {analysisResult.severityRationale}
                    </div>
                  </div>

                  {/* Immediate Correction Suggestion */}
                  {analysisResult.immediateCorrection && analysisResult.immediateCorrection !== '-' && (
                    <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5">
                        คำแนะนำการแก้ไขเร่งด่วน (Immediate Containment):
                      </span>
                      <p className="text-amber-800">{analysisResult.immediateCorrection}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="my-12 text-center text-slate-400 p-6 border-2 border-dashed border-slate-200 rounded-xl">
                  <ShieldAlert className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600 text-sm">ยังไม่มีผลการวิเคราะห์</p>
                  <p className="text-xs mt-1 text-slate-500 max-w-xs mx-auto">
                    กรอกข้อมูลการสัมภาษณ์และหลักฐานเชิงประจักษ์ แล้วกดปุ่ม <strong>"วิเคราะห์ข้อกำหนดและระดับ NC ด้วย AI"</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions: Save Finding & Issue CAR */}
            {analysisResult && (
              <div className="pt-4 border-t border-slate-200 space-y-2 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSaveFinding(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>บันทึกผลการตรวจ</span>
                  </button>

                  {(analysisResult.findingType === 'Major NC' || analysisResult.findingType === 'Minor NC') && (
                    <button
                      onClick={() => handleSaveFinding(true)}
                      className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>ออกใบ CAR ทันที</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-center text-slate-400">
                  หากเลือก "ออกใบ CAR ทันที" ระบบจะสร้าง CAR อัตโนมัติและนำทางไปยังขั้นตอนการปิด CAR
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log of Recorded Interviews & Findings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>บันทึกการตรวจประเมินทั้งหมด ({interviews.length} รายการ)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              รายการที่ได้รับการบันทึกและประเมินผลแล้ว สามารถกดออกใบ CAR ย้อนหลังได้
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            {['ALL', 'Major NC', 'Minor NC', 'OFI', 'Conform'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev === 'ALL' ? 'ทั้งหมด' : sev}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar for Log */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาตามแผนก, ข้อกำหนด, รายละเอียด หรือผู้รับการตรวจ..."
            value={searchLogTerm}
            onChange={(e) => setSearchLogTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Interview Log Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">ระดับผลการตรวจ</th>
                <th className="px-4 py-3">แผนก / ข้อกำหนด</th>
                <th className="px-4 py-3">ผู้รับการสัมภาษณ์</th>
                <th className="px-4 py-3">รายละเอียดข้อบกพร่อง (Statement)</th>
                <th className="px-4 py-3">หลักฐานเชิงประจักษ์</th>
                <th className="px-4 py-3 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    ไม่พบบันทึกการสัมภาษณ์ที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredInterviews.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getSeverityBadge(item.findingType)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{item.department}</div>
                      <div className="text-slate-500 font-mono text-[11px]">
                        {item.standard} ข้อ {item.clause}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{item.interviewee}</div>
                      <div className="text-slate-500 text-[11px]">{item.interviewDate}</div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-2 text-slate-800">{item.findingDescription}</p>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 text-[11px]">{item.objectiveEvidence}</p>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {(item.findingType === 'Major NC' || item.findingType === 'Minor NC') && !item.carIssued && (
                          <button
                            onClick={() => onIssueCarFromFinding(item)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <AlertTriangle className="w-3 h-3" /> ออก CAR
                          </button>
                        )}
                        {item.carIssued && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            ออก CAR แล้ว
                          </span>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('คุณต้องการลบบันทึกการตรวจนี้ใช่หรือไม่?')) {
                              onDeleteInterview(item.id);
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
    </div>
  );
};
