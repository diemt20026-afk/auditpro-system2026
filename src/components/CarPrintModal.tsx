import React from 'react';
import { Printer, X, FileCheck2, Building2 } from 'lucide-react';
import { CARRecord } from '../types/audit';

interface CarPrintModalProps {
  car: CARRecord;
  onClose: () => void;
}

export const CarPrintModal: React.FC<CarPrintModalProps> = ({ car, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-300 my-6 max-h-[95vh] overflow-y-auto">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-slate-700" />
            <span className="font-bold text-slate-900 text-sm">
              ตัวอย่างแบบฟอร์ม CAR สำหรับสั่งพิมพ์ (Print Preview)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์เอกสาร / บันทึก PDF (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Official ISO Document Area */}
        <div className="p-4 sm:p-8 text-black bg-white space-y-6 printable-document">
          {/* Document Header Table */}
          <div className="border-2 border-black">
            <div className="grid grid-cols-12 divide-x-2 divide-black">
              {/* Logo / Company */}
              <div className="col-span-3 p-3 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-lg mb-1">
                  AP
                </div>
                <div className="font-bold text-xs uppercase tracking-tight">AUDITPRO GLOBAL</div>
                <div className="text-[9px] text-slate-500">Quality Management System</div>
              </div>

              {/* Title */}
              <div className="col-span-6 p-3 flex flex-col items-center justify-center text-center">
                <h1 className="font-extrabold text-base uppercase tracking-tight">
                  ใบแจ้งข้อบกพร่องและการปฏิบัติการแก้ไข
                </h1>
                <h2 className="text-xs font-bold uppercase text-slate-700 mt-0.5">
                  CORRECTIVE ACTION REQUEST (CAR)
                </h2>
                <div className="text-[10px] mt-1 text-slate-600">
                  อ้างอิงมาตรฐาน: {car.standard}
                </div>
              </div>

              {/* Form Metadata */}
              <div className="col-span-3 p-2.5 text-[10px] space-y-1">
                <div><strong>แบบฟอร์ม:</strong> CAR-FM-001</div>
                <div><strong>แก้ไขครั้งที่:</strong> Rev. 04</div>
                <div><strong>เลขที่ CAR:</strong> <span className="font-mono font-bold text-xs">{car.carNo}</span></div>
                <div><strong>วันที่ออก:</strong> {car.issuedDate}</div>
              </div>
            </div>
          </div>

          {/* Section 1: Nonconformity Description */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-xs border-b border-black uppercase flex items-center justify-between">
              <span>ส่วนที่ 1: รายละเอียดข้อบกพร่อง (Statement of Nonconformity) - โดยผู้ตรวจประเมิน</span>
              <span className="font-bold underline">ระดับ: {car.severity}</span>
            </div>

            <div className="p-3 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div><strong>แผนกที่รับการตรวจ:</strong> {car.department}</div>
                <div><strong>ข้อกำหนดมาตรฐาน:</strong> {car.standard} ข้อ {car.clause}</div>
                <div><strong>ผู้ตรวจประเมิน (Auditor):</strong> {car.issuedBy}</div>
                <div><strong>กำหนดส่งแผนแก้ไขภายใน:</strong> {car.replyDueDate}</div>
              </div>

              <div className="pt-2">
                <strong>คำชี้แจงข้อบกพร่อง (Statement of Fact):</strong>
                <p className="mt-1 p-2 bg-slate-50 border border-slate-300 rounded leading-relaxed text-[11px]">
                  {car.problemStatement}
                </p>
              </div>

              <div>
                <strong>หลักฐานเชิงประจักษ์ที่ตรวจพบ (Objective Evidence):</strong>
                <p className="mt-1 text-[11px] text-slate-800">
                  {car.objectiveEvidence}
                </p>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px]">
                <div className="text-center w-48">
                  <div className="border-b border-black pb-6"></div>
                  <div className="mt-1 font-bold">({car.issuedBy})</div>
                  <div>ผู้ตรวจประเมิน (Lead Auditor)</div>
                </div>

                <div className="text-center w-48">
                  <div className="border-b border-black pb-6"></div>
                  <div className="mt-1 font-bold">(........................................................)</div>
                  <div>ผู้รับการตรวจ (Auditee Dept Head)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Immediate Containment */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-xs border-b border-black uppercase">
              ส่วนที่ 2: การแก้ไขปัญหาเฉพาะหน้าเร่งด่วน (Immediate Containment Action)
            </div>
            <div className="p-3 text-xs space-y-2">
              <p className="leading-relaxed text-[11px] min-h-[30px]">
                {car.immediateCorrection.action || '(ยังไม่ได้ระบุ)'}
              </p>
              <div className="flex justify-between text-[10px] pt-1 border-t border-slate-200">
                <div><strong>วันที่แก้ไขเสร็จ:</strong> {car.immediateCorrection.completedDate || '-'}</div>
                <div><strong>ผู้รับผิดชอบ:</strong> {car.immediateCorrection.personInCharge || '-'}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Root Cause Analysis (5 Whys) */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-xs border-b border-black uppercase">
              ส่วนที่ 3: การวิเคราะห์สาเหตุที่แท้จริง (Root Cause Analysis - 5 Whys)
            </div>
            <div className="p-3 text-xs space-y-2">
              <div className="space-y-1">
                {car.rootCauseAnalysis.fiveWhys.map((w, idx) => (
                  <div key={idx} className="flex gap-2 text-[11px]">
                    <span className="font-bold w-12 shrink-0">Why #{w.level}:</span>
                    <span className="text-slate-700">{w.question} → <strong>{w.answer || '-'}</strong></span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong>สรุปสาเหตุที่แท้จริง (Root Cause Summary):</strong>
                <p className="mt-0.5 text-[11px] font-medium text-slate-800">
                  {car.rootCauseAnalysis.summary || '(ยังไม่ได้ระบุ)'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Corrective & Preventive Action */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-xs border-b border-black uppercase">
              ส่วนที่ 4: มาตรการแก้ไขและป้องกันการเกิดซ้ำ (Corrective & Preventive Action - CAPA)
            </div>
            <div className="grid grid-cols-2 divide-x divide-black p-3 text-xs">
              <div className="pr-3 space-y-1">
                <strong>1. มาตรการแก้ไขเชิงระบบ (Corrective Action):</strong>
                <p className="text-[11px] min-h-[40px] leading-relaxed">
                  {car.correctiveAction.description || '-'}
                </p>
                <div className="text-[10px] text-slate-600">
                  กำหนดเสร็จ: {car.correctiveAction.dueDate || '-'} | ผู้รับผิดชอบ: {car.correctiveAction.personInCharge || '-'}
                </div>
              </div>

              <div className="pl-3 space-y-1">
                <strong>2. มาตรการป้องกันการเกิดซ้ำและการขยายผล (Preventive Action):</strong>
                <p className="text-[11px] min-h-[40px] leading-relaxed">
                  {car.preventiveAction.description || '-'}
                </p>
                <div className="text-[10px] text-slate-600">
                  กำหนดเสร็จ: {car.preventiveAction.dueDate || '-'} | ผู้รับผิดชอบ: {car.preventiveAction.personInCharge || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Verification & Sign-off for Close CAR */}
          <div className="border border-black">
            <div className="bg-slate-200 px-3 py-1 font-bold text-xs border-b border-black uppercase flex items-center justify-between">
              <span>ส่วนที่ 5: การตรวจติดตามประสิทธิผลและการอนุมัติปิด CAR (Verification & Close CAR)</span>
              <span className="font-bold underline">สถานะ: {car.status}</span>
            </div>
            <div className="p-3 text-xs space-y-3">
              <div>
                <strong>บันทึกหลักฐานการตรวจติดตามประสิทธิผล (Verification Evidence):</strong>
                <p className="mt-1 text-[11px] leading-relaxed">
                  {car.verification.notes || '(อยู่ระหว่างการตรวจติดตาม)'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div>
                  <strong>ผลการตรวจติดตาม:</strong>{' '}
                  <span className="font-bold">
                    {car.verification.result === 'Effective' ? '☑ มีประสิทธิผล อนุมัติปิด CAR' : '☐ ไม่อนุมัติ / อยู่ระหว่างติดตาม'}
                  </span>
                </div>
                <div>
                  <strong>วันที่ปิด CAR:</strong> {car.closedDate || car.verification.verifiedDate || '-'}
                </div>
              </div>

              {/* 3 Signature Blocks */}
              <div className="pt-6 grid grid-cols-3 gap-4 text-center text-[10px]">
                <div>
                  <div className="border-b border-black pb-8"></div>
                  <div className="mt-1 font-bold">({car.verification.auditorName || car.issuedBy})</div>
                  <div>ผู้ตรวจประเมินติดตาม (Auditor)</div>
                </div>

                <div>
                  <div className="border-b border-black pb-8"></div>
                  <div className="mt-1 font-bold">(........................................................)</div>
                  <div>ผู้จัดการแผนกที่รับการตรวจ (Dept Head)</div>
                </div>

                <div>
                  <div className="border-b border-black pb-8"></div>
                  <div className="mt-1 font-bold">(........................................................)</div>
                  <div>ตัวแทนฝ่ายบริหาร / QMR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
