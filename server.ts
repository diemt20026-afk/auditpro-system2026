import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for timeout-safe Gemini calls
async function callGeminiWithTimeout<T>(
  promiseFn: () => Promise<T>,
  timeoutMs: number = 3500
): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI request timeout')), timeoutMs);
  });
  try {
    const result = await Promise.race([promiseFn(), timeoutPromise]);
    clearTimeout(timer);
    return result;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// API: Check health and AI capability
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// API 1: Generate Audit Checklist Questions for a Standard Clause & Department
app.post('/api/audit/generate-questions', async (req, res) => {
  try {
    const { standard, clause, clauseTitle, department, processName, focusArea } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Provide robust realistic ISO auditor questions fallback
      return res.json({
        questions: [
          {
            question: `ฝ่าย ${department || 'ที่รับการตรวจ'} มีระเบียบปฏิบัติและขั้นตอนการทำงานตามข้อกำหนด ${clause || ''} (${clauseTitle || ''}) อย่างไร และมีการสื่อสารให้ผู้ปฏิบัติงานทราบอย่างไร?`,
            objectiveEvidence: 'เอกสารระเบียบปฏิบัติ (SOP / WI), แผนผังกระบวนการ (Process Flow), ทะเบียนประวัติการอบรมของผู้ปฏิบัติงาน',
            sampleGuideline: 'สุ่มตรวจผู้ปฏิบัติงาน 2-3 คน และสุ่มสอบถามความเข้าใจในขั้นตอนการทำงานที่เกี่ยวข้อง',
            clauseReference: `${standard || 'ISO 9001:2015'} ข้อ ${clause || ''} ${clauseTitle || ''}`,
            potentialRisk: 'เอกสารหมดอายุ ไม่อัปเดต หรือผู้ปฏิบัติงานไม่ได้รับทราบนโยบาย/ขั้นตอนล่าสุด',
          },
          {
            question: `มีการติดตาม ตรวจวัด และบันทึกผลการดำเนินงานในกระบวนการ ${processName || 'หลัก'} อย่างไร และเมื่อเกิดความผิดปกติมีแนวทางแก้ไขอย่างไร?`,
            objectiveEvidence: 'บันทึกการตรวจสอบคุณภาพ/ผลผลิต (Daily Log / Inspection Report), แผนภูมิควบคุม หรือใบบันทึกผลย้อนหลัง 3 เดือน',
            sampleGuideline: 'สุ่มตัวอย่างบันทึกผลการดำเนินงาน 3-5 รายการจากช่วง 1-2 เดือนที่ผ่านมา',
            clauseReference: `${standard || 'ISO 9001:2015'} ข้อ ${clause || ''} ${clauseTitle || ''}`,
            potentialRisk: 'ไม่มีการบันทึกข้อมูลตามความจริง หรือเมื่อพบค่าหลุดเกณฑ์ไม่มีการดำเนินการแก้ไข',
          },
          {
            question: `ในการดำเนินงาน มีการประเมินความเสี่ยงและโอกาสที่อาจส่งผลกระทบต่อคุณภาพ/ข้อกำหนดหรือไม่ และมีมาตรการจัดการอย่างไร?`,
            objectiveEvidence: 'ตารางประเมินความเสี่ยง (Risk Register / FMEA), แผนบรรเทาความเสี่ยง (Mitigation Plan)',
            sampleGuideline: 'สุ่มตรวจความเสี่ยงระดับสูง 2 ข้อ และติดตามดูประสิทธิผลของมาตรการควบคุม',
            clauseReference: `${standard || 'ISO 9001:2015'} ข้อ ${clause || ''} ${clauseTitle || ''}`,
            potentialRisk: 'ไม่ได้ทบทวนความเสี่ยงเป็นประจำ หรือมาตรการไม่ได้ถูกนำไปปฏิบัติจริงในหน้างาน',
          },
        ],
        source: 'preset',
      });
    }

    const prompt = `คุณคือผู้เชี่ยวชาญการตรวจประเมินภายในระดับ Lead Auditor (IRCA Certified / IATF Lead Auditor)
กรุณาสร้างคำถามสำหรับใช้ในการตรวจประเมินภายใน (Internal Audit Checklist) สำหรับ:
- มาตรฐาน: ${standard || 'ISO 9001:2015'}
- ข้อกำหนด: ข้อ ${clause || ''} ${clauseTitle || ''}
- แผนกที่รับการตรวจ: ${department || 'ฝ่ายที่เกี่ยวข้อง'}
- กระบวนการ/กิจกรรม: ${processName || 'กิจกรรมหลัก'}
- จุดเน้นพิเศษ: ${focusArea || 'ความสอดคล้องตามข้อกำหนดและประสิทธิผลของระบบ'}

คำแนะนำเฉพาะด้าน:
- หากเป็นมาตรฐาน IATF 16949 และแผนกจัดซื้อ: คำถามต้องเจาะลึกกระบวนการคัดเลือกผู้ส่งมอบ (8.4.1.2), การประเมินความเสี่ยง, ชิ้นส่วนที่ลูกค้ากำหนด (8.4.1.3 Directed Buy), การพัฒนา QMS สู่ IATF 16949 (8.4.2.3), การติดตาม PPM / Premium freight / Customer disruptions (8.4.2.4), การตรวจประเมินบุคคลที่สอง Second-party audit (8.4.2.4.1), และการส่งต่อข้อกำหนดเฉพาะของลูกค้า (CSR) ใน PO (8.4.3.1)
- หากเป็นมาตรฐาน IATF 16949 และฝ่ายผลิต: คำถามต้องเจาะลึก Control Plan (8.5.1.1), Reaction plan, First-piece check (8.5.1.3), TPM (8.5.1.5), การสอบกลับได้ Traceability (8.5.2.1), และการจัดการการเปลี่ยนแปลง 4M (8.5.6.1)

ให้สร้างคำถามที่เจาะลึก 3-5 ข้อ เป็นภาษาไทย ที่ผู้ตรวจประเมินสามารถนำไปใช้สัมภาษณ์ได้จริง พร้อมระบุหลักฐานเชิงประจักษ์ที่ต้องขอดู (Objective Evidence) วิธีการสุ่มตัวอย่าง (Sampling Method) และความเสี่ยงหรือจุดบกพร่องที่พบบ่อย`;

    const response = await callGeminiWithTimeout(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING, description: 'คำถามสัมภาษณ์หลักที่ชัดเจน' },
                    objectiveEvidence: { type: Type.STRING, description: 'หลักฐานเชิงประจักษ์ เอกสาร บันทึก หรือการสังเกตที่ต้องขอดู' },
                    sampleGuideline: { type: Type.STRING, description: 'แนวทางการสุ่มตรวจ เช่น จำนวนตัวอย่าง เกณฑ์คัดเลือก' },
                    clauseReference: { type: Type.STRING, description: 'รหัสและชื่อข้อกำหนดที่เกี่ยวข้อง' },
                    potentialRisk: { type: Type.STRING, description: 'ข้อบกพร่องหรือความเสี่ยงที่มักพบในข้อนี้' },
                  },
                  required: ['question', 'objectiveEvidence', 'sampleGuideline', 'clauseReference', 'potentialRisk'],
                },
              },
            },
            required: ['questions'],
          },
        },
      }),
      3500
    );

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    return res.json({
      questions: parsed.questions || [],
      source: 'gemini',
    });
  } catch (error: any) {
    console.warn('Gemini generate-questions fallback activated:', error?.message);
    const { standard, clause, clauseTitle, department, processName } = req.body;
    return res.json({
      questions: [
        {
          question: `ฝ่าย ${department || 'ที่รับการตรวจ'} มีขั้นตอนการปฏิบัติงานตามข้อกำหนด ${clause || ''} (${clauseTitle || ''}) อย่างไร และมีการสื่อสารให้ผู้ปฏิบัติงานทราบอย่างไร?`,
          objectiveEvidence: 'ระเบียบปฏิบัติ (SOP / WI), Process Flow Chart, บันทึกประวัติการฝึกอบรม',
          sampleGuideline: 'สุ่มตรวจผู้ปฏิบัติงาน 2-3 คน และสอบถามขั้นตอนการทำงานที่เกี่ยวข้อง',
          clauseReference: `${standard || 'มาตรฐาน'} ข้อ ${clause || ''} ${clauseTitle || ''}`,
          potentialRisk: 'เอกสารหมดอายุ หรือผู้ปฏิบัติงานไม่ได้รับทราบขั้นตอนการปฏิบัติงานฉบับล่าสุด',
        },
        {
          question: `มีการติดตาม ตรวจวัด และบันทึกผลการดำเนินงานในกระบวนการ ${processName || 'หลัก'} เพื่อพิสูจน์ความสอดคล้องตามข้อกำหนดอย่างไร?`,
          objectiveEvidence: 'บันทึกการตรวจสอบคุณภาพ/ผลผลิต (Daily Inspection Report / Checksheet)',
          sampleGuideline: 'สุ่มตัวอย่างบันทึกผลการดำเนินงานย้อนหลัง 3 เดือน',
          clauseReference: `${standard || 'มาตรฐาน'} ข้อ ${clause || ''} ${clauseTitle || ''}`,
          potentialRisk: 'ไม่มีการบันทึกข้อมูลตามความเป็นจริง หรือเมื่อพบค่าหลุดเกณฑ์ไม่มีการดำเนินการแก้ไข',
        },
        {
          question: `เมื่อเกิดความผิดปกติหรือปัญหาในกระบวนการ มีกระบวนการแจ้งเตือน กักกัน และดำเนินการแก้ไขเฉพาะหน้าอย่างไร?`,
          objectiveEvidence: 'บันทึกรายงานสิ่งที่ไม่เป็นไปตามข้อกำหนด (NCR), ใบกักกันของเสีย/ชิ้นงานสงสัย (Hold Tag)',
          sampleGuideline: 'สุ่มตรวจประวัติการออก NCR และตรวจสอบสถานะการกักกันชิ้นงาน',
          clauseReference: `${standard || 'มาตรฐาน'} ข้อ ${clause || ''} ${clauseTitle || ''}`,
          potentialRisk: 'ไม่มีการกักกันชิ้นงานสงสัยทันที หรือส่งมอบชิ้นงานที่ยังไม่ได้รับการอนุมัติ',
        },
      ],
      source: 'preset-fallback',
    });
  }
});

// API 1.5: Generate Comprehensive Audit Checklist for an entire Department
app.post('/api/audit/generate-department-checklist', async (req, res) => {
  try {
    const { standard, department, clauses } = req.body;

    const clauseListStr = Array.isArray(clauses)
      ? clauses.map((c: any) => typeof c === 'string' ? c : `${c.clause} (${c.title})`).join(', ')
      : 'ข้อกำหนดทั้งหมดของแผนก';

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        checklistTitle: `โปรแกรมการตรวจประเมินฝ่าย ${department} ตามมาตรฐาน ${standard}`,
        summary: `ชุดคำถามตรวจประเมินครอบคลุมข้อกำหนดหลักของฝ่าย ${department}`,
        questions: [
          {
            clause: '8.4.1.2',
            clauseTitle: 'กระบวนการคัดเลือกผู้ส่งมอบ',
            question: `ฝ่าย ${department} มีกระบวนการคัดเลือกและประเมินความเสี่ยงของผู้ส่งมอบรายใหม่อย่างไร รวมถึงการประเมินใบรับรอง QMS และความสามารถด้านซอฟต์แวร์?`,
            objectiveEvidence: 'ทะเบียน AVL, แบบฟอร์มประเมินผู้ส่งมอบรายใหม่, ใบรับรอง ISO 9001/IATF 16949 ของผู้ขาย',
            sampleGuideline: 'สุ่มตรวจแฟ้มผู้ส่งมอบรายใหม่ที่เพิ่มขึ้นในรอบ 12 เดือนล่าสุด 2-3 ราย',
            clauseReference: `${standard} ข้อ 8.4.1.2`,
            potentialRisk: 'ไม่มีการประเมินความเสี่ยง หรือรับผู้ส่งมอบเข้า AVL โดยไม่มีใบรับรองระบบคุณภาพ',
          },
          {
            clause: '8.4.2.4',
            clauseTitle: 'การติดตามผลการดำเนินงานของผู้ส่งมอบ',
            question: `มีระบบติดตามตัวชี้วัด PPM ด้านคุณภาพ, การส่งมอบตรงเวลา (On-time delivery), และค่าขนส่งด่วนพิเศษ (Premium freight) ของผู้ส่งมอบอย่างไร?`,
            objectiveEvidence: 'รายงานสรุป KPI ผู้ส่งมอบประจำเดือน, บันทึกการส่งมอบล่าช้า, รายงานการประชุมทบทวนผลงานผู้ขาย',
            sampleGuideline: 'สุ่มตรวจรายงานคะแนนประเมินผู้ส่งมอบประจำเดือนย้อนหลัง 3 เดือน',
            clauseReference: `${standard} ข้อ 8.4.2.4`,
            potentialRisk: 'ไม่มีการติดตามค่า PPM จริง หรือไม่ดำเนินการใดๆ เมื่อผู้ส่งมอบมีผลงานตกเกณฑ์',
          },
          {
            clause: '8.4.3.1',
            clauseTitle: 'ข้อมูลสำหรับผู้จัดหาภายนอกและการส่งต่อ CSR',
            question: `มีการส่งต่อข้อกำหนดเฉพาะของลูกค้า (CSR) และข้อกำหนดลักษณะเฉพาะพิเศษ (Special Characteristics) ไปยังผู้ส่งมอบในใบสั่งซื้อ (PO) อย่างไร?`,
            objectiveEvidence: 'ใบสั่งซื้อ (PO), เอกสารแนบท้ายสัญญาจัดซื้อ (Purchasing Agreement / Quality Agreement)',
            sampleGuideline: 'สุ่มตรวจใบสั่งซื้อ 5 ฉบับที่มีข้อกำหนดชิ้นส่วนวิกฤต',
            clauseReference: `${standard} ข้อ 8.4.3.1`,
            potentialRisk: 'ใบสั่งซื้อไม่มีการระบุข้อกำหนดทางเทคนิคหรือมาตรฐาน CSR ของลูกค้า',
          },
        ],
        source: 'preset',
      });
    }

    const prompt = `คุณคือ Lead Auditor ผู้เชี่ยวชาญการตรวจประเมินระบบการจัดการระดับสากล
กรุณาสร้างชุดคำถามตรวจประเมินภายในที่ครอบคลุมครบถ้วน (Comprehensive Departmental Internal Audit Program) สำหรับ:
- แผนกที่รับการตรวจ: ${department}
- มาตรฐาน: ${standard}
- รายการข้อกำหนดที่ต้องครอบคลุม: ${clauseListStr}

ข้อกำหนดและเป้าหมาย:
1. การตรวจต้องครอบคลุมข้อกำหนดของแผนกนี้ให้ครบทุกมิติสำคัญ
2. หากเป็นมาตรฐานยานยนต์ IATF 16949 แผนกจัดซื้อ ต้องครอบคลุม Supplier selection, Directed-buy, Risk analysis, Supplier QMS development, Software capability, Monitoring PPM & disruptions & premium freight, Second-party audits, และ Flowdown of Customer-Specific Requirements (CSR)
3. ให้สร้างคำถามที่ครอบคลุม 4-7 ข้อ โดยแต่ละข้อระบุข้อกำหนดที่อ้างอิงชัดเจน (clause, clauseTitle), คำถามสัมภาษณ์เชิงรุก (question), หลักฐานเชิงประจักษ์ที่ต้องขอดู (objectiveEvidence), แนวทางการสุ่มตรวจ (sampleGuideline), และจุดเสี่ยงข้อบกพร่อง (potentialRisk)`;

    const response = await callGeminiWithTimeout(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              checklistTitle: { type: Type.STRING, description: 'ชื่อชุดคำถามตรวจประเมินแผนก' },
              summary: { type: Type.STRING, description: 'สรุปภาพรวมขอบข่ายการตรวจของแผนกนี้' },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    clause: { type: Type.STRING, description: 'เลขข้อกำหนด เช่น 8.4.1.2' },
                    clauseTitle: { type: Type.STRING, description: 'ชื่อข้อกำหนด' },
                    question: { type: Type.STRING, description: 'คำถามสัมภาษณ์หลัก' },
                    objectiveEvidence: { type: Type.STRING, description: 'หลักฐานเชิงประจักษ์ที่ต้องขอดู' },
                    sampleGuideline: { type: Type.STRING, description: 'แนวทางการสุ่มตรวจ' },
                    clauseReference: { type: Type.STRING, description: 'รหัสมาตรฐานและข้อกำหนด' },
                    potentialRisk: { type: Type.STRING, description: 'ความเสี่ยงหรือจุดบกพร่องที่พบบ่อย' },
                  },
                  required: ['clause', 'clauseTitle', 'question', 'objectiveEvidence', 'sampleGuideline', 'clauseReference', 'potentialRisk'],
                },
              },
            },
            required: ['checklistTitle', 'summary', 'questions'],
          },
        },
      }),
      3500
    );

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    return res.json({
      ...parsed,
      source: 'gemini',
    });
  } catch (error: any) {
    console.warn('Gemini department checklist fallback activated:', error?.message);
    const { standard, department } = req.body;
    return res.json({
      checklistTitle: `โปรแกรมการตรวจประเมินฝ่าย ${department || ''} ตามมาตรฐาน ${standard || ''}`,
      summary: `ชุดคำถามตรวจประเมินครอบคลุมภารกิจหลักและการควบคุมกระบวนการของฝ่าย ${department || ''}`,
      questions: [
        {
          clause: '8.4.1.2',
          clauseTitle: 'กระบวนการคัดเลือกและประเมินผู้ส่งมอบ',
          question: `มีเกณฑ์และกระบวนการประเมินคัดเลือกผู้ส่งมอบรายใหม่อย่างไร มีการประเมินความเสี่ยงและกำหนดใน Approved Vendor List (AVL) หรือไม่?`,
          objectiveEvidence: 'ทะเบียนรายชื่อผู้ส่งมอบที่ได้รับอนุมัติ (AVL), บันทึกการประเมิน Supplier Selection, เกณฑ์การคัดเลือก',
          sampleGuideline: 'สุ่มตรวจผู้ส่งมอบรายใหม่ 2 รายที่เริ่มจัดซื้อในปีที่ผ่านมา',
          clauseReference: `${standard || 'IATF 16949'} ข้อ 8.4.1.2`,
          potentialRisk: 'สั่งซื้อจากผู้ส่งมอบที่ไม่ได้อยู่ใน AVL หรือไม่มีบันทึกการประเมินคัดเลือกก่อนสั่งซื้อ',
        },
        {
          clause: '8.4.2.4',
          clauseTitle: 'การติดตามผลการดำเนินงานของผู้ส่งมอบ',
          question: `มีระบบติดตามตัวชี้วัด PPM ด้านคุณภาพ, การส่งมอบตรงเวลา (On-time delivery), และค่าขนส่งด่วนพิเศษ (Premium freight) ของผู้ส่งมอบอย่างไร?`,
          objectiveEvidence: 'รายงานสรุป KPI ผู้ส่งมอบประจำเดือน, บันทึกการส่งมอบล่าช้า, รายงานการประชุมทบทวนผลงานผู้ขาย',
          sampleGuideline: 'สุ่มตรวจรายงานคะแนนประเมินผู้ส่งมอบประจำเดือนย้อนหลัง 3 เดือน',
          clauseReference: `${standard || 'IATF 16949'} ข้อ 8.4.2.4`,
          potentialRisk: 'ไม่มีการติดตามค่า PPM จริง หรือไม่ดำเนินการใดๆ เมื่อผู้ส่งมอบมีผลงานตกเกณฑ์',
        },
        {
          clause: '8.4.3.1',
          clauseTitle: 'ข้อมูลสำหรับผู้จัดหาภายนอกและการส่งต่อ CSR',
          question: `มีการส่งต่อข้อกำหนดเฉพาะของลูกค้า (CSR) และข้อกำหนดลักษณะเฉพาะพิเศษ (Special Characteristics) ไปยังผู้ส่งมอบในใบสั่งซื้อ (PO) อย่างไร?`,
          objectiveEvidence: 'ใบสั่งซื้อ (PO), เอกสารแนบท้ายสัญญาจัดซื้อ (Purchasing Agreement / Quality Agreement)',
          sampleGuideline: 'สุ่มตรวจใบสั่งซื้อ 5 ฉบับที่มีข้อกำหนดชิ้นส่วนวิกฤต',
          clauseReference: `${standard || 'IATF 16949'} ข้อ 8.4.3.1`,
          potentialRisk: 'ใบสั่งซื้อไม่มีการระบุข้อกำหนดทางเทคนิคหรือมาตรฐาน CSR ของลูกค้า',
        },
      ],
      source: 'preset-fallback',
    });
  }
});

// Helper: Rule-based Smart Audit Finding Analyzer (ISO 19011 Heuristic)
function buildSmartAuditFinding(
  standard: string,
  clause: string,
  department: string,
  interviewee: string,
  interviewNotes: string,
  evidenceObserved: string,
  _processName?: string
) {
  const combinedText = `${interviewNotes || ''} ${evidenceObserved || ''}`.toLowerCase();

  const isConform =
    (combinedText.includes('ถูกต้อง') ||
      combinedText.includes('ครบถ้วน') ||
      combinedText.includes('สอดคล้อง') ||
      combinedText.includes('ผ่านเกณฑ์') ||
      combinedText.includes('สมบูรณ์') ||
      combinedText.includes('100%')) &&
    !combinedText.includes('ไม่สอดคล้อง') &&
    !combinedText.includes('ไม่พบ') &&
    !combinedText.includes('หมดอายุ') &&
    !combinedText.includes('ชำรุด') &&
    !combinedText.includes('ไม่มี');

  const isOFI =
    !isConform &&
    (combinedText.includes('ข้อเสนอแนะ') ||
      combinedText.includes('ปรับปรุง') ||
      combinedText.includes('ควรพิจารณา') ||
      combinedText.includes('iot') ||
      combinedText.includes('เพิ่มประสิทธิภาพ') ||
      combinedText.includes('โอกาส'));

  const isMajor =
    !isConform &&
    !isOFI &&
    (combinedText.includes('หมดอายุ') ||
      combinedText.includes('ไม่สอบเทียบ') ||
      combinedText.includes('เกินกว่า 3 เดือน') ||
      combinedText.includes('หลายเครื่อง') ||
      combinedText.includes('หลายตัว') ||
      combinedText.includes('วิกฤต') ||
      combinedText.includes('กฎหมาย') ||
      combinedText.includes('สารเคมีรั่ว') ||
      combinedText.includes('ลูกค้าเคลม') ||
      combinedText.includes('ขาดขั้นตอนโดยสิ้นเชิง') ||
      combinedText.includes('ไม่มี wi') ||
      combinedText.includes('ไม่มี avl'));

  let findingType: 'Major NC' | 'Minor NC' | 'OFI' | 'Conform' = 'Minor NC';
  let riskLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  let severityRationale = '';
  let immediateCorrection = '';
  let rootCauseGuidance = '';

  if (isConform) {
    findingType = 'Conform';
    riskLevel = 'Low';
    severityRationale = 'หลักฐานเชิงประจักษ์สอดคล้องตามข้อกำหนดของมาตรฐาน ไม่พบข้อบกพร่องในการปฏิบัติงาน (ISO 19011 Conforming)';
    immediateCorrection = '-';
    rootCauseGuidance = '-';
  } else if (isOFI) {
    findingType = 'OFI';
    riskLevel = 'Low';
    severityRationale = 'การปฏิบัติงานสอดคล้องตามเกณฑ์ขั้นต่ำ แต่พบโอกาสในการปรับปรุงกระบวนการให้มีประสิทธิภาพและรัดกุมยิ่งขึ้น (ISO 19011 OFI)';
    immediateCorrection = 'จัดทำข้อเสนอแนะแนวทางพัฒนาเพื่อนำเสนอในที่ประชุมทบทวนฝ่ายบริหาร (MRM)';
    rootCauseGuidance = 'ศึกษาเทคโนโลยีระบบอัตโนมัติหรือการนำดิจิทัลมาปรับปรุงลดความผิดพลาดจากคน';
  } else if (isMajor) {
    findingType = 'Major NC';
    riskLevel = 'High';
    severityRationale = 'เป็นข้อบกพร่องรุนแรง (Major NC) ตามเกณฑ์ ISO 19011 เนื่องจากส่งผลกระทบโดยตรงต่อคุณภาพผลิตภัณฑ์ ความปลอดภัย หรือเป็นความล้มเหลวเชิงระบบที่อาจส่งมอบสินค้าไม่ได้มาตรฐานให้ลูกค้า';
    immediateCorrection = 'กักกันผลิตภัณฑ์/กระบวนการที่เกี่ยวข้องทันที ระงับการใช้งานเครื่องมือที่ไม่ได้มาตรฐาน และออกคำสั่งกักกันย้อนหลัง';
    rootCauseGuidance = 'วิเคราะห์ 5 Whys มุ่งเน้นไปที่ระบบแจ้งเตือนอัตโนมัติ การควบคุมการเปลี่ยนแปลง และการกำกับดูแลของฝ่ายบริหาร';
  } else {
    findingType = 'Minor NC';
    riskLevel = 'Medium';
    severityRationale = 'เป็นข้อบกพร่องเล็กน้อย (Minor NC) ตามเกณฑ์ ISO 19011 เนื่องจากเป็นข้อผิดพลาดเฉพาะจุด (Isolated case) ที่ระบบโดยรวมยังสามารถควบคุมได้และยังไม่ส่งผลกระทบวิกฤต';
    immediateCorrection = 'แก้ไขข้อผิดพลาดเฉพาะจุดทันที บันทึกข้อมูลที่ตกหล่นให้ครบถ้วน และทบทวนเอกสารย้อนหลัง';
    rootCauseGuidance = 'ตรวจสอบขั้นตอนการบันทึก การฝึกอบรมทบทวน และการตรวจสอบประจำวัน (Checklist) ก่อนเริ่มงาน';
  }

  const clauseRef = `${standard || 'มาตรฐาน'} ข้อ ${clause || '8.5'}`;
  const findingDescription = isConform
    ? `จากการสุ่มตรวจหลักฐานและสัมภาษณ์ ${interviewee || 'ผู้รับการตรวจ'} แผนก ${department || ''} พบว่ามีการปฏิบัติตามขั้นตอนอย่างถูกต้องและมีบันทึกครบถ้วน`
    : `จากการสุ่มตรวจหลักฐานเชิงประจักษ์ ณ แผนก ${department || ''} พบว่า ${evidenceObserved || interviewNotes || 'มีการปฏิบัติไม่เป็นไปตามระเบียบขั้นตอนที่กำหนด'}`;

  return {
    findingType,
    clauseReference: clauseRef,
    clauseRequirementSummary: `ข้อกำหนด ${clause || ''} ระบุให้องค์กรจัดทำ ควบคุม และจัดเก็บบันทึกหลักฐานที่แสดงถึงความสอดคล้องและประสิทธิผลของกระบวนการ`,
    findingDescription,
    objectiveEvidence: evidenceObserved || 'บันทึกการสัมภาษณ์และเอกสารหน้างาน',
    severityRationale,
    riskLevel,
    immediateCorrection,
    rootCauseGuidance,
  };
}

// API 2: Analyze Audit Interview & Evidence -> Classify Major NC / Minor NC / OFI / Conform
app.post('/api/audit/analyze-interview', async (req, res) => {
  const {
    standard,
    clause,
    department,
    interviewee,
    interviewNotes,
    evidenceObserved,
    processName,
  } = req.body;

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `คุณคือ Lead Auditor ผู้เชี่ยวชาญการประเมินระบบการจัดการตามมาตรฐานสากล (ISO 9001, ISO 14001, ISO 45001, ISO 27001, GHPs/HACCP, IATF 16949) ตามแนวทาง ISO 19011
โปรดวิเคราะห์บันทึกการสัมภาษณ์และหลักฐานเชิงประจักษ์ต่อไปนี้ เพื่อประเมินผลการตรวจ:

[ข้อมูลการตรวจ]
- มาตรฐาน: ${standard || 'ISO 9001:2015'}
- ข้อกำหนดเป้าหมาย: ${clause || 'ตามการดำเนินงาน'}
- แผนก: ${department || 'ไม่ระบุ'}
- ผู้ให้สัมภาษณ์: ${interviewee || 'ผู้รับการตรวจ'}
- กระบวนการ: ${processName || 'กระบวนการทั่วไป'}
- บันทึกการสัมภาษณ์: ${interviewNotes || '-'}
- หลักฐานเชิงประจักษ์ที่ตรวจพบ (Objective Evidence): ${evidenceObserved || '-'}

[เกณฑ์การตัดสินตาม ISO 19011]
1. Major NC (ข้อบกพร่องรุนแรง): ขาดขั้นตอนการปฏิบัติงานที่จำเป็นโดยสิ้นเชิง, ไม่ปฏิบัติตามข้อกำหนดทางกฎหมายหรือความปลอดภัย, เกิดข้อผิดพลาดส่งผลให้สินค้าไม่ได้มาตรฐานหลุดไปถึงลูกค้า, หรือพบ Minor NC ซ้ำซากโดยไม่ได้รับการแก้ไข
2. Minor NC (ข้อบกพร่องเล็กน้อย): การผิดพลาดเฉพาะจุด (Isolated case), การลงบันทึกไม่ครบเป็นบางครั้ง โดยระบบโดยรวมยังดำเนินการได้และไม่ส่งผลกระทบขั้นวิกฤต
3. OFI (Opportunity for Improvement / ข้อสังเกตเพื่อการปรับปรุง): ปฏิบัติตรงตามข้อกำหนดขั้นต่ำแล้ว แต่พบจุดที่อาจเสี่ยงหรือสามารถปรับปรุงให้มีประสิทธิภาพ/รัดกุมยิ่งขึ้นได้
4. Conform (สอดคล้อง): ปฏิบัติตรงตามข้อกำหนด มีเอกสารบันทึกและหลักฐานครบถ้วนชัดเจน

กรุณาสรุปผลเป็นภาษาไทย โดยให้ Statement of Finding เขียนในลักษณะ Statement of Fact ที่เป็นกลางและอ้างอิงหลักฐานเชิงประจักษ์ชัดเจน`;

      const response = await callGeminiWithTimeout(() =>
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                findingType: {
                  type: Type.STRING,
                  description: 'ต้องเป็นค่าใดค่าหนึ่งในนี้เท่านั้น: Major NC, Minor NC, OFI, Conform',
                },
                clauseReference: {
                  type: Type.STRING,
                  description: 'ระบุมาตรฐานและข้อกำหนดที่ผิดพลาด เช่น ISO 9001:2015 ข้อ 8.5.1 หรือข้อกำหนดที่เกี่ยวข้อง',
                },
                clauseRequirementSummary: {
                  type: Type.STRING,
                  description: 'สรุปใจความสำคัญของข้อกำหนดที่เกี่ยวข้องสั้นๆ',
                },
                findingDescription: {
                  type: Type.STRING,
                  description: 'Statement of Nonconformity เขียนตามหลัก Statement of Fact ระบุว่าพบอะไร ที่ไหน อย่างไร',
                },
                objectiveEvidence: {
                  type: Type.STRING,
                  description: 'หลักฐานเชิงประจักษ์ที่เป็นข้อเท็จจริง เช่น รหัสเอกสาร วันที่ เลขที่อ้างอิง',
                },
                severityRationale: {
                  type: Type.STRING,
                  description: 'เหตุผลสนับสนุนการจัดระดับความรุนแรงตามเกณฑ์ ISO 19011',
                },
                riskLevel: {
                  type: Type.STRING,
                  description: 'ระดับความเสี่ยง: High, Medium, Low',
                },
                immediateCorrection: {
                  type: Type.STRING,
                  description: 'ข้อเสนอแนะสำหรับการแก้ไขเร่งด่วนเบื้องต้น (Containment Action)',
                },
                rootCauseGuidance: {
                  type: Type.STRING,
                  description: 'คำแนะนำเบื้องต้นสำหรับการหาสาเหตุที่แท้จริง (5 Whys / Fishbone)',
                },
              },
              required: [
                'findingType',
                'clauseReference',
                'clauseRequirementSummary',
                'findingDescription',
                'objectiveEvidence',
                'severityRationale',
                'riskLevel',
                'immediateCorrection',
                'rootCauseGuidance',
              ],
            },
          },
        }),
        3500
      );

      const parsed = JSON.parse(response.text || '{}');
      if (parsed && parsed.findingType) {
        return res.json({
          ...parsed,
          source: 'gemini',
        });
      }
    }
  } catch (error: any) {
    console.warn('Gemini API analysis failed or timed out, using smart rule-based fallback:', error?.message);
  }

  // Guaranteed fallback that never crashes with 500
  const fallbackFinding = buildSmartAuditFinding(
    standard,
    clause,
    department,
    interviewee,
    interviewNotes,
    evidenceObserved,
    processName
  );

  return res.json({
    ...fallbackFinding,
    source: 'smart-analyzer',
  });
});

// API 3: Suggest Root Cause (5 Whys) & CAPA plan for CAR issuance
app.post('/api/audit/suggest-car-plan', async (req, res) => {
  try {
    const { findingDescription, objectiveEvidence, clauseReference, department } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        fiveWhys: [
          { level: 1, question: 'ทำไมจึงเกิดข้อผิดพลาดนี้ในหน้างาน?', answer: 'ผู้ปฏิบัติงานไม่ได้ตรวจสอบเอกสารก่อนส่งมอบ' },
          { level: 2, question: 'ทำไมจึงไม่มีการตรวจสอบก่อนส่งมอบ?', answer: 'ไม่มี Checklist การตรวจสอบขั้นตอนสุดท้าย' },
          { level: 3, question: 'ทำไมจึงไม่มี Checklist การตรวจสอบ?', answer: 'ไม่ได้ระบุไว้ในขั้นตอนการปฏิบัติงาน (WI)' },
          { level: 4, question: 'ทำไม WI จึงไม่ได้ระบุข้อนี้ไว้?', answer: 'เมื่อมีการเปลี่ยนขั้นตอนใหม่ ไม่ได้ทบทวนเอกสารตามขั้นตอนการจัดการการเปลี่ยนแปลง' },
          { level: 5, question: 'ทำไมจึงไม่ทบทวนเอกสารเมื่อมีการเปลี่ยนแปลง?', answer: 'ขาดการสื่อสารระหว่างทีมวิศวกรรมและทีมผลิตในขั้นตอนการ Release กระบวนการใหม่' },
        ],
        rootCauseSummary: 'ขาดกระบวนการติดตามและทบทวนเอกสาร WI เมื่อมีการเปลี่ยนแปลงขั้นตอนการทำงาน (Change Management)',
        correctiveAction: 'ปรับปรุงขั้นตอนการปฏิบัติงาน (WI) เพิ่ม Checklist ตรวจสอบ และฝึกอบรมพนักงานทุกคน',
        preventiveAction: 'กำหนดขั้นตอน Change Management บังคับให้ต้อง Sign-off อัปเดต WI ทุกครั้งก่อนเริ่มผลิตล็อตใหม่',
        verificationCriteria: 'ตรวจสอบบันทึกการอบรม WI ฉบับใหม่ และสุ่มตรวจ Checklist หน้างาน 10 ชุดต่อเนื่อง 1 เดือน',
        source: 'preset',
      });
    }

    const prompt = `คุณคือที่ปรึกษาด้านระบบบริหารคุณภาพและผู้ตรวจประเมิน CAR (Corrective Action Request)
โปรดช่วยวิเคราะห์หาสาเหตุที่แท้จริง (Root Cause Analysis ด้วยเทคนิค 5 Whys) และจัดทำแผน CAPA (Corrective and Preventive Action) สำหรับข้อบกพร่องดังนี้:

- แผนก: ${department || 'ฝ่ายที่รับการตรวจ'}
- ข้อกำหนดที่ผิด: ${clauseReference || 'ข้อกำหนด ISO'}
- รายละเอียดข้อบกพร่อง (NC Statement): ${findingDescription || '-'}
- หลักฐานเชิงประจักษ์ (Objective Evidence): ${objectiveEvidence || '-'}

กรุณาวิเคราะห์ 5 Whys เป็นลำดับขั้น จนถึงสาเหตุเชิงระบบ (Systemic Root Cause) พร้อมเสนอแนะมาตรการแก้ไข (Corrective Action) และมาตรการป้องกันการเกิดซ้ำ (Preventive Action) และเกณฑ์การตรวจติดตามประสิทธิผลเพื่อปิด CAR`;

    const response = await callGeminiWithTimeout(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fiveWhys: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    level: { type: Type.INTEGER, description: 'ลำดับ 1-5' },
                    question: { type: Type.STRING, description: 'คำถามทำไม' },
                    answer: { type: Type.STRING, description: 'คำตอบที่นำไปสู่สาเหตุลึกขึ้น' },
                  },
                  required: ['level', 'question', 'answer'],
                },
              },
              rootCauseSummary: { type: Type.STRING, description: 'สรุปสาเหตุที่แท้จริงเชิงระบบ (Systemic Root Cause)' },
              correctiveAction: { type: Type.STRING, description: 'มาตรการแก้ไขเพื่อขจัดสาเหตุที่แท้จริง' },
              preventiveAction: { type: Type.STRING, description: 'มาตรการป้องกันการเกิดซ้ำและการขยายผลไปยังจุดอื่น (Horizontal deployment)' },
              verificationCriteria: { type: Type.STRING, description: 'เกณฑ์และหลักฐานที่ Auditor จะต้องใช้ตรวจติดตามเพื่อปิด CAR' },
            },
            required: ['fiveWhys', 'rootCauseSummary', 'correctiveAction', 'preventiveAction', 'verificationCriteria'],
          },
        },
      }),
      3500
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      source: 'gemini',
    });
  } catch (error: any) {
    console.warn('Gemini suggest-car-plan fallback activated:', error?.message);
    return res.json({
      fiveWhys: [
        { level: 1, question: 'ทำไมจึงเกิดข้อผิดพลาดนี้ในหน้างาน?', answer: 'ผู้ปฏิบัติงานไม่ได้ตรวจสอบเอกสารก่อนส่งมอบ' },
        { level: 2, question: 'ทำไมจึงไม่มีการตรวจสอบก่อนส่งมอบ?', answer: 'ไม่มี Checklist การตรวจสอบขั้นตอนสุดท้าย' },
        { level: 3, question: 'ทำไมจึงไม่มี Checklist การตรวจสอบ?', answer: 'ไม่ได้ระบุไว้ในขั้นตอนการปฏิบัติงาน (WI)' },
        { level: 4, question: 'ทำไม WI จึงไม่ได้ระบุข้อนี้ไว้?', answer: 'เมื่อมีการเปลี่ยนขั้นตอนใหม่ ไม่ได้ทบทวนเอกสารตามขั้นตอนการจัดการการเปลี่ยนแปลง' },
        { level: 5, question: 'ทำไมจึงไม่ทบทวนเอกสารเมื่อมีการเปลี่ยนแปลง?', answer: 'ขาดการสื่อสารระหว่างทีมวิศวกรรมและทีมผลิตในขั้นตอนการ Release กระบวนการใหม่' },
      ],
      rootCauseSummary: 'ขาดกระบวนการติดตามและทบทวนเอกสาร WI เมื่อมีการเปลี่ยนแปลงขั้นตอนการทำงาน (Change Management)',
      correctiveAction: 'ปรับปรุงขั้นตอนการปฏิบัติงาน (WI) เพิ่ม Checklist ตรวจสอบ และฝึกอบรมพนักงานทุกคน',
      preventiveAction: 'กำหนดขั้นตอน Change Management บังคับให้ต้อง Sign-off อัปเดต WI ทุกครั้งก่อนเริ่มผลิตล็อตใหม่',
      verificationCriteria: 'ตรวจสอบบันทึกการอบรม WI ฉบับใหม่ และสุ่มตรวจ Checklist หน้างาน 10 ชุดต่อเนื่อง 1 เดือน',
      source: 'preset-fallback',
    });
  }
});

// Configure Vite middleware in development or serve static in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Internal Audit server listening on http://0.0.0.0:${port}`);
});
