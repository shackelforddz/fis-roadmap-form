export type PriorityKey = "A" | "B" | "C" | "D" | "E" | "F";

export type QuestionType = "open" | "single" | "multi";

export interface Option {
  value: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: Option[];
  allowWriteIn?: boolean;
  placeholder?: string;
}

export interface PrioritySection {
  key: PriorityKey;
  label: string;
  questions: Question[];
}

export const NAME_QUESTION: Question = {
  id: "name",
  type: "open",
  prompt: "What is your name?",
  placeholder: "Your name",
};

export const ROLE_QUESTION: Question = {
  id: "role",
  type: "open",
  prompt: "What is your role?",
  placeholder: "e.g. Loan Officer, Operations Manager, Admin",
};

export const EMPLOYER_QUESTION: Question = {
  id: "employer",
  type: "open",
  prompt: "Who do you work for?",
  placeholder: "Your company or institution",
};

export const PRIORITIES_QUESTION: Question = {
  id: "priorities",
  type: "multi",
  prompt: "What are your highest priorities?",
  allowWriteIn: true,
  options: [
    { value: "A", label: "Clean up your data" },
    {
      value: "B",
      label: "Surface data from other FIS products to customers",
    },
    { value: "C", label: "Move money around seamlessly" },
    { value: "D", label: "Win complex deals" },
    {
      value: "E",
      label: "Reduce switching between the CLS platform and the portal",
    },
    { value: "F", label: "Capital velocity (OTD)" },
  ],
};

export const PRIORITY_SECTIONS: PrioritySection[] = [
  {
    key: "A",
    label: "Clean up your data",
    questions: [
      {
        id: "A1",
        type: "single",
        prompt:
          "If you could bulk edit and purge your own data, would your primary goal be to eliminate manual updates, or to finally clean up data that is slowing down your system performance/reporting and/or to meet regulatory requirements?",
        options: [
          {
            value: "A1a",
            label: "Eliminate manual updates",
            description:
              "Upload Excel files to update a multitude of records in the CLS Portal with a more reasonable cost structure.",
          },
          {
            value: "A1b",
            label: "Greater self-sufficiency for system hygiene & compliance",
            description:
              "Delete outdated or unnecessary purge records from the system.",
          },
        ],
      },
      {
        id: "A2",
        type: "open",
        prompt:
          "Are there any other data management tasks that force your team to step outside of CLS into a spreadsheet or a manual process?",
      },
    ],
  },
  {
    key: "B",
    label: "Surface data from other FIS products",
    questions: [
      {
        id: "B1",
        type: "single",
        prompt:
          "If you had to choose a single source of truth for a customer's real-time financial picture, would you prioritize a seamless flow into the Core (Horizon, IBS, etc), the Treasury and Cash Management view for your Corporate clients (D1 Business), or the ability to bridge the gap between complex corporate treasury needs and a modern digital first experience (D1C)?",
        options: [
          {
            value: "B1a",
            label: "Universal online banker platform",
            description:
              "Provide a universal online banker platform with the ability to handle complex payments, liquidity management and composable banking.",
          },
          {
            value: "B1b",
            label: "Unified view for small business owners",
            description:
              "Small business owners who have both personal and business accounts can see everything in one place.",
          },
          {
            value: "B1c",
            label: "Native collateral linkage in the Core",
            description:
              "When a loan officer looks at a customer record, the collateral (real estate, inventory, UCC filings) is natively linked.",
          },
        ],
      },
      {
        id: "B2",
        type: "open",
        prompt:
          "Are there any other key data points or insights missing from your or your customer's experience?",
      },
      {
        id: "B3",
        type: "open",
        prompt:
          "Let's say that source of truth is fully established. What is the first new capability or service you'd offer your customers that is currently impossible due to data lag?",
      },
    ],
  },
  {
    key: "C",
    label: "Move money around seamlessly",
    questions: [
      {
        id: "C1",
        type: "multi",
        prompt:
          "Which of these features would save your team the most work around time (and Excel tabs) today?",
        options: [
          {
            value: "C1a",
            label: "Reference Repayment",
            description:
              "Configure amortization logic (e.g. seasonal fluctuations, step rates) and modify schedules mid-lifecycle, within the platform.",
          },
          {
            value: "C1i",
            label: "Syndication Portal Improvements: Admin Details",
            description:
              "Refined/centralized admin details for borrowers, agents, and lenders.",
          },
          {
            value: "C1j",
            label: "Syndication Portal Improvements: Custom Spreading",
            description:
              "Provide custom spreading support (i.e., blanket, pro-rata, etc).",
          },
          {
            value: "C1c",
            label: "Value Added Tax and/or Withholding Tax",
            description:
              "Automate the identification, calculation, and withholding requirements for interest and fee payments based on the lender's and borrower's jurisdictions.",
          },
          {
            value: "C1d",
            label: "Payoffs",
            description:
              "Generate, quote, and execute full or partial loan payoffs within the platform.",
          },
          {
            value: "C1e",
            label: "Reverse Payments",
            description: "Reverse payments from transaction history.",
          },
          {
            value: "C1f",
            label: "Unbill Workflow",
            description:
              "Fix an unpaid invoice with the wrong date or a paid invoice with the wrong rate.",
          },
          {
            value: "C1g",
            label: "Unscheduled Payments and Cash Flow",
            description:
              "A guided flow for creating a loan transaction from a Loan within the platform.",
          },
          {
            value: "C1b",
            label: "Syndication Portal Improvements",
            description:
              "Provide custom spreading support (currently only blanket spreading) and admin detail support.",
          },
          {
            value: "C1h",
            label: "Funds transfer parity",
            description:
              "Ensure all related screens and/or features are accessible within the CLS Portal.",
          },
        ],
      },
      {
        id: "C2",
        type: "open",
        prompt:
          "Are there any other payment management tasks that force your team to step outside of CLS into a spreadsheet or a manual process?",
      },
    ],
  },
  {
    key: "D",
    label: "Win complex deals",
    questions: [
      {
        id: "D1",
        type: "single",
        prompt:
          "When it comes to Syndications or specialized lending like Asset Based Lending, is your biggest bottleneck the lack of integration between systems, the learning curve for your staff to manage these structures correctly, or critical specialized tasks being trapped in legacy systems?",
        options: [
          {
            value: "D1a",
            label: "Lack of integration between systems",
            description:
              "Between holdings and amendments, supply chain financing, and asset finance.",
          },
          {
            value: "D1b",
            label: "Steep learning curve to manage complex deals",
            description:
              "Including actions like creating & maintaining asset-based lending structures and adding real estate collateral.",
          },
          {
            value: "D1c",
            label: "Critical specialized tasks trapped in legacy systems",
            description:
              "SBA, Escrow, Custom Spreading — trapped in legacy systems or lacking the flexibility needed for modern servicing.",
          },
        ],
      },
      {
        id: "D2",
        type: "open",
        prompt: "Are there any other notable bottlenecks for specialized lending?",
      },
    ],
  },
  {
    key: "E",
    label: "Reduce platform switching",
    questions: [
      {
        id: "E1",
        type: "multi",
        prompt:
          "What must the CLS portal have that the classic platform offered for you to switch to using the portal solely?",
        allowWriteIn: true,
        options: [
          {
            value: "E1a",
            label: "Field Label Changes",
            description:
              "Let System Admins rename fields on a screen, as they can in classic CLS.",
          },
          {
            value: "E1d",
            label: "Assignment/Transfer processing",
          },
          {
            value: "E1e",
            label: "Escrow in the CLS Portal",
            description:
              "Bring the Classic CLS capabilities for Escrow to the CLS Portal and enhance the experience to support single-item escrow.",
          },
          {
            value: "E1f",
            label: "Additional SBA features in the CLS Portal",
            description:
              "In addition to the SBA card on loans, there are other SBA related features in Classic CLS that need to be brought into the CLS Portal.",
          },
          {
            value: "E1g",
            label: "Collateral",
          },
          {
            value: "E1b",
            label: "Facility transaction history and running balance",
            description: "View these within the portal.",
          },
          {
            value: "E1c",
            label: "Notes and document attachments in the portal",
            description:
              "Bring the existing notes and document attachment capabilities into the CLS Portal.",
          },
        ],
      },
      {
        id: "E2",
        type: "open",
        prompt:
          "Are there any other reasons you switch back and forth between the CLS platform and the portal today?",
      },
    ],
  },
  {
    key: "F",
    label: "Capital velocity",
    questions: [
      {
        id: "F1",
        type: "single",
        prompt:
          "Which of these three features addresses the most significant leakage in your current workflow: is it the speed of capital recycling, the ability to win complex deal mandates, or the cost of manual data reconciliation?",
        options: [
          {
            value: "F1a",
            label: "Assignment Manager",
            description: "Increases secondary market velocity and capital recycling.",
          },
          {
            value: "F1b",
            label: "Trade & Distribution Manager",
            description:
              "Supports complex, non-standard private credit distributions.",
          },
          {
            value: "F1c",
            label: "Syndtrak Integration",
            description: "Ensures data integrity across the multi-platform ecosystem.",
          },
        ],
      },
      {
        id: "F2",
        type: "open",
        prompt:
          "Are there any other capital velocity bottlenecks you'd want addressed?",
      },
    ],
  },
];

export const WRAP_UP_QUESTION: Question = {
  id: "wrap_up",
  type: "open",
  prompt:
    "If your team had a landing page within CLS, what functionality or information would they favorite on it?",
};

export const PRIORITY_SECTION_BY_KEY: Record<PriorityKey, PrioritySection> =
  PRIORITY_SECTIONS.reduce(
    (acc, s) => {
      acc[s.key] = s;
      return acc;
    },
    {} as Record<PriorityKey, PrioritySection>,
  );
