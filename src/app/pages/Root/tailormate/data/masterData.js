// ── POS Bill simulation data ──────────────────────────────────────────────────
export const POS_BILLS = [
  {
    billNo: "POS-2526-0041", billDate: "2026-06-05",
    customerName: "Rajesh Kumar Sharma", customerPhone: "9876543210",
    customerEmail: "rajesh.sharma@gmail.com", salesman: "Amit Singh",
    totalAmount: 18500,
    items: [
      { id: 1, itemCode: "FAB-KH-001", description: "Cotton Kurta Fabric – White",  qty: 2.5, unit: "Mtr", rate: 480,  amount: 1200, category: "Fabric" },
      { id: 2, itemCode: "RDY-SH-021", description: "Linen Formal Shirt – Blue (L)", qty: 2,   unit: "Pcs", rate: 2200, amount: 4400, category: "Readymade" },
      { id: 3, itemCode: "FAB-SL-009", description: "Silk Saree Fabric – Maroon",   qty: 5.5, unit: "Mtr", rate: 1200, amount: 6600, category: "Fabric" },
      { id: 4, itemCode: "RDY-TRO-005","description": "Cotton Trousers – Grey (32)", qty: 1,   unit: "Pcs", rate: 1800, amount: 1800, category: "Readymade" },
      { id: 5, itemCode: "FAB-WL-003", description: "Woolen Blazer Fabric – Navy",  qty: 3.0, unit: "Mtr", rate: 1500, amount: 4500, category: "Fabric" },
    ],
  },
  {
    billNo: "POS-2526-0042", billDate: "2026-06-06",
    customerName: "Priya Devi Patel", customerPhone: "9823456780",
    customerEmail: "priya.patel@yahoo.com", salesman: "Sunita Rao",
    totalAmount: 14200,
    items: [
      { id: 1, itemCode: "FAB-BL-012", description: "Banarasi Brocade – Gold Border", qty: 4.0, unit: "Mtr", rate: 1800, amount: 7200, category: "Fabric" },
      { id: 2, itemCode: "FAB-CT-007", description: "Cotton Churidar Fabric – Pink",  qty: 3.0, unit: "Mtr", rate: 650,  amount: 1950, category: "Fabric" },
      { id: 3, itemCode: "RDY-KRN-002","description": "Designer Kurti – Yellow (M)",  qty: 2,   unit: "Pcs", rate: 1850, amount: 3700, category: "Readymade" },
      { id: 4, itemCode: "ACC-BTN-001","description": "Designer Buttons Set – Gold",  qty: 3,   unit: "Set", rate: 450,  amount: 1350, category: "Accessories" },
    ],
  },
  {
    billNo: "POS-2526-0043", billDate: "2026-06-07",
    customerName: "Mohammed Iqbal Khan", customerPhone: "9765432109",
    customerEmail: "iqbal.khan@hotmail.com", salesman: "Ravi Verma",
    totalAmount: 22750,
    items: [
      { id: 1, itemCode: "FAB-SH-015", description: "Sherwani Fabric – Cream Zari",        qty: 4.5, unit: "Mtr", rate: 2200, amount: 9900, category: "Fabric" },
      { id: 2, itemCode: "FAB-KB-004", description: "Khadi Fabric – White",                qty: 6.0, unit: "Mtr", rate: 380,  amount: 2280, category: "Fabric" },
      { id: 3, itemCode: "RDY-KTA-008","description": "Ready Kurta Pajama Set – White (XL)",qty: 2, unit: "Set", rate: 3200, amount: 6400, category: "Readymade" },
      { id: 4, itemCode: "FAB-JC-010", description: "Jacquard Fabric – Blue",              qty: 2.0, unit: "Mtr", rate: 1085, amount: 2170, category: "Fabric" },
      { id: 5, itemCode: "ACC-ZP-002", description: "Metal Zipper – 12 inch",              qty: 10,  unit: "Pcs", rate: 200,  amount: 2000, category: "Accessories" },
    ],
  },
  {
    billNo: "POS-2526-0044", billDate: "2026-06-08",
    customerName: "Sunita Ramesh Joshi", customerPhone: "9654321098",
    customerEmail: "sunita.joshi@gmail.com", salesman: "Amit Singh",
    totalAmount: 9800,
    items: [
      { id: 1, itemCode: "FAB-GT-011", description: "Georgette Fabric – Purple",  qty: 3.5, unit: "Mtr", rate: 950,  amount: 3325, category: "Fabric" },
      { id: 2, itemCode: "FAB-CN-006", description: "Chiffon Net Fabric – Red",   qty: 2.0, unit: "Mtr", rate: 720,  amount: 1440, category: "Fabric" },
      { id: 3, itemCode: "RDY-LH-003", description: "Lehenga Set – Pink (S)",     qty: 1,   unit: "Set", rate: 4500, amount: 4500, category: "Readymade" },
      { id: 4, itemCode: "ACC-TP-003", description: "Tassel & Pom Pom Set",       qty: 2,   unit: "Set", rate: 267,  amount: 534,  category: "Accessories" },
    ],
  },
];

// ── Work type catalogue ────────────────────────────────────────────────────────
export const WORK_TYPES = {
  Fabric: [
    { id: "F01", name: "Stitching – Kurta",              charge: 350  },
    { id: "F02", name: "Stitching – Salwar / Churidar",  charge: 200  },
    { id: "F03", name: "Stitching – Blouse",             charge: 250  },
    { id: "F04", name: "Stitching – Saree Fall & Pico",  charge: 150  },
    { id: "F05", name: "Stitching – Sherwani",           charge: 1200 },
    { id: "F06", name: "Stitching – Blazer / Coat",      charge: 900  },
    { id: "F07", name: "Stitching – Trouser / Pant",     charge: 300  },
    { id: "F08", name: "Stitching – Lehenga",            charge: 800  },
    { id: "F09", name: "Embroidery Work",                charge: 500  },
    { id: "F10", name: "Lining Work",                    charge: 200  },
  ],
  Readymade: [
    { id: "R01", name: "Alteration – Shorten / Lengthen", charge: 100 },
    { id: "R02", name: "Alteration – Waist Size In/Out",  charge: 150 },
    { id: "R03", name: "Alteration – Sleeve Size",        charge: 120 },
    { id: "R04", name: "Alteration – Neck / Collar",      charge: 180 },
    { id: "R05", name: "Alteration – Chest Size",         charge: 200 },
    { id: "R06", name: "Alteration – Hip Size",           charge: 150 },
    { id: "R07", name: "Repair – Button Fix",             charge: 50  },
    { id: "R08", name: "Repair – Zipper Replace",         charge: 120 },
    { id: "R09", name: "Repair – Torn / Rip Fix",         charge: 150 },
    { id: "R10", name: "Repair – Lining Replace",         charge: 300 },
  ],
  Accessories: [
    { id: "A01", name: "Button Attachment",      charge: 30  },
    { id: "A02", name: "Zipper Installation",    charge: 100 },
    { id: "A03", name: "Embellishment Fixing",   charge: 80  },
  ],
};

// ── Tailors master ─────────────────────────────────────────────────────────────
export const TAILORS = [
  { id: "T01", name: "Mohan Lal",    speciality: "Gents Wear",         available: true  },
  { id: "T02", name: "Lalitha Bai",  speciality: "Ladies Wear",        available: true  },
  { id: "T03", name: "Ranjit Das",   speciality: "Sherwani & Ethnic",  available: false },
  { id: "T04", name: "Meena Kumari", speciality: "Blouse & Saree",     available: true  },
  { id: "T05", name: "Suresh Yadav", speciality: "Alteration & Repair",available: true  },
];

// ── Measurement templates ──────────────────────────────────────────────────────
export const MEASURE_FIELDS = {
  Gents: [
    "Chest","Waist","Hip","Shoulder","Sleeve Length","Body Length",
    "Neck","Thigh","Knee","Bottom",
  ],
  Ladies: [
    "Chest / Bust","Waist","Hip","Shoulder","Sleeve Length","Body Length",
    "Neck","Arm Hole","Blouse Length","Lehenga Length",
  ],
  Saree: [
    "Blouse Length","Chest / Bust","Waist","Hip",
    "Sleeve Length","Neck Depth Front","Neck Depth Back",
  ],
};

// ── Order status flow ──────────────────────────────────────────────────────────
export const STATUS_FLOW = ["Pending","In Progress","Ready","Delivered"];

export const STATUS_META = {
  Pending:      { color: "amber",  icon: "⏳" },
  "In Progress":{ color: "blue",   icon: "✂️" },
  Ready:        { color: "green",  icon: "✅" },
  Delivered:    { color: "teal",   icon: "📦" },
};
