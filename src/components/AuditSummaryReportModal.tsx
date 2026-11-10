import React from 'react';
import { Printer, X, Award, ShieldCheck, AlertTriangle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { AuditPlan, CARRecord, InterviewRecord } from '../types/audit';
import { DEPARTMENTS, STANDARDS_DATA } from '../data/standards';

interface AuditSummaryReportModalProps {
  plans: AuditPlan[];
  interviews: InterviewRecord[];
  cars: CARRecord[];
  onClose: () => void;
}

export const AuditSummaryReportModal: React.FC<AuditSummaryReportModalProps> = ({
  plans,
  interviews,
  cars,
  onClose,
}) => {
  const majorNcCount = interviews.filter((i) => i.findingType === 'Major NC').length;
  const minorNcCount = interviews.filter((i) => i.findingType === 'Minor NC').length;
  const ofiCount = interviews.filter((i) => i.findingType === 'OFI').length;
  const conformCount = interviews.filter((i) => i.findingType === 'Conform').length;

  const totalCars = cars.length;
  const closedCars = cars.filter((c) => c.status === 'Closed').length;
  const pendingCars = cars.filter((c) => c.status !== 'Closed').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-300 my-6 max-h-[95vh] overflow-y-auto">
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-900 text-sm">
              รายงานสรุปผลการตรวจประเมินภายในประจำปี (Audit Executive Report)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รายงาน / บันทึก PDF (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Formal Audit Report */}
        <div className="p-4 sm:p-8 text-black bg-white space-y-6 printable-document">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
                AUDITPRO GLOBAL MANUFACTURING CO., LTD.
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                รายงานสรุปผลการตรวจประเมินภายในระบบการจัดการ (Internal Audit Summary Report)
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                รอบการตรวจประเมินประจำปี 2026 (Internal Audit Cycle 1/2026)
              </p>
            </div>

            <div className="text-right text-xs space-y-0.5">
              <div><strong>รหัสรายงาน:</strong> IAR-2026-CY1</div>
              <div><strong>วันที่จัดทำ:</strong> {new Date().toLocaleDateString('th-TH')}</div>
              <div><strong>มาตรฐาน:</strong> ISO 9001, 14001, 45001, 27001</div>
            </div>
          </div>

          {/* Section 1: Audit Objectives & Scope */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
              1. วัตถุประสงค์และขอบข่ายการตรวจประเมิน (Objectives & Scope)
            </h3>
            <p className="leading-relaxed text-slate-700">
              เพื่อประเมินความสอดคล้องของระบบการจัดการกับข้อกำหนดของมาตรฐานสากล (ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, ISO/IEC 27001:2022) ประเมินประสิทธิผลของการปฏิบัติงานในแต่ละแผนก ชี้บ่งโอกาสในการปรับปรุงกระบวนการ และเตรียมความพร้อมสำหรับการตรวจรับรองจากภายนอก (Certification Body Surveillance Audit)
            </p>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <strong>ระยะเวลาตรวจประเมิน:</strong> ตลอดเดือนพฤศจิกายน 2026
              </div>
              <div>
                <strong>ทีมผู้ตรวจประเมินหลัก:</strong> อัครพล เกียรติสกุล (Lead Auditor), กนกวรรณ จิตต์จำนงค์, วิภาดา รัตนมงคล, พงศกร ธนสิทธิ์
              </div>
            </div>
          </div>

          {/* Section 2: Executive Findings Summary */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
              2. สรุปสถิติผลการตรวจประเมินโดยรวม (Executive Summary Findings)
            </h3>

            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 border border-rose-300 bg-rose-50 rounded-lg">
                <div className="text-rose-700 font-bold text-xs">Major NC (ข้อบกพร่องรุนแรง)</div>
                <div className="text-2xl font-extrabold text-rose-800 mt-1">{majorNcCount}</div>
                <div className="text-[10px] text-rose-600">ต้องออก CAR ทันที</div>
              </div>

              <div className="p-3 border border-amber-300 bg-amber-50 rounded-lg">
                <div className="text-amber-700 font-bold text-xs">Minor NC (ข้อบกพร่องเล็กน้อย)</div>
                <div className="text-2xl font-extrabold text-amber-800 mt-1">{minorNcCount}</div>
                <div className="text-[10px] text-amber-600">ออก CAR แก้ไขใน 14-30 วัน</div>
              </div>

              <div className="p-3 border border-blue-300 bg-blue-50 rounded-lg">
                <div className="text-blue-700 font-bold text-xs">OFI (ข้อเสนอแนะปรับปรุง)</div>
                <div className="text-2xl font-extrabold text-blue-800 mt-1">{ofiCount}</div>
                <div className="text-[10px] text-blue-600">ปรับปรุงตามดุลยพินิจ</div>
              </div>

              <div className="p-3 border border-emerald-300 bg-emerald-50 rounded-lg">
                <div className="text-emerald-700 font-bold text-xs">Conform (สอดคล้องตามเกณฑ์)</div>
                <div className="text-2xl font-extrabold text-emerald-800 mt-1">{conformCount}</div>
                <div className="text-[10px] text-emerald-600">ระบบทำงานได้สมบูรณ์</div>
              </div>
            </div>
          </div>

          {/* Section 3: Department Findings Table */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
              3. ตารางสรุปผลการตรวจแยกรายแผนก (Departmental Breakdown Matrix)
            </h3>
            <table className="w-full text-left border border-slate-300 text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                <tr>
                  <th className="p-2 border-r border-slate-300">แผนก</th>
                  <th className="p-2 text-center border-r border-slate-300">Major NC</th>
                  <th className="p-2 text-center border-r border-slate-300">Minor NC</th>
                  <th className="p-2 text-center border-r border-slate-300">OFI</th>
                  <th className="p-2 text-center border-r border-slate-300">Conform</th>
                  <th className="p-2 text-center border-r border-slate-300">สถานะ CAR</th>
                  <th className="p-2 text-right">การประเมินความเสี่ยง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {DEPARTMENTS.map((dept) => {
                  const deptInterviews = interviews.filter((i) => i.department === dept);
                  if (deptInterviews.length === 0) return null;

                  const maj = deptInterviews.filter((i) => i.findingType === 'Major NC').length;
                  const min = deptInterviews.filter((i) => i.findingType === 'Minor NC').length;
                  const ofi = deptInterviews.filter((i) => i.findingType === 'OFI').length;
                  const con = deptInterviews.filter((i) => i.findingType === 'Conform').length;
                  const deptCars = cars.filter((c) => c.department === dept);

                  return (
                    <tr key={dept}>
                      <td className="p-2 font-bold border-r border-slate-200">{dept}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold text-rose-700">{maj}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold text-amber-700">{min}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold text-blue-700">{ofi}</td>
                      <td className="p-2 text-center border-r border-slate-200 font-bold text-emerald-700">{con}</td>
                      <td className="p-2 text-center border-r border-slate-200">
                        {deptCars.length > 0 ? (
                          <span>ออกแล้ว {deptCars.length} (ปิด {deptCars.filter((c) => c.status === 'Closed').length})</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="p-2 text-right font-semibold">
                        {maj > 0 ? 'ความเสี่ยงสูง (High)' : min > 0 ? 'ปานกลาง (Medium)' : 'ต่ำ (Low)'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Section 4: Detailed CAR Register */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
              4. รายการใบแจ้งการปฏิบัติการแก้ไข (CAR Register)
            </h3>
            <table className="w-full text-left border border-slate-300 text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                <tr>
                  <th className="p-2 border-r border-slate-300">เลขที่ CAR</th>
                  <th className="p-2 border-r border-slate-300">แผนก</th>
                  <th className="p-2 border-r border-slate-300">ข้อกำหนด</th>
                  <th className="p-2 border-r border-slate-300">ระดับ</th>
                  <th className="p-2 border-r border-slate-300">ประเด็นข้อบกพร่อง</th>
                  <th className="p-2 text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cars.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2 font-mono font-bold border-r border-slate-200">{c.carNo}</td>
                    <td className="p-2 border-r border-slate-200 font-medium">{c.department}</td>
                    <td className="p-2 border-r border-slate-200">{c.clause}</td>
                    <td className="p-2 border-r border-slate-200 font-bold">
                      <span className={c.severity === 'Major NC' ? 'text-rose-700' : 'text-amber-700'}>
                        {c.severity}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 max-w-xs truncate">{c.problemStatement}</td>
                    <td className="p-2 text-right font-bold">
                      {c.status === 'Closed' ? (
                        <span className="text-emerald-700">ปิดแล้ว (Closed)</span>
                      ) : (
                        <span className="text-rose-600">{c.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 5: Conclusion & Management Signatures */}
          <div className="space-y-4 pt-2 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
              5. ข้อเสนอแนะสำหรับการประชุมทบทวนฝ่ายบริหาร (MRM Recommendations)
            </h3>
            <p className="leading-relaxed text-slate-700">
              โดยภาพรวมระบบการจัดการยังคงรักษาสภาพความสอดคล้องได้ดี อย่างไรก็ตาม ขอเน้นย้ำให้ฝ่ายผลิตเร่งรัดการจัดทำระบบแจ้งเตือนการสอบเทียบเครื่องมือวัดล่วงหน้า และให้ทุกฝ่ายร่วมกันนำมาตรการป้องกันการเกิดซ้ำ (Preventive Action) ไปขยายผลเพื่อเตรียมความพร้อมสู่การตรวจประเมินภายนอกต่อไป
            </p>

            <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <div className="border-b border-black pb-8"></div>
                <div className="mt-1 font-bold">(นายอัครพล เกียรติสกุล)</div>
                <div>หัวหน้าคณะผู้ตรวจประเมินภายใน (Lead Auditor)</div>
              </div>

              <div>
                <div className="border-b border-black pb-8"></div>
                <div className="mt-1 font-bold">(...........................................................)</div>
                <div>ตัวแทนฝ่ายบริหารด้านระบบคุณภาพ (QMR / Management Representative)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
