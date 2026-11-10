import { StandardDefinition, StandardType, StandardClause } from '../types/audit';

export const DEPARTMENTS = [
  'ฝ่ายจัดซื้อและจัดหา (Procurement)',
  'ฝ่ายผลิต (Production)',
  'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)',
  'ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)',
  'ฝ่ายขายและการตลาด (Sales & Marketing)',
  'ฝ่ายวิศวกรรมและซ่อมบำรุง (Engineering & Maintenance)',
  'ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training)',
  'ฝ่ายเทคโนโลยีสารสนเทศ (IT & System)',
  'ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)',
  'ฝ่ายบริหารระดับสูง / QMR (Top Management)',
];

export const STANDARDS_DATA: StandardDefinition[] = [
  // 1. IATF 16949:2016
  {
    id: 'IATF 16949:2016',
    name: 'ระบบบริหารงานคุณภาพยานยนต์ (Automotive Quality Management)',
    code: 'IATF 16949',
    description: 'มาตรฐานเฉพาะสำหรับอุตสาหกรรมชิ้นส่วนยานยนต์ เน้นการป้องกันข้อบกพร่อง ลดความผันแปร และควบคุมห่วงโซ่อุปทานอย่างเข้มงวด',
    color: 'blue',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    clauses: [
      // --- จัดซื้อ (Procurement) ---
      {
        clause: '8.4.1.2',
        title: 'กระบวนการคัดเลือกผู้ส่งมอบ (Supplier selection process)',
        englishTitle: 'Supplier selection process',
        summary: 'องค์กรต้องมีกระบวนการคัดเลือกผู้ส่งมอบที่มีการประเมินความเสี่ยงต่อความสอดคล้องของผลิตภัณฑ์ ความเสี่ยงขององค์กร และขีดความสามารถซอฟต์แวร์',
        keyAuditingPoints: [
          'เกณฑ์การประเมินความเสี่ยงและคัดเลือกผู้ส่งมอบ',
          'การประเมินการปฏิบัติตามระบบ QMS (เช่น ISO 9001/IATF 16949)',
          'การประเมินขีดความสามารถในการพัฒนาซอฟต์แวร์ของผู้ส่งมอบ (ถ้ามี)',
          'การทบทวนเสถียรภาพทางการเงินและขีดความสามารถในการส่งมอบ',
        ],
        sampleQuestions: [
          'ฝ่ายจัดซื้อมีขั้นตอนและเกณฑ์การคัดเลือกผู้ส่งมอบรายใหม่อย่างไร และมีการประเมินความเสี่ยงด้านคุณภาพและการส่งมอบอย่างไร?',
          'สุ่มตรวจแฟ้มคัดเลือกผู้ส่งมอบรายใหม่ 2 รายล่าสุด มีการประเมินตามเกณฑ์ IATF 16949 ครบถ้วนหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.1.3',
        title: 'แหล่งจัดหาที่ลูกค้ากำหนด (Customer-directed sources / Directed-Buy)',
        englishTitle: 'Customer-directed sources',
        summary: 'กรณีลูกค้าเป็นผู้กำหนดผู้ส่งมอบ องค์กรยังคงต้องควบคุมคุณภาพและติดตามผลงาน เว้นแต่มีข้อตกลงเป็นลายลักษณ์อักษรจากลูกค้าระบุเป็นอย่างอื่น',
        keyAuditingPoints: [
          'รายชื่อผู้ส่งมอบที่ลูกค้ากำหนด (Customer Directed Suppliers)',
          'ข้อตกลงการแบ่งความรับผิดชอบด้านคุณภาพ',
          'การติดตามผลงานคุณภาพและการส่งมอบของผู้ขายที่ลูกค้ากำหนด',
        ],
        sampleQuestions: [
          'มีชิ้นส่วนหรือวัตถุดิบใดที่ลูกค้าเป็นผู้กำหนดผู้ขาย (Directed Buy) หรือไม่ และฝ่ายจัดซื้อมีมาตรการควบคุมและติดตามผลงานผู้ขายกลุ่มนี้อย่างไร?',
          'หากพบปัญหาคุณภาพจากผู้ส่งมอบที่ลูกค้ากำหนด มีขั้นตอนการแจ้งลูกค้าและดำเนินการแก้ไขอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.1',
        title: 'ประเภทและขอบเขตของการควบคุม - ภาคผนวก (Type and extent of control - supplemental)',
        englishTitle: 'Type and extent of control - supplemental',
        summary: 'ต้องมีกระบวนการระบุและประเมินความเสี่ยงที่เกี่ยวข้องกับผู้ส่งมอบ และกำหนดระดับการควบคุมตามระดับความเสี่ยงและผลกระทบต่อผลิตภัณฑ์ยานยนต์',
        keyAuditingPoints: [
          'การจัดเกรดความเสี่ยงของผู้ส่งมอบ (High/Medium/Low Risk)',
          'มาตรการควบคุมที่สอดคล้องกับระดับความเสี่ยง',
          'การควบคุมชิ้นส่วนที่มีลักษณะเฉพาะพิเศษ (Special Characteristics)',
        ],
        sampleQuestions: [
          'ฝ่ายจัดซื้อมีการแบ่งประเภทและจัดระดับความเสี่ยงของผู้ส่งมอบอย่างไร และกำหนดเกณฑ์การควบคุมผู้ส่งมอบที่มีความเสี่ยงสูงอย่างไร?',
          'ขอดูแผนการควบคุมผู้ส่งมอบกลุ่มวิกฤต (Critical Suppliers) ฉบับล่าสุด',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.2',
        title: 'ข้อกำหนดทางกฎหมายและข้อบังคับ (Statutory and regulatory requirements)',
        englishTitle: 'Statutory and regulatory requirements',
        summary: 'ต้องมั่นใจว่าผลิตภัณฑ์ บริการ หรือกระบวนการที่จัดหาจากภายนอก เป็นไปตามกฎหมายและข้อบังคับของทั้งประเทศผู้ผลิตและประเทศปลายทางที่ส่งมอบ',
        keyAuditingPoints: [
          'การส่งต่อข้อกำหนดกฎหมาย (RoHS, REACH, IMDS, ขยะ/สารพิษ) ไปยังผู้ส่งมอบ',
          'เอกสารรับรองความสอดคล้องจากผู้ส่งมอบ (Certificate of Compliance / IMDS Data Sheet)',
        ],
        sampleQuestions: [
          'ฝ่ายจัดซื้อมีการส่งต่อข้อกำหนดกฎหมายสารต้องห้าม (เช่น RoHS, REACH, IMDS) ไปยังผู้ส่งมอบอย่างไร และมีหลักฐานการตรวจสอบยืนยันหรือไม่?',
          'สุ่มตรวจชิ้นส่วนวัตถุดิบ 2 ชนิด ขอดูเอกสารรับรอง IMDS / Material Compliance ล่าสุด',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)', 'ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.3',
        title: 'การพัฒนาระบบการจัดการคุณภาพของผู้ส่งมอบ (Supplier QMS development)',
        englishTitle: 'Supplier quality management system development',
        summary: 'องค์กรต้องกำหนดให้ผู้ส่งมอบผลิตภัณฑ์ยานยนต์ได้รับการรับรอง ISO 9001 และมีแผนพัฒนายกระดับสู่การรับรอง IATF 16949 ตามลำดับความสำคัญ',
        keyAuditingPoints: [
          'ทะเบียนใบรับรอง ISO 9001 / IATF 16949 ของผู้ส่งมอบทุกรายใน AVL',
          'แผนงานยกระดับและพัฒนาผู้ส่งมอบที่ยังไม่ได้รับรอง IATF 16949',
          'การขอผ่อนผันจากลูกค้ากรณีผู้ส่งมอบไม่ได้รับการรับรอง (Customer Concession)',
        ],
        sampleQuestions: [
          'ใน Approved Vendor List มีผู้ส่งมอบรายใดที่ยังไม่ได้รับการรับรอง ISO 9001 หรือ IATF 16949 หรือไม่ และมีแผนการพัฒนาระบบอย่างไร?',
          'ขอดูใบรับรองระบบคุณภาพของผู้ส่งมอบชิ้นส่วนหลัก 3 ราย ว่ายังไม่หมดอายุและครอบคลุมขอบข่ายการผลิต',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.3.1',
        title: 'ซอฟต์แวร์ที่เกี่ยวข้องกับผลิตภัณฑ์ยานยนต์ (Automotive product-related software)',
        englishTitle: 'Automotive product-related software',
        summary: 'องค์กรต้องกำหนดให้ผู้ส่งมอบซอฟต์แวร์ยานยนต์ต้องมีระบบประกันคุณภาพซอฟต์แวร์และใช้วิธีการประเมินกระบวนการพัฒนาซอฟต์แวร์ (เช่น Automotive SPICE หรือ CMMI)',
        keyAuditingPoints: [
          'เกณฑ์ประเมินกระบวนการพัฒนาซอฟต์แวร์ของผู้ส่งมอบ (Automotive SPICE Level)',
          'รายงานการประเมินความสามารถด้านซอฟต์แวร์ของผู้ส่งมอบ',
        ],
        sampleQuestions: [
          'หากมีการจัดซื้อชิ้นส่วนอิเล็กทรอนิกส์ที่มีซอฟต์แวร์ฝังตัว (Embedded Software) ฝ่ายจัดซื้อมีเกณฑ์ประเมิน Automotive SPICE อย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)', 'ฝ่ายเทคโนโลยีสารสนเทศ (IT & System)'],
        isCore: false,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.4',
        title: 'การติดตามผลการดำเนินงานของผู้ส่งมอบ (Supplier monitoring)',
        englishTitle: 'Supplier monitoring',
        summary: 'ต้องติดตามตัวชี้วัดผลงานผู้ส่งมอบอย่างน้อย: ประสิทธิภาพคุณภาพชิ้นส่วน (PPM), การหยุดชะงักของสายการผลิต, ค่าขนส่งกรณีพิเศษ (Premium freight), และการแจ้งเตือนสถานะพิเศษจากลูกค้า',
        keyAuditingPoints: [
          'รายงาน KPI ผู้ส่งมอบประจำเดือน/ไตรมาส (Defect PPM, On-Time Delivery)',
          'บันทึกเหตุการณ์สายการผลิตหยุดชะงัก (Customer/Plant Disruptions)',
          'บันทึกค่าขนส่งด่วนพิเศษ (Premium Freight) ที่เกิดจากผู้ส่งมอบ',
          'การจัดเกรดและแจ้งผลประเมินย้อนกลับไปยังผู้ส่งมอบ',
        ],
        sampleQuestions: [
          'ฝ่ายจัดซื้อมีการติดตามตัวชี้วัด PPM, การส่งมอบตรงเวลา, และค่าขนส่งพิเศษ (Premium freight) ของผู้ส่งมอบอย่างไร ขอดูรายงานสรุปเดือนล่าสุด',
          'หากผู้ส่งมอบได้เกรด C หรือมี PPM หลุดเป้า มีกระบวนการออก CAR หรือเรียกร้องแผนปรับปรุงอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.4.1',
        title: 'การตรวจประเมินผู้ส่งมอบโดยบุคคลที่สอง (Second-party audits)',
        englishTitle: 'Second-party audits',
        summary: 'ต้องมีกระบวนการตรวจประเมินบุคคลที่สองสำหรับ: การประเมินความเสี่ยง, การตรวจติดตามประจำปี, การพัฒนาระบบ QMS, และการตรวจประเมินกระบวนการ/ผลิตภัณฑ์ตาม VDA 6.3',
        keyAuditingPoints: [
          'แผนการตรวจประเมินผู้ส่งมอบประจำปี (Supplier Audit Plan)',
          'คุณสมบัติของผู้ตรวจประเมินผู้ส่งมอบ (Second-party Auditor Qualification)',
          'รายงานผลการตรวจประเมินผู้ส่งมอบและรายงานการปิด CAR',
        ],
        sampleQuestions: [
          'ขอดูแผนการตรวจประเมินผู้ส่งมอบ (Second-Party Audit Plan) ประจำปี 2026 และรายงานผลการตรวจประเมินโรงงานผู้ส่งมอบ 2 รายล่าสุด',
          'ผู้ตรวจประเมินผู้ส่งมอบมีคุณสมบัติและผ่านการอบรมตามเกณฑ์ข้อกำหนด 7.2.4 หรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.2.5',
        title: 'การพัฒนาผู้ส่งมอบ (Supplier development)',
        englishTitle: 'Supplier development',
        summary: 'องค์กรต้องกำหนดลำดับความสำคัญ รูปแบบ ขอบเขต และระยะเวลาของกิจกรรมการพัฒนาผู้ส่งมอบที่มีผลการดำเนินงานต่ำกว่าเกณฑ์',
        keyAuditingPoints: [
          'แผนพัฒนาผู้ส่งมอบที่ผลงานไม่ผ่านเกณฑ์ (Action Plan for Underperforming Suppliers)',
          'การติดตามประสิทธิผลของการแก้ไขปัญหาร่วมกับผู้ส่งมอบ',
        ],
        sampleQuestions: [
          'ผู้ส่งมอบที่มีผลการประเมินต่ำกว่าเป้าหมาย ฝ่ายจัดซื้อมีแผนงานพัฒนา (Supplier Development) และติดตามผลความคืบหน้าอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.4.3.1',
        title: 'ข้อมูลสำหรับผู้จัดหาภายนอก - ภาคผนวก (Information for external providers - flow-down of CSR)',
        englishTitle: 'Information for external providers - supplemental',
        summary: 'องค์กรต้องส่งต่อข้อกำหนดเฉพาะของลูกค้า (Customer-Specific Requirements - CSRs) ทั้งหมดที่เกี่ยวข้อง ไปยังผู้จัดหาภายนอกตลอดห่วงโซ่อุปทาน',
        keyAuditingPoints: [
          'การระบุข้อกำหนด CSR ในใบสั่งซื้อ (PO) หรือสัญญาจัดซื้อ',
          'การส่งต่อข้อกำหนดลักษณะเฉพาะพิเศษ (Special Characteristics) ให้ผู้ส่งมอบ',
        ],
        sampleQuestions: [
          'ฝ่ายจัดซื้อมีการส่งต่อข้อกำหนดเฉพาะของลูกค้า (CSR) และลักษณะเฉพาะพิเศษ (Special Characteristics) ไปในใบสั่งซื้อ (PO) อย่างไร?',
          'สุ่มตรวจใบสั่งซื้อ PO ล่าสุด 3 ฉบับ มีการระบุข้อกำหนดคุณภาพและมาตรฐานอ้างอิงชัดเจนหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },

      // --- ฝ่ายผลิต (Production) ---
      {
        clause: '8.5.1.1',
        title: 'แผนควบคุม (Control Plan)',
        englishTitle: 'Control plan',
        summary: 'จัดทำแผนควบคุมในระดับ Prototype, Pre-launch และ Production ครอบคลุมการควบคุมลักษณะเฉพาะพิเศษ (Special Characteristics) และตอบสนองเมื่อกระบวนการผิดปกติ',
        keyAuditingPoints: [
          'Control Plan ฉบับล่าสุดที่ได้รับการอนุมัติ',
          'ความสอดคล้องระหว่าง Control Plan, PFMEA, และ Process Flow Diagram',
          'แผนการตอบสนองเมื่อพบความผิดปกติ (Reaction Plan)',
        ],
        sampleQuestions: [
          'ขอดู Control Plan ของผลิตภัณฑ์หลัก ตรวจสอบว่าพารามิเตอร์การผลิตและจุดตรวจสอบตรงกับที่ปฏิบัติจริงในหน้างานหรือไม่?',
          'เมื่อพบชิ้นงานหลุดสเปกหรือกระบวนการผิดปกติ พนักงานปฏิบัติตาม Reaction Plan ที่ระบุไว้ใน Control Plan อย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.5.1.2',
        title: 'งานมาตรฐาน - คำแนะนำการปฏิบัติงานและการแสดงผลด้วยสายตา (Standardised work)',
        englishTitle: 'Standardised work - operator instructions',
        summary: 'จัดทำคำแนะนำการปฏิบัติงานที่เข้าใจง่าย แสดงไว้ ณ จุดทำงาน สื่อสารกฎความปลอดภัยและข้อกำหนดลักษณะเฉพาะพิเศษอย่างชัดเจน',
        keyAuditingPoints: [
          'Work Instruction (WI) / Standard Operating Procedure (SOP) ณ จุดทำงาน',
          'สัญลักษณ์ Special Characteristics บนเอกสารหน้างาน',
          'การเข้าใจและการปฏิบัติตามของพนักงานผู้ปฏิบัติการ',
        ],
        sampleQuestions: [
          'สุ่มตรวจจุดปฏิบัติงาน 2 จุด มีเอกสาร Work Instruction แสดงไว้ตรงจุดทำงานหรือไม่ และพนักงานสามารถอธิบายจุดควบคุมสำคัญได้ถูกต้องหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.5.1.3',
        title: 'การทวนสอบการตั้งค่าเครื่องจักร (Verification of job set-ups)',
        englishTitle: 'Verification of job set-ups',
        summary: 'ต้องทวนสอบการตั้งค่าเครื่องจักรทุกครั้งที่มีการเปลี่ยนล็อต เปลี่ยนรุ่น หรือหยุดการผลิต โดยใช้ตัวอย่างชิ้นแรก/ชิ้นสุดท้าย (First-piece / Last-piece check)',
        keyAuditingPoints: [
          'บันทึกการตรวจสอบชิ้นงานชิ้นแรก (First-piece Inspection Record)',
          'การเปรียบเทียบชิ้นงานตัวอย่างชิ้นสุดท้ายของล็อตเดิมกับชิ้นแรกของล็อตใหม่',
          'เกณฑ์อนุมัติให้เดินเครื่องผลิตเต็มรูปแบบ',
        ],
        sampleQuestions: [
          'เมื่อมีการ Setup หรือเปลี่ยนรุ่นการผลิต (Changeover) มีขั้นตอนการตรวจสอบชิ้นงานชิ้นแรก (First Piece) อย่างไร ขอดูบันทึกของกะล่าสุด',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.5.1.5',
        title: 'การบำรุงรักษาทวีผลที่ทุกคนมีส่วนร่วม (Total Productive Maintenance - TPM)',
        englishTitle: 'Total productive maintenance',
        summary: 'ต้องพัฒนาระบบ TPM รวมถึงการระบุเครื่องจักรวิกฤต การสำรองอะไหล่สำคัญ (Spare parts) แผนบำรุงรักษาเชิงป้องกัน และการติดตามเป้าหมาย OEE/MTBF/MTTR',
        keyAuditingPoints: [
          'ทะเบียนเครื่องจักรวิกฤต (Critical Equipment List)',
          'แผนบำรุงรักษาเชิงป้องกัน (PM Plan) และประวัติการบำรุงรักษา',
          'การจัดเก็บอะไหล่สำรองวิกฤต (Critical Spare Parts)',
          'ตัวชี้วัด OEE, MTBF, MTTR',
        ],
        sampleQuestions: [
          'ขอดูแผนการบำรุงรักษาเชิงป้องกัน (PM) ของเครื่องจักรหลักในไลน์ผลิต และประวัติการทำ PM ย้อนหลัง 3 เดือน',
          'มีระบบบริหารจัดการอะไหล่สำรองเครื่องจักรวิกฤต (Spare Parts) อย่างไร มีการกำหนด Min/Max หรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายวิศวกรรมและซ่อมบำรุง (Engineering & Maintenance)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ซ่อมบำรุง (Maintenance)',
      },
      {
        clause: '8.5.2.1',
        title: 'การชี้บ่งและการสอบกลับได้ - ภาคผนวก (Identification and traceability - supplemental)',
        englishTitle: 'Identification and traceability - supplemental',
        summary: 'ต้องจัดทำแผนการสอบกลับที่ระบุระบบ กระบวนการ และการชี้บ่งตั้งแต่รับวัตถุดิบ ระหว่างผลิต จนถึงส่งมอบลูกค้า รวมถึงการทดสอบการสอบกลับได้',
        keyAuditingPoints: [
          'การระบุ Lot No., Barcode, QR Code บนชิ้นงานและกล่องบรรจุ',
          'ผลการทดสอบการสอบกลับย้อนหลัง (Traceability Drill / Mock Recall)',
          'เวลาที่ใช้ในการสอบกลับ (เกณฑ์มาตรฐานยานยนต์มักไม่เกิน 2-4 ชั่วโมง)',
        ],
        sampleQuestions: [
          'ขอดูรายงานการทดสอบการสอบกลับได้ (Traceability Mock Test) ครั้งล่าสุด ใช้เวลาเท่าไร และสามารถสอบกลับได้ถึงวัตถุดิบและค่าพารามิเตอร์การผลิตหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.5.6.1',
        title: 'การควบคุมการเปลี่ยนแปลง - ภาคผนวก (Control of changes - 4M)',
        englishTitle: 'Control of changes - supplemental',
        summary: 'ต้องมีกระบวนการควบคุมและตอบสนองต่อการเปลี่ยนแปลงด้าน 4M (Man, Machine, Material, Method) รวมถึงการขออนุมัติจากลูกค้าก่อนเปลี่ยนแปลง',
        keyAuditingPoints: [
          'แบบฟอร์มขอเปลี่ยนแปลง 4M (Engineering Change Request/Notice - ECN)',
          'การประเมินความเสี่ยงต่อคุณภาพก่อนดำเนินการเปลี่ยนแปลง',
          'การแจ้งและขออนุมัติจากลูกค้าก่อนเปลี่ยนกระบวนการผลิต',
        ],
        sampleQuestions: [
          'เมื่อมีการเปลี่ยนเครื่องจักร หรือเปลี่ยนแหล่งวัตถุดิบ มีขั้นตอนการขออนุมัติเปลี่ยนแปลง (4M Change) และแจ้งลูกค้าอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายวิศวกรรมและซ่อมบำรุง (Engineering & Maintenance)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.7.1.1',
        title: 'การอนุมัติการผ่อนผันจากลูกค้า (Customer authorization for concession)',
        englishTitle: 'Customer authorization for concession',
        summary: 'ต้องได้รับใบขอผ่อนผัน (Concession / Deviation permit) จากลูกค้าก่อนดำเนินการ หากผลิตภัณฑ์หรือกระบวนการแตกต่างจากที่ได้รับอนุมัติไว้',
        keyAuditingPoints: [
          'ใบขอผ่อนผันชิ้นงานพิเศษ (Customer Deviation / Concession)',
          'การระบุวันหมดอายุหรือปริมาณชิ้นงานที่ได้รับผ่อนผัน',
          'ป้ายชี้บ่งชิ้นงานที่ได้รับผ่อนผันเป็นพิเศษ',
        ],
        sampleQuestions: [
          'กรณีที่มีชิ้นงานไม่ตรงตามแบบแต่ต้องการส่งมอบ มีขั้นตอนการขอใบ Concession จากลูกค้าอย่างไร ขอดูตัวอย่างฉบับล่าสุด',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },

      // --- ฝ่ายควบคุมและประกันคุณภาพ (QA/QC) ---
      {
        clause: '7.1.5.1.1',
        title: 'การวิเคราะห์ระบบการวัด (Measurement Systems Analysis - MSA)',
        englishTitle: 'Measurement systems analysis',
        summary: 'ต้องดำเนินการศึกษาทางสถิติเพื่อวิเคราะห์ความผันแปรของระบบการวัดแต่ละชนิด เช่น Gage R&R, Bias, Linearity, Stability',
        keyAuditingPoints: [
          'แผนการทำ MSA ประจำปี',
          'รายงานผลการวิเคราะห์ Gage R&R (เกณฑ์ %GRR < 10% หรือ < 30%)',
          'มาตรการแก้ไขเมื่อระบบการวัดไม่ผ่านเกณฑ์',
        ],
        sampleQuestions: [
          'ขอดูแผนและผลการวิเคราะห์ Gage R&R (MSA) ของเครื่องมือวัดที่ใช้ตรวจสอบลักษณะเฉพาะพิเศษ (Special Characteristics)',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },
      {
        clause: '7.1.5.3',
        title: 'ข้อกำหนดของห้องปฏิบัติการ (Laboratory requirements)',
        englishTitle: 'Laboratory requirements',
        summary: 'ห้องปฏิบัติการภายในต้องมีขอบข่ายระบุความสามารถ มีขั้นตอนทดสอบที่ได้มาตรฐาน และห้องแล็บภายนอกต้องได้รับการรับรอง ISO/IEC 17025',
        keyAuditingPoints: [
          'ขอบข่ายการทดสอบของ Internal Lab Scope',
          'ใบรับรอง ISO/IEC 17025 ของแล็บภายนอกที่ส่งสอบเทียบเครื่องมือวัด',
        ],
        sampleQuestions: [
          'เครื่องมือวัดที่ส่งไปสอบเทียบภายนอก สถาบันสอบเทียบได้รับการรับรองตามมาตรฐาน ISO/IEC 17025 หรือไม่ ขอดูใบรับรอง',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },
      {
        clause: '8.3.4.4',
        title: 'กระบวนการอนุมัติชิ้นส่วนการผลิต (Product Approval Process - PPAP)',
        englishTitle: 'Product approval process',
        summary: 'ต้องปฏิบัติตามกระบวนการอนุมัติชิ้นส่วนการผลิต (PPAP) ตามข้อกำหนดของลูกค้า และต้องจัดทำ PPAP สำหรับผู้ส่งมอบด้วยเช่นกัน',
        keyAuditingPoints: [
          'แฟ้มเอกสาร PPAP 18 รายการ (เช่น PSW, DFMEA, PFMEA, Control Plan, Dimensional Results)',
          'หลักฐานการอนุมัติ PPAP จากลูกค้าก่อนเริ่มผลิตเชิงพาณิชย์',
          'เอกสาร PPAP ที่อนุมัติให้กับผู้ส่งมอบ (Supplier PPAP)',
        ],
        sampleQuestions: [
          'ขอดูแฟ้ม PPAP ของชิ้นงานล่าสุด และหลักฐานใบรับรองการส่งมอบชิ้นส่วน (Part Submission Warrant - PSW) ที่ลูกค้าลงนามอนุมัติ',
          'ฝ่ายจัดซื้อและ QA มีกระบวนการตรวจรับรอง PPAP ของชิ้นส่วนที่ซื้อจากผู้ส่งมอบอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายจัดซื้อและจัดหา (Procurement)', 'ฝ่ายวิศวกรรมและซ่อมบำรุง (Engineering & Maintenance)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },
      {
        clause: '9.1.1.1',
        title: 'การเฝ้าระวังและการวัดกระบวนการผลิต (Statistical Process Control - SPC)',
        englishTitle: 'Monitoring and measurement of manufacturing processes',
        summary: 'ต้องศึกษาความสามารถของกระบวนการผลิต (Cpk / Ppk) สำหรับลักษณะเฉพาะพิเศษทั้งหมด และมีแผนตอบสนองเมื่อ Cpk ต่ำกว่าเกณฑ์ (Cpk < 1.33)',
        keyAuditingPoints: [
          'Control Chart (X-bar R chart)',
          'รายงานคำนวณค่าดัชนีความสามารถของกระบวนการ (Cpk / Ppk >= 1.33 或 1.67)',
          'มาตรการควบคุม 100% inspection เมื่อ Cpk หลุดเกณฑ์',
        ],
        sampleQuestions: [
          'ขอดูแผนภูมิควบคุม SPC และผลการประเมินค่า Cpk ของกระบวนการผลิตวิกฤต หากพบค่า Cpk ต่ำกว่า 1.33 มีมาตรการดำเนินการอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },
      {
        clause: '9.2.2.3',
        title: 'การตรวจประเมินกระบวนการผลิต (Manufacturing process audit - VDA 6.3)',
        englishTitle: 'Manufacturing process audit',
        summary: 'ต้องตรวจประเมินกระบวนการผลิตทุกกระบวนการตลอดรอบระยะเวลา 3 ปี โดยใช้วิธีการตรวจประเมินตามแนวทาง VDA 6.3 หรือวิธีที่ลูกค้ากำหนด',
        keyAuditingPoints: [
          'แผนการตรวจประเมินกระบวนการผลิตประจำปี',
          'Checklist การตรวจตามแนวทาง VDA 6.3 (P2-P7)',
          'การติดตามปิดข้อบกพร่องจากการตรวจกระบวนการ',
        ],
        sampleQuestions: [
          'ขอดูแผนและรายงานการตรวจประเมินกระบวนการผลิต (Manufacturing Process Audit) ตามแนวทาง VDA 6.3 ในรอบปีที่ผ่านมา',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },
      {
        clause: '10.2.3',
        title: 'การแก้ไขปัญหา (Problem solving - 8D Report)',
        englishTitle: 'Problem solving',
        summary: 'ต้องมีกระบวนการแก้ไขปัญหาตามขั้นตอนอย่างเป็นทางการ (เช่น 8D) รวมถึงการกักกันทันที การวิเคราะห์สาเหตุด้วย 5 Whys/Fishbone และการทบทวน FMEA/Control Plan',
        keyAuditingPoints: [
          'รายงาน 8D Report สำหรับปัญหาร้องเรียนจากลูกค้า',
          'การวิเคราะห์สาเหตุที่แท้จริง (Occurrence Cause & Escape Cause)',
          'การอัปเดตบทเรียนลงใน PFMEA และ Control Plan ย้อนกลับ',
        ],
        sampleQuestions: [
          'ขอดูรายงาน 8D Report ของลูกค้ารายล่าสุด ตรวจสอบว่ามีการอัปเดต PFMEA และ Control Plan ย้อนหลังหลังจากปิดประเด็นหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },

      // --- ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics) ---
      {
        clause: '8.5.4.1',
        title: 'การถนอมรักษา - ภาคผนวก (Preservation - FIFO & Inventory control)',
        englishTitle: 'Preservation - supplemental',
        summary: 'ต้องประเมินสภาพของผลิตภัณฑ์ในคลังสินค้าเป็นระยะ ควบคุมการหมุนเวียนสินค้าตามหลักเข้าก่อน-ออกก่อน (FIFO) และจัดการสินค้าที่เสื่อมสภาพ/หมดอายุ',
        keyAuditingPoints: [
          'ระบบการควบคุมการหมุนเวียนสินค้า FIFO / FEFO',
          'การตรวจสอบสภาพสินค้าคงคลังเป็นประจำ (Stock Condition Audit)',
          'การควบคุมสภาวะแวดล้อม เช่น อุณหภูมิ ความชื้น สารป้องกันสนิม (VCI)',
        ],
        sampleQuestions: [
          'ในคลังสินค้า มีระบบควบคุมการจ่ายวัตถุดิบและสินค้าสำเร็จรูปตามหลัก FIFO อย่างไร และมีการตรวจสอบสินค้าหมดอายุหรือเสื่อมสภาพอย่างไร?',
          'สุ่มตรวจชิ้นงานเหล็กในคลัง มีการใช้ถุงกันสนิม (VCI Bag) หรือสารดูดความชื้นตามข้อกำหนดการบรรจุหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)'],
        isCore: true,
        category: 'คลังสินค้าและโลจิสติกส์ (Warehouse)',
      },

      // --- ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training) ---
      {
        clause: '7.2.1',
        title: 'ความสามารถ - ภาคผนวกและการฝึกอบรมหน้างาน (Competence - supplemental & OJT)',
        englishTitle: 'Competence - supplemental',
        summary: 'ต้องกำหนดความสามารถที่จำเป็นของบุคลากรที่มีผลต่อคุณภาพผลิตภัณฑ์ มีการฝึกอบรมในงาน (OJT) และประเมินผลความเข้าใจก่อนอนุญาตให้ปฏิบัติงานจริง',
        keyAuditingPoints: [
          'Skill Matrix / Competency Matrix ของพนักงานสายการผลิต',
          'บันทึกการฝึกอบรม On-the-job Training (OJT)',
          'การรับรองคุณสมบัติผู้ตรวจประเมินภายใน (Internal Auditor Qualification)',
        ],
        sampleQuestions: [
          'พนักงานที่เข้าทำงานใหม่หรือเปลี่ยนสายการผลิต มีขั้นตอนการฝึกอบรม OJT และการประเมินทักษะก่อนปล่อยให้ทำงานคนเดียวอย่างไร?',
          'ขอดูหลักฐานคุณสมบัติและการต่ออายุใบรับรองของผู้ตรวจประเมินระบบ IATF 16949 ในองค์กร',
        ],
        applicableDepartments: ['ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training)'],
        isCore: true,
        category: 'ทรัพยากรบุคคล (HR)',
      },

      // --- ฝ่ายบริหารระดับสูง / QMR (Top Management) ---
      {
        clause: '4.4.1.2',
        title: 'ความปลอดภัยของผลิตภัณฑ์ (Product safety)',
        englishTitle: 'Product safety',
        summary: 'ต้องมีกระบวนการจัดการผลิตภัณฑ์และกระบวนการผลิตที่เกี่ยวข้องกับความปลอดภัย ระบุผู้รับผิดชอบด้านความปลอดภัยของผลิตภัณฑ์ (PSB / Product Safety Representative)',
        keyAuditingPoints: [
          'การแต่งตั้งผู้แทนความปลอดภัยของผลิตภัณฑ์ (Product Safety Representative)',
          'การชี้บ่งชิ้นส่วนที่เกี่ยวกับความปลอดภัย (Safety Characteristics / Critical Items)',
          'แผนตอบสนองต่อเหตุฉุกเฉินและกระบวนการแจ้งเตือนลูกค้ายามวิกฤต',
        ],
        sampleQuestions: [
          'องค์กรมีการแต่งตั้งตัวแทนความรับผิดชอบด้านความปลอดภัยของผลิตภัณฑ์ (PSB) หรือไม่ และมีกระบวนการควบคุมชิ้นส่วนความปลอดภัยอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายบริหารระดับสูง / QMR (Top Management)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'ฝ่ายบริหารระดับสูง (Management)',
      },
      {
        clause: '6.1.2.3',
        title: 'แผนฉุกเฉิน (Contingency plans)',
        englishTitle: 'Contingency plans',
        summary: 'ต้องจัดทำแผนฉุกเฉินเพื่อความต่อเนื่องในการส่งมอบผลิตภัณฑ์ เช่น กรณีไฟฟ้าดับ ขาดแคลนแรงงาน อุปกรณ์ชำรุด ภัยธรรมชาติ หรือการหยุดชะงักของซัพพลายเออร์หลัก',
        keyAuditingPoints: [
          'เอกสารแผนฉุกเฉิน (Contingency Plan)',
          'การจำลองทดสอบแผนฉุกเฉินประจำปี (Simulation Drill)',
          'ขั้นตอนการแจ้งลูกค้าหากเกิดเหตุฉุกเฉินที่อาจกระทบต่อการส่งมอบ',
        ],
        sampleQuestions: [
          'ขอดูแผนฉุกเฉิน (Contingency Plan) กรณีระบบเซิร์ฟเวอร์ล่ม ไฟดับ หรือเครื่องจักรหลักเสีย และผลการซ้อมแผนฉุกเฉินประจำปีล่าสุด',
        ],
        applicableDepartments: ['ฝ่ายบริหารระดับสูง / QMR (Top Management)', 'ฝ่ายผลิต (Production)', 'ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'ฝ่ายบริหารระดับสูง (Management)',
      },
    ],
  },

  // 2. ISO 9001:2015
  {
    id: 'ISO 9001:2015',
    name: 'ระบบบริหารงานคุณภาพ (Quality Management System)',
    code: 'ISO 9001',
    description: 'มาตรฐานระบบบริหารงานคุณภาพระดับสากล เพื่อสร้างความพึงพอใจของลูกค้าและพัฒนาอย่างต่อเนื่อง',
    color: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    clauses: [
      {
        clause: '4.1',
        title: 'ความเข้าใจในองค์กรและบริบทขององค์กร',
        englishTitle: 'Understanding the organization and its context',
        summary: 'องค์กรต้องกำหนดประเด็นภายในและภายนอกที่เกี่ยวข้องกับจุดประสงค์และทิศทางเชิงกลยุทธ์',
        keyAuditingPoints: ['SWOT Analysis หรือ PESTEL ล่าสุด', 'การทบทวนประเด็นอย่างสม่ำเสมอ', 'ความเชื่อมโยงกับนโยบายคุณภาพ'],
        sampleQuestions: [
          'องค์กรมีการกำหนดและทบทวนประเด็นภายในและภายนอกที่ส่งผลกระทบต่อระบบคุณภาพอย่างไร?',
          'มีหลักฐานการประชุมทบทวนบริบทองค์กรและปัจจัยเสี่ยงปีล่าสุดหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายบริหารระดับสูง / QMR (Top Management)'],
        isCore: true,
        category: 'บริบทองค์กร',
      },
      {
        clause: '5.1',
        title: 'ความเป็นผู้นำและความมุ่งมั่น',
        englishTitle: 'Leadership and commitment',
        summary: 'ผู้บริหารระดับสูงต้องแสดงความเป็นผู้นำและความมุ่งมั่นในการรับผิดชอบต่อประสิทธิผลของ QMS',
        keyAuditingPoints: ['การมีส่วนร่วมของฝ่ายบริหาร', 'การจัดสรรทรัพยากรที่เพียงพอ', 'การส่งเสริมวัฒนธรรมคุณภาพ'],
        sampleQuestions: [
          'ผู้บริหารระดับสูงมีการสื่อสารและผลักดันนโยบายคุณภาพและเป้าหมาย KPI สู่ระดับปฏิบัติการอย่างไร?',
          'มีการสนับสนุนทรัพยากรด้านบุคลากร งบประมาณ และเครื่องมือเพียงพอต่อการบรรลุเป้าหมายหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายบริหารระดับสูง / QMR (Top Management)'],
        isCore: true,
        category: 'ความเป็นผู้นำ',
      },
      {
        clause: '6.1',
        title: 'การดำเนินการเพื่อจัดการกับความเสี่ยงและโอกาส',
        englishTitle: 'Actions to address risks and opportunities',
        summary: 'ต้องกำหนดความเสี่ยงและโอกาสที่ต้องได้รับการจัดการเพื่อสร้างความมั่นใจว่า QMS บรรลุผลตามที่ตั้งใจ',
        keyAuditingPoints: ['ทะเบียนความเสี่ยง (Risk Register)', 'เกณฑ์ประเมินระดับความเสี่ยง', 'แผนจัดการความเสี่ยง (Mitigation Action)'],
        sampleQuestions: [
          'ฝ่ายของท่านมีขั้นตอนการระบุและประเมินความเสี่ยงในกระบวนการอย่างไร ขอดู Risk Assessment ฉบับล่าสุด',
          'ความเสี่ยงที่มีนัยสำคัญ มีมาตรการควบคุมและผู้รับผิดชอบชัดเจนหรือไม่ ประเมินประสิทธิผลอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายจัดซื้อและจัดหา (Procurement)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายบริหารระดับสูง / QMR (Top Management)'],
        isCore: true,
        category: 'การวางแผน',
      },
      {
        clause: '7.1.3',
        title: 'โครงสร้างพื้นฐาน (Infrastructure)',
        englishTitle: 'Infrastructure',
        summary: 'องค์กรต้องกำหนด จัดหา และบำรุงรักษาโครงสร้างพื้นฐานที่จำเป็นต่อการดำเนินงานของกระบวนการ',
        keyAuditingPoints: ['อาคารสถานที่ ระบบสาธารณูปโภค', 'แผนซ่อมบำรุงอาคารและระบบไฟฟ้า/แอร์', 'อุปกรณ์ฮาร์ดแวร์และซอฟต์แวร์'],
        sampleQuestions: [
          'มีแผนการตรวจสอบและบำรุงรักษาโครงสร้างพื้นฐาน ระบบไฟฟ้าสำรอง และระบบระบายอากาศอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายวิศวกรรมและซ่อมบำรุง (Engineering & Maintenance)', 'ฝ่ายเทคโนโลยีสารสนเทศ (IT & System)'],
        isCore: true,
        category: 'การสนับสนุน',
      },
      {
        clause: '7.1.5',
        title: 'ทรัพยากรในการเฝ้าระวังและการวัด (การสอบเทียบเครื่องมือวัด)',
        englishTitle: 'Monitoring and measuring resources',
        summary: 'เครื่องมือวัดที่ใช้ตรวจพิสูจน์ความสอดคล้องของผลิตภัณฑ์ต้องได้รับการสอบเทียบหรือทวนสอบตามช่วงเวลา',
        keyAuditingPoints: ['ทะเบียนเครื่องมือวัด (Master Equipment List)', 'ใบรับรองการสอบเทียบ (Calibration Certificate)', 'ป้ายระบุสถานะการสอบเทียบ (Sticker Status)'],
        sampleQuestions: [
          'ขอดูแผนการสอบเทียบเครื่องมือวัดประจำปี และหลักฐานการสอบเทียบเครื่องมือวัด 3 ชิ้นที่ใช้งานในไลน์ผลิตขณะนี้',
          'หากพบเครื่องมือวัดไม่ผ่านเกณฑ์การสอบเทียบ มีขั้นตอนกักกันผลิตภัณฑ์ที่วัดไปแล้วย้อนหลังอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'การสนับสนุน',
      },
      {
        clause: '7.2',
        title: 'ความสามารถ (Competency & Training)',
        englishTitle: 'Competence',
        summary: 'กำหนดความสามารถที่จำเป็นของบุคลากร และจัดให้มีการฝึกอบรมหรือดำเนินการอื่นเพื่อให้มีความสามารถ',
        keyAuditingPoints: ['เกณฑ์ความสามารถ (Job Description / Matrix)', 'แผนและบันทึกการอบรม (Training Record)', 'การประเมินประสิทธิผลการอบรม (Evaluation)'],
        sampleQuestions: [
          'มีเกณฑ์ประเมินทักษะความสามารถ (Competency Matrix) ของพนักงานในฝ่ายอย่างไร ขอดูของพนักงานใหม่และพนักงานปัจจุบัน 2 ท่าน',
          'เมื่อส่งพนักงานไปอบรม มีการประเมินประสิทธิผลหลังการอบรมอย่างไร มีบันทึกติดตามผลหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training)'],
        isCore: true,
        category: 'การสนับสนุน',
      },
      {
        clause: '7.5',
        title: 'ข้อมูลเอกสาร (Documented Information)',
        englishTitle: 'Documented information',
        summary: 'การสร้าง การปรับปรุง และการควบคุมข้อมูลเอกสารที่ QMS กำหนดให้มี',
        keyAuditingPoints: ['Master List of Documents', 'การควบคุมเวอร์ชันเอกสาร (Revision Control)', 'การป้องกันการนำเอกสารยกเลิกมาใช้งาน'],
        sampleQuestions: [
          'ขั้นตอนการควบคุมเอกสาร ขั้นตอนการแจกจ่าย และการยกเลิกเอกสารที่ล้าสมัยทำอย่างไร?',
          'สุ่มตรวจสอบเอกสาร WI/SOP ที่หน้างานเทียบกับบัญชีควบคุมเอกสารแม่แบบ ว่าตรงกับ Revision ล่าสุดหรือไม่',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายบริหารระดับสูง / QMR (Top Management)'],
        isCore: true,
        category: 'การสนับสนุน',
      },
      {
        clause: '8.2.1',
        title: 'การสื่อสารกับลูกค้าและการทบทวนข้อกำหนด (Customer Requirements)',
        englishTitle: 'Customer communication & Review of requirements',
        summary: 'ต้องมั่นใจว่าองค์กรมีความสามารถในการตอบสนองตามข้อกำหนดของลูกค้าก่อนตอบรับคำสั่งซื้อ',
        keyAuditingPoints: ['บันทึกการทบทวนสัญญา/ใบสั่งซื้อ (Contract Review)', 'การจัดการคำขอเปลี่ยนแปลงจากลูกค้า', 'การสำรวจความพึงพอใจของลูกค้า'],
        sampleQuestions: [
          'เมื่อได้รับใบสั่งซื้อ (PO) จากลูกค้า ฝ่ายขายมีขั้นตอนการทบทวนข้อกำหนดร่วมกับฝ่ายผลิตและจัดซื้ออย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายขายและการตลาด (Sales & Marketing)'],
        isCore: true,
        category: 'การปฏิบัติการ',
      },
      {
        clause: '8.4',
        title: 'การควบคุมกระบวนการ ผลิตภัณฑ์ และบริการที่จัดหาจากภายนอก (ฝ่ายจัดซื้อ)',
        englishTitle: 'Control of externally provided processes, products and services',
        summary: 'ต้องมั่นใจว่าผลิตภัณฑ์หรือบริการที่จัดหาจากภายนอกสอดคล้องตามข้อกำหนด รวมถึงการประเมินผู้ขาย (Supplier Evaluation)',
        keyAuditingPoints: ['Approved Vendor List (AVL)', 'เกณฑ์การคัดเลือกและประเมินผลงานผู้ขายประจำปี', 'PO / สัญญาซื้อขาย'],
        sampleQuestions: [
          'ขอดูทะเบียนผู้ขายที่ได้รับการรับรอง (Approved Vendor List) ฉบับล่าสุด และเกณฑ์การประเมินผู้ขายประจำปี',
          'สุ่มตรวจใบสั่งซื้อ (PO) 3 ฉบับ มีการระบุข้อกำหนดด้านคุณภาพชัดเจนและสั่งซื้อจากผู้ขายใน AVL หรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'จัดซื้อ (Procurement)',
      },
      {
        clause: '8.5.1',
        title: 'การควบคุมการผลิตและการบริการ (ฝ่ายผลิต/ปฏิบัติการ)',
        englishTitle: 'Control of production and service provision',
        summary: 'การผลิตต้องอยู่ภายใต้สภาวะที่มีการควบคุม รวมถึงมีเอกสารขั้นตอนทำงานและเครื่องมือที่เหมาะสม',
        keyAuditingPoints: ['เอกสารคำแนะนำการปฏิบัติงาน (Work Instruction)', 'บันทึกการผลิต (Production Log / Batch Record)', 'การควบคุมสภาวะแวดล้อมที่จำเป็น'],
        sampleQuestions: [
          'ในสายการผลิต มี Work Instruction หรือคู่มือการทำงานแสดงไว้ ณ จุดปฏิบัติงานหรือไม่ พนักงานปฏิบัติตามตรงกันหรือไม่?',
          'มีการบันทึกพารามิเตอร์การผลิตตามความถี่ที่กำหนดไว้ใน Control Plan หรือไม่ ขอดูบันทึกของกะล่าสุด',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.5.2',
        title: 'การชี้บ่งและการสอบกลับได้ (Identification & Traceability)',
        englishTitle: 'Identification and traceability',
        summary: 'ต้องชี้บ่งผลลัพธ์ด้วยวิธีการที่เหมาะสม และควบคุมการชี้บ่งสถานะการตรวจวัดตลอดกระบวนการ',
        keyAuditingPoints: ['ป้ายระบุล็อต (Lot / Batch Tag)', 'ป้ายสถานะ (Pass / Fail / Hold / รอตรวจ)', 'การทดสอบสอบกลับย้อนหลัง (Mock Recall/Traceability Test)'],
        sampleQuestions: [
          'วัตถุดิบและชิ้นงานระหว่างผลิต (WIP) มีการติดป้ายชี้บ่ง Lot No. และสถานะการตรวจคุณภาพชัดเจนอย่างไร?',
          'ขอดูการสุ่มทดสอบการสอบกลับได้ (Traceability Mock Test) ย้อนหลังจากสินค้าสำเร็จรูปกลับไปยังวัตถุดิบ ใช้เวลาเท่าไร?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)'],
        isCore: true,
        category: 'ฝ่ายผลิต (Production)',
      },
      {
        clause: '8.5.4',
        title: 'การถนอมรักษาผลิตภัณฑ์ (Preservation)',
        englishTitle: 'Preservation',
        summary: 'ต้องถนอมรักษาผลลัพธ์ในระหว่างการผลิตและการบริการ เพื่อให้มั่นใจถึงความสอดคล้องตามข้อกำหนด',
        keyAuditingPoints: ['การควบคุมสภาพแวดล้อมห้องเก็บสินค้า', 'การจัดเรียงและการป้องกันความเสียหาย', 'การหมุนเวียนสินค้า FIFO'],
        sampleQuestions: [
          'ในคลังสินค้า มีมาตรการป้องกันความเสียหาย สนิม หรือการปนเปื้อนของสินค้าอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)'],
        isCore: true,
        category: 'คลังสินค้า (Warehouse)',
      },
      {
        clause: '8.7',
        title: 'การควบคุมผลลัพธ์ที่ไม่เป็นไปตามข้อกำหนด (Nonconforming Outputs)',
        englishTitle: 'Control of nonconforming outputs',
        summary: 'ชี้บ่งและควบคุมผลิตภัณฑ์ที่ไม่เป็นไปตามข้อกำหนดเพื่อป้องกันการนำไปใช้หรือส่งมอบโดยไม่ตั้งใจ',
        keyAuditingPoints: ['พื้นที่กักกันสินค้าไม่ได้มาตรฐาน (Reject Area/Hold)', 'ป้ายสีแดง/Hold Tag', 'บันทึกการจัดการของเสีย (NCR Log)'],
        sampleQuestions: [
          'เมื่อพบชิ้นงาน NG หรือสินค้าไม่ได้มาตรฐาน มีขั้นตอนการกักกัน ชี้บ่ง และบันทึกลงฟอร์ม NCR อย่างไร?',
          'ขอดูพื้นที่จัดเก็บของเสีย (Reject Area) มีกุญแจล็อคหรือป้ายกักกันเพื่อป้องกันการหยิบผิดไปใช้หรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'ควบคุมคุณภาพ (QA/QC)',
      },
      {
        clause: '9.2',
        title: 'การตรวจประเมินภายใน (Internal Audit)',
        englishTitle: 'Internal audit',
        summary: 'ดำเนินการตรวจประเมินภายในตามช่วงเวลาที่วางแผนไว้ เพื่อให้ข้อมูลว่าระบบสอดคล้องตามข้อกำหนด',
        keyAuditingPoints: ['แผนตรวจประเมินประจำปี (Audit Program)', 'คุณสมบัติและความเป็นอิสระของผู้ตรวจ (Auditor Competence & Independence)', 'รายงานการตรวจและ CAR'],
        sampleQuestions: [
          'ขอดูแผนการตรวจประเมินภายในประจำปี และการคัดเลือกผู้ตรวจว่าไม่มีการตรวจงานในแผนกตนเอง (Independence) หรือไม่?',
          'ข้อบกพร่อง (NC) จากการตรวจครั้งก่อนได้รับการติดตามและปิดประเด็นตามกำหนดเวลาครบถ้วนหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายบริหารระดับสูง / QMR (Top Management)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'การประเมินสมรรถนะ',
      },
      {
        clause: '10.2',
        title: 'สิ่งที่ไม่เป็นไปตามข้อกำหนดและการปฏิบัติการแก้ไข (Nonconformity and corrective action)',
        englishTitle: 'Nonconformity and corrective action',
        summary: 'เมื่อเกิดสิ่งที่ไม่เป็นไปตามข้อกำหนด ต้องดำเนินการตอบสนอง ขจัดสาเหตุ และทบทวนประสิทธิผลของมาตรการแก้ไข',
        keyAuditingPoints: ['การวิเคราะห์สาเหตุที่แท้จริง (Root Cause - 5 Whys)', 'การกำหนดมาตรการป้องกันการเกิดซ้ำ (CAPA)', 'การติดตามประสิทธิผล (Effectiveness Verification)'],
        sampleQuestions: [
          'ขอดูบันทึกใบ CAR ล่าสุด มีการวิเคราะห์สาเหตุที่แท้จริงด้วยเครื่องมืออะไร (เช่น 5-Whys หรือผังก้างปลา)?',
          'Auditor หรือ QMR มีหลักฐานการตรวจประเมินประสิทธิผลหลังการแก้ไขอย่างไร ก่อนอนุมัติปิด CAR?',
        ],
        applicableDepartments: ['ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)', 'ฝ่ายผลิต (Production)', 'ฝ่ายจัดซื้อและจัดหา (Procurement)'],
        isCore: true,
        category: 'การปรับปรุง',
      },
    ],
  },

  // 3. ISO 14001:2015
  {
    id: 'ISO 14001:2015',
    name: 'ระบบการจัดการสิ่งแวดล้อม (Environmental Management System)',
    code: 'ISO 14001',
    description: 'มาตรฐานระบบการจัดการสิ่งแวดล้อม เพื่อควบคุมมลพิษ ลดผลกระทบ และปฏิบัติตามกฎหมายสิ่งแวดล้อม',
    color: 'teal',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    clauses: [
      {
        clause: '6.1.2',
        title: 'ลักษณะปัญหาสิ่งแวดล้อม (Environmental Aspects)',
        englishTitle: 'Environmental aspects',
        summary: 'กำหนดลักษณะปัญหาสิ่งแวดล้อมของกิจกรรม ผลิตภัณฑ์ และบริการที่สามารถควบคุมและมีอิทธิพลได้',
        keyAuditingPoints: ['ทะเบียนประเมิน Aspect & Impact', 'เกณฑ์ประเมินความมีนัยสำคัญ (Significant Aspect)', 'มาตรการควบคุมในสภาวะปกติ ผิดปกติ และฉุกเฉิน'],
        sampleQuestions: [
          'ฝ่ายของท่านมีการประเมินปัญหาสิ่งแวดล้อม (Aspect) ในสภาวะปกติ ผิดปกติ และฉุกเฉินอย่างไร?',
          'Aspect ที่มีนัยสำคัญ (Significant Aspect) ของฝ่ายมีอะไรบ้าง และมีแผนควบคุมอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'การวางแผนสิ่งแวดล้อม',
      },
      {
        clause: '6.1.3',
        title: 'ข้อผูกมัดการปฏิบัติตามกฎหมาย (Compliance Obligations)',
        englishTitle: 'Compliance obligations',
        summary: 'กำหนดและเข้าถึงข้อผูกมัดการปฏิบัติตามกฎหมายสิ่งแวดล้อมและข้อกำหนดอื่นที่เกี่ยวข้อง',
        keyAuditingPoints: ['ทะเบียนกฎหมายสิ่งแวดล้อม (Legal Register)', 'การประเมินความสอดคล้องตามกฎหมายประจำปี', 'ใบอนุญาตต่างๆ เช่น รง.4'],
        sampleQuestions: [
          'ขอดูทะเบียนกฎหมายสิ่งแวดล้อมล่าสุด และผลการประเมินความสอดคล้องตามกฎหมายของโรงงาน',
          'มีระบบติดตามกฎหมายสิ่งแวดล้อมฉบับใหม่ที่ประกาศในราชกิจจานุเบกษาอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)'],
        isCore: true,
        category: 'กฎหมายสิ่งแวดล้อม',
      },
      {
        clause: '8.1',
        title: 'การควบคุมการปฏิบัติการ (Operational Planning & Control)',
        englishTitle: 'Operational planning and control',
        summary: 'ควบคุมกระบวนการที่เกี่ยวข้องกับประเด็นสิ่งแวดล้อม เช่น กากของเสีย น้ำเสีย สารเคมี อากาศเสีย',
        keyAuditingPoints: ['การคัดแยกและจัดเก็บกากอุตสาหกรรม (ขยะอันตราย/ไม่อันตราย)', 'บ่อดักสารเคมีรั่วไหล (Secondary Containment)', 'ระบบบำบัดน้ำเสีย'],
        sampleQuestions: [
          'สารเคมีอันตรายที่จัดเก็บในคลังสินค้า มีเขื่อนกักเก็บสารเคมีรั่ว (Secondary Containment) เพียงพอตามกฎหมายหรือไม่?',
          'ขอดูใบกำกับการขนส่งของเสียอันตราย (กอ.1 / ใบกำกับ สก.) และใบอนุญาตผู้รับกำจัดของเสีย',
        ],
        applicableDepartments: ['ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)', 'ฝ่ายผลิต (Production)', 'ฝ่ายคลังสินค้าและโลจิสติกส์ (Warehouse & Logistics)'],
        isCore: true,
        category: 'การควบคุมสิ่งแวดล้อม',
      },
      {
        clause: '8.2',
        title: 'การเตรียมความพร้อมและการตอบสนองต่อเหตุฉุกเฉิน',
        englishTitle: 'Emergency preparedness and response',
        summary: 'จัดทำกระบวนการเตรียมความพร้อมและตอบสนองต่ออุบัติการณ์และเหตุฉุกเฉินด้านสิ่งแวดล้อม',
        keyAuditingPoints: ['แผนตอบโต้เหตุฉุกเฉิน (สารเคมีรั่วไหล ไฟไหม้ น้ำท่วม)', 'บันทึกการซ้อมแผนฉุกเฉินประจำปี', 'อุปกรณ์ดูดซับสารเคมี (Spill Kit)'],
        sampleQuestions: [
          'อุปกรณ์ดูดซับสารเคมีรั่วไหล (Spill Kit) ณ จุดจัดเก็บ มีความพร้อมใช้งานและพนักงานรู้วิธีใช้หรือไม่?',
          'ขอดูรายงานการซ้อมแผนสารเคมีหกรั่วไหลและแผนดับเพลิงประจำปีล่าสุด มีการสรุปบทเรียนและปรับปรุงแผนหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)', 'ฝ่ายผลิต (Production)'],
        isCore: true,
        category: 'เหตุฉุกเฉิน',
      },
    ],
  },

  // 4. ISO 45001:2018
  {
    id: 'ISO 45001:2018',
    name: 'ระบบการจัดการอาชีวอนามัยและความปลอดภัย (OH&S)',
    code: 'ISO 45001',
    description: 'มาตรฐานการจัดการความปลอดภัยและอาชีวอนามัย เพื่อป้องกันการบาดเจ็บและเจ็บป่วยจากการทำงาน',
    color: 'amber',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    clauses: [
      {
        clause: '5.4',
        title: 'การมีส่วนร่วมและการปรึกษาหารือของคนงาน (Consultation and Participation)',
        englishTitle: 'Consultation and participation of workers',
        summary: 'สร้างกระบวนการปรึกษาหารือและการมีส่วนร่วมของคนงานในทุกระดับและผู้แทนคนงานด้านความปลอดภัย',
        keyAuditingPoints: ['การประชุม คปอ. ประจำเดือน', 'รายงานการตรวจความปลอดภัยของ คปอ.', 'ช่องทางแจ้งข้อเสนอแนะความปลอดภัย (Near Miss / Hazard Hunting)'],
        sampleQuestions: [
          'ขอดูรายงานการประชุมคณะกรรมการความปลอดภัย อาชีวอนามัย (คปอ.) ย้อนหลัง 3 เดือน มีการติดตามข้อร้องเรียนหรือไม่?',
          'พนักงานมีช่องทางในการรายงานเหตุเกือบเกิดอุบัติเหตุ (Near Miss) อย่างไร มีสถิติและการแก้ไขอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)', 'ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training)'],
        isCore: true,
        category: 'การมีส่วนร่วม',
      },
      {
        clause: '6.1.2',
        title: 'การชี้บ่งอันตรายและการประเมินความเสี่ยงด้าน OH&S',
        englishTitle: 'Hazard identification and assessment of risks',
        summary: 'กำหนดกระบวนการชี้บ่งอันตรายอย่างต่อเนื่องและประเมินความเสี่ยงด้าน OH&S จากอันตรายที่ระบุ',
        keyAuditingPoints: ['Job Safety Analysis (JSA / HIRARC)', 'การควบคุมตามหลักลำดับขั้นการควบคุม (Hierarchy of Controls)', 'การประเมินความเสี่ยงงานความเสี่ยงสูง (Work at height, Hot work)'],
        sampleQuestions: [
          'ขอดูเอกสารการชี้บ่งอันตรายและประเมินความเสี่ยง (JSA/HIRARC) ของแผนก ขอดูการควบคุมจุดอันตรายเครื่องจักร',
          'งานที่มีความเสี่ยงสูง เช่น งานประกายไฟ (Hot work) หรืองานที่สูง มีระบบใบอนุญาตทำงาน (Permit to Work - PTW) หรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)', 'ฝ่ายผลิต (Production)', 'ฝ่ายวิศวกรรมและซ่อมบำรุง (Engineering & Maintenance)'],
        isCore: true,
        category: 'การประเมินความเสี่ยง',
      },
      {
        clause: '8.1.4',
        title: 'การจัดซื้อและการควบคุมผู้รับเหมา (Contractors & Outsourcing)',
        englishTitle: 'Procurement - Contractors',
        summary: 'ประสานงานและควบคุมกระบวนการจัดซื้อกับผู้รับเหมา เพื่อประเมินและควบคุมความเสี่ยงด้าน OH&S',
        keyAuditingPoints: ['ระเบียบความปลอดภัยสำหรับผู้รับเหมา (Contractor Safety Rule)', 'การอบรมความปลอดภัยก่อนเข้าปฏิบัติงาน', 'การตรวจประเมินความปลอดภัยหน้างานผู้รับเหมา'],
        sampleQuestions: [
          'ผู้รับเหมาภายนอกที่เข้ามาทำงานซ่อมบำรุงในโรงงาน มีขั้นตอนการอบรมความปลอดภัยและตรวจอุปกรณ์ PPE อย่างไร?',
          'มีหลักฐานการตรวจสอบและใบอนุญาตเข้าทำงานของผู้รับเหมาในโครงการล่าสุดหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายจัดซื้อและจัดหา (Procurement)', 'ฝ่ายความปลอดภัยและสิ่งแวดล้อม (Safety & EHS)'],
        isCore: true,
        category: 'ผู้รับเหมา',
      },
    ],
  },

  // 5. ISO/IEC 27001:2022
  {
    id: 'ISO/IEC 27001:2022',
    name: 'ระบบบริหารจัดการความมั่นคงปลอดภัยสารสนเทศ (ISMS)',
    code: 'ISO 27001',
    description: 'มาตรฐานความมั่นคงปลอดภัยสารสนเทศ การคุ้มครองข้อมูล ความลับ ความถูกต้อง และความพร้อมใช้งาน (CIA)',
    color: 'indigo',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    clauses: [
      {
        clause: 'A.5.15',
        title: 'การควบคุมการเข้าถึง (Access Control)',
        englishTitle: 'Access control',
        summary: 'การควบคุมการเข้าถึงข้อมูลและทรัพย์สินสารสนเทศตามหลัก Need-to-know และ Least privilege',
        keyAuditingPoints: ['นโยบายสิทธิ์การเข้าถึง (Access Policy)', 'การทบทวนสิทธิ์ผู้ใช้งานประจำปี/ครึ่งปี (User Access Review)', 'การยกเลิกสิทธิ์ทันทีเมื่อพนักงานลาออก'],
        sampleQuestions: [
          'มีกระบวนการทบทวนสิทธิ์การเข้าถึงระบบสารสนเทศ (User Access Review) อย่างไร ขอดูบันทึกการทบทวนล่าสุด',
          'สุ่มตรวจสอบรายชื่อพนักงานที่ลาออกในรอบ 3 เดือน ว่าได้ระงับสิทธิ์เข้าถึงระบบ Email และ ERP ทันทีหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายเทคโนโลยีสารสนเทศ (IT & System)', 'ฝ่ายทรัพยากรบุคคลและฝึกอบรม (HR & Training)'],
        isCore: true,
        category: 'การควบคุมการเข้าถึง',
      },
      {
        clause: 'A.8.13',
        title: 'การสำรองข้อมูล (Information Backup)',
        englishTitle: 'Information backup',
        summary: 'สำรองข้อมูลและซอฟต์แวร์ และทดสอบการกู้คืนเป็นประจำตามนโยบายการสำรองข้อมูลที่กำหนด',
        keyAuditingPoints: ['ตารางสำรองข้อมูล (Daily / Weekly / Monthly)', 'การเก็บข้อมูลสำรองนอกสถานที่ (Off-site / Cloud)', 'บันทึกการทดสอบกู้คืนข้อมูล (Restore Test)'],
        sampleQuestions: [
          'ขอดูแผนการสำรองข้อมูลฐานข้อมูลหลัก และผลการทดสอบกู้คืนข้อมูล (Restore Drill) ครั้งล่าสุด',
          'ข้อมูลสำรองมีการเข้ารหัส (Encryption) และทดสอบความสมบูรณ์อย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายเทคโนโลยีสารสนเทศ (IT & System)'],
        isCore: true,
        category: 'การสำรองข้อมูล',
      },
    ],
  },

  // 6. GHPs / HACCP
  {
    id: 'GHPs / HACCP',
    name: 'หลักเกณฑ์สุขลักษณะที่ดีและการวิเคราะห์จุดวิกฤตความปลอดภัยอาหาร',
    code: 'GHPs/HACCP',
    description: 'มาตรฐานความปลอดภัยอาหารสำหรับอุตสาหกรรมแปรรูปอาหารและเครื่องดื่ม',
    color: 'rose',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    clauses: [
      {
        clause: 'PRP-2',
        title: 'การทำความสะอาดและการฆ่าเชื้อ (Cleaning & Sanitation)',
        englishTitle: 'Cleaning and sanitation',
        summary: 'กำหนดขั้นตอนและตารางทำความสะอาดอุปกรณ์ สภาพแวดล้อม และการตรวจสวอบเชื้อ (Swab Test)',
        keyAuditingPoints: ['Cleaning Matrix (SSOP)', 'บันทึกการตรวจสอบความสะอาด (ATP Swab / Pre-op Check)', 'การจัดเก็บอุปกรณ์ทำความสะอาด'],
        sampleQuestions: [
          'ขอดูแผนผังการทำความสะอาดเครื่องจักรและสายการผลิต (SSOP) และผลการตรวจเชื้อ Swab Test ย้อนหลัง 1 เดือน',
          'สารเคมีทำความสะอาดที่ใช้เป็น Food Grade และมีเอกสารรับรอง MSDS ครบถ้วนหรือไม่?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'สุขลักษณะ',
      },
      {
        clause: 'CCP-Mon',
        title: 'การเฝ้าระวังจุดวิกฤตที่ต้องควบคุม (CCP Monitoring)',
        englishTitle: 'CCP Monitoring and Corrective Actions',
        summary: 'ติดตามและบันทึกค่าวิกฤต (Critical Limits) เช่น อุณหภูมิ เวลา และการจัดการเมื่อหลุดเกณฑ์วิกฤต',
        keyAuditingPoints: ['ใบระบุจุดวิกฤต HACCP Plan', 'บันทึกการตรวจสอบอุณหภูมิ/เวลาของ CCP', 'ขั้นตอนการกักกันสินค้าเมื่อค่าหลุดเกณฑ์'],
        sampleQuestions: [
          'ที่จุดตรวจจับโลหะ (Metal Detector CCP) มีการทบทวนความไวด้วย Test Piece ทุกกี่ชั่วโมง ขอดูบันทึกวันนี้',
          'เมื่อพบว่าเครื่องหมายเตือนมีปัญหา มีขั้นตอนกักกันผลิตภัณฑ์ย้อนหลังไปถึงจุดตรวจครั้งก่อนอย่างไร?',
        ],
        applicableDepartments: ['ฝ่ายผลิต (Production)', 'ฝ่ายควบคุมและประกันคุณภาพ (QA/QC)'],
        isCore: true,
        category: 'จุดวิกฤต HACCP',
      },
    ],
  },
];

/**
 * Intelligent Department-to-Clause Matrix Helper
 * Returns all clauses applicable to a given department under a specific standard
 */
export function getDepartmentClauses(
  standardId: StandardType,
  departmentName: string
): {
  coreClauses: StandardClause[];
  supportingClauses: StandardClause[];
  allRelevantClauses: StandardClause[];
} {
  const std = STANDARDS_DATA.find((s) => s.id === standardId);
  if (!std) {
    return { coreClauses: [], supportingClauses: [], allRelevantClauses: [] };
  }

  // Exact or partial match on department name (e.g. "ฝ่ายจัดซื้อและจัดหา" matches "ฝ่ายจัดซื้อ")
  const normDept = departmentName.toLowerCase();

  const coreClauses: StandardClause[] = [];
  const supportingClauses: StandardClause[] = [];

  std.clauses.forEach((c) => {
    const isDeptMatch = c.applicableDepartments?.some((d) => {
      const normD = d.toLowerCase();
      return normDept.includes(normD) || normD.includes(normDept);
    });

    if (isDeptMatch) {
      if (c.isCore) {
        coreClauses.push(c);
      } else {
        supportingClauses.push(c);
      }
    }
  });

  // If no direct matches found (e.g. general clauses), provide general relevant clauses
  const allRelevantClauses = [...coreClauses, ...supportingClauses];

  return {
    coreClauses,
    supportingClauses,
    allRelevantClauses: allRelevantClauses.length > 0 ? allRelevantClauses : std.clauses,
  };
}

/**
 * Provides a departmental audit scope guidance card
 */
export function getDepartmentScopeGuidance(
  standardId: StandardType,
  departmentName: string
): {
  scopeTitle: string;
  scopeSummary: string;
  mandatoryClauses: string[];
  keyAuditFocus: string[];
} {
  if (standardId === 'IATF 16949:2016' && departmentName.includes('จัดซื้อ')) {
    return {
      scopeTitle: 'ขอบข่ายการตรวจประเมินฝ่ายจัดซื้อตามมาตรฐาน IATF 16949:2016',
      scopeSummary: 'ต้องครอบคลุมการคัดเลือกผู้ส่งมอบ (8.4.1.2), ผู้ขายที่ลูกค้ากำหนด (8.4.1.3), การควบคุมความเสี่ยง (8.4.2.1), กฎหมายสารเคมี/ชิ้นส่วน (8.4.2.2), การพัฒนา QMS ผู้ขาย (8.4.2.3), การติดตามผลงาน PPM & Premium Freight (8.4.2.4), การตรวจบุคคลที่สอง (8.4.2.4.1), การพัฒนาผู้ขาย (8.4.2.5), และการส่งต่อข้อกำหนดลูกค้า CSR (8.4.3.1)',
      mandatoryClauses: ['8.4.1.2', '8.4.1.3', '8.4.2.1', '8.4.2.2', '8.4.2.3', '8.4.2.4', '8.4.2.4.1', '8.4.2.5', '8.4.3.1'],
      keyAuditFocus: [
        'ทะเบียน Approved Vendor List (AVL) และสถานะใบรับรอง ISO 9001 / IATF 16949',
        'รายงานตัวชี้วัด PPM ผู้ส่งมอบรายเดือน และการจัดการค่าขนส่งพิเศษ (Premium freight)',
        'รายงานการตรวจประเมินโรงงานผู้ส่งมอบ (Second-party audit report)',
        'การระบุข้อกำหนดเฉพาะลูกค้า (CSR) และลักษณะเฉพาะพิเศษในใบสั่งซื้อ (PO)',
      ],
    };
  }

  if (standardId === 'IATF 16949:2016' && departmentName.includes('ผลิต')) {
    return {
      scopeTitle: 'ขอบข่ายการตรวจประเมินฝ่ายผลิตตามมาตรฐาน IATF 16949:2016',
      scopeSummary: 'ต้องครอบคลุมแผนควบคุม (8.5.1.1), งานมาตรฐานและคำแนะนำหน้างาน (8.5.1.2), การตรวจชิ้นงานชิ้นแรก/ชิ้นสุดท้าย (8.5.1.3), การบำรุงรักษา TPM (8.5.1.5), การสอบกลับได้ (8.5.2.1), การจัดการการเปลี่ยนแปลง 4M (8.5.6.1), และการควบคุมของเสีย (8.7.1.1)',
      mandatoryClauses: ['8.5.1.1', '8.5.1.2', '8.5.1.3', '8.5.1.5', '8.5.2.1', '8.5.6.1'],
      keyAuditFocus: [
        'Control Plan ตรงกับการปฏิบัติจริงหน้างานและการตอบสนองเมื่อผิดปกติ (Reaction Plan)',
        'บันทึก First-piece inspection ทุกครั้งที่มีการ Setup เครื่องจักรใหม่',
        'การชี้บ่ง Lot No. และการสุ่มทดสอบการสอบกลับได้ (Traceability Mock Test)',
        'กระบวนการจัดการการเปลี่ยนแปลง 4M (Man, Machine, Material, Method)',
      ],
    };
  }

  if (departmentName.includes('จัดซื้อ')) {
    return {
      scopeTitle: `ขอบข่ายการตรวจประเมินฝ่ายจัดซื้อตามมาตรฐาน ${standardId}`,
      scopeSummary: 'ครอบคลุมกระบวนการคัดเลือกและประเมินผู้ขาย (AVL), การออกใบสั่งซื้อ (PO), การส่งต่อข้อกำหนดคุณภาพ, และการติดตามผลการส่งมอบ',
      mandatoryClauses: ['8.4'],
      keyAuditFocus: [
        'ทะเบียนผู้ขายที่ได้รับการรับรอง (Approved Vendor List - AVL)',
        'เกณฑ์การคัดเลือกและประเมินผลงานผู้ขายประจำปี',
        'ความถูกต้องของใบสั่งซื้อ (PO) และการสั่งซื้อเฉพาะผู้ขายใน AVL',
      ],
    };
  }

  return {
    scopeTitle: `ขอบข่ายการตรวจประเมิน ${departmentName} (${standardId})`,
    scopeSummary: 'ตรวจประเมินความสอดคล้องตามข้อกำหนดของกระบวนการ การควบคุมเอกสาร และการประเมินความเสี่ยงที่เกี่ยวข้อง',
    mandatoryClauses: [],
    keyAuditFocus: [
      'ขั้นตอนการปฏิบัติงาน (SOP / WI) ที่เป็นปัจจุบัน',
      'บันทึกหลักฐานเชิงประจักษ์ในการปฏิบัติงานจริง',
      'การติดตามตัวชี้วัดผลการดำเนินงาน (KPIs) ของแผนก',
    ],
  };
}
