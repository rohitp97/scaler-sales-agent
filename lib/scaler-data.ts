// Grounding content curated from public scaler.com pages (scraped manually).
// Only facts present here should be used for curriculum/outcome claims in generated
// content. If a lead's question isn't covered here, the model must say it will confirm
// and get back rather than fabricate specifics.

export const SCALER_GROUNDING = `
# SCALER PROGRAMS - VERIFIED FACTS (source: scaler.com, do not go beyond this)

## Scaler Academy (Modern Software & AI Engineering)
- Duration: 12 months (10-month accelerated option for advanced learners). Full-day access from Day 1.
- Audience: 1-4 yrs SDE/QA/Frontend; 2-6 yrs Fullstack/Backend; 3-8 yrs Senior Eng/Tech Leads; 5-10+ yrs Solution Eng/AI-first builders.
- Curriculum: Programming Fundamentals (2mo/27 sessions), Intermediate DSA: AI-Assisted Problem Solving (1mo/12 sessions),
  Advanced DSA: Foundations & Core Techniques (4mo/59 sessions), Advanced DSA: DP/Heaps/Graphs (4mo/18 sessions),
  AI & Agents (1mo/11 sessions - "move beyond using AI to building autonomous AI systems").
  Forward Deployed Engineer (FDE) track: FDE Foundations (Python, workflow, delivery), Backend Engineering & Advanced
  Data Systems, Full-Stack FDE (TypeScript/React/AI-first frontends), Cloud/DevOps/Kubernetes/Infra,
  Enterprise Communication/Consulting/LLM Engineering. Fullstack & Backend specialization tracks also available.
- Teaching format: "Prompt -> Review -> Own" AI-integrated workflow. Live instruction from industry practitioners.
  1:1 mentor support from active, currently-employed industry professionals. AI mock interviews (avatars trained on
  real SWE interview formats: DSA, LLD, System Design). Project-based, problem-statement-to-deployed-AI-product.
  Community of 37,000+ tech professionals; 1,00,000+ alumni network overall.
- Fees: Starting ~Rs. 9,791/month, total ~Rs. 3,99,000. No-cost EMI, ~Rs. 20,000 upfront commitment. Lifetime access to
  curriculum, recordings, and future updates included (updated forever, no extra cost).
- Outcomes (verified directly from scaler.com homepage, "assessed 2024 Academy cohort"): Career transition rate
  96%. Overall median CTC post-Scaler Rs. 25 LPA (up from Rs. 9 LPA pre-Scaler). Median CTC hike 150%. Top 25%
  of the assessed cohort: median CTC Rs. 48 LPA. Verified named transitions (scaler.com/academy/): Shivam Prakash,
  Backend Engineer at Ericsson -> Computer Scientist at Adobe (214% hike, 3 offers); Rajesh Somasundaram, Software
  Engineer-II at HERE Technologies -> Machine Learning Ops Engineer-2 at NinjaCart; Sahil Bansal, now Data
  Scientist at Fractal (prior role not stated on site - don't invent one).
- Market context cited: 163% growth in AI-related job postings 2024->2025; "AI Engineer" is fastest-growing job
  title in the US (LinkedIn 2026 report); 729% YoY growth in forward-deployed engineer postings (2025->2026);
  $206K average AI engineer salary in 2025 (a $50,000 jump in a year) - this is a US figure, use with care for
  Indian audiences and don't imply it's the Indian outcome.
- Instructors: Anshuman Singh (Co-Founder) - 2x ACM ICPC World Finalist, built Facebook Messenger, 15+ YOE.
  Shivank Agarwal (Senior VP Eng) - decade at Microsoft & Oracle, 14+ YOE. Naman Bhalla (Co-Founder, Scaler AI Labs)
  - Google Kickstart rank 135, ACM ICPC rank 37, 6+ YOE. Utkarsh Gupta (VP Academic) - AIR 1 Google Hash Code 2019,
  Codeforces Master, 750+ live sessions, 7+ YOE. Faculty broadly includes ACM ICPC finalists and founding/senior
  engineers from Facebook, Microsoft, Oracle, Amazon, Google.
- Certificate awarded on completion, LinkedIn/resume-ready.
- Differentiators: AI built into every module (not bolted on); proprietary coding platform + terminal-based judges
  + in-house AI mock interview system; every project spans frontend+backend+AI feature integration; new FDE
  specialization for high-demand customer-embedded roles.

## Scaler Data Science & ML (with AI Specialization)
- Duration: 12 months, flexible scheduling for working professionals.
- Audience: 0-4 yrs SDE/QA/Analyst/non-tech grads (no prior coding required for beginner track); 1-4 yrs SWEs
  transitioning to AI/ML; 2-6 yrs self-learners/professionals future-proofing against AI; 4-10+ yrs mid-level
  professionals seeking growth.
- Curriculum: Advanced SQL & AI for Data Professionals (2mo/25 sessions - schema design, joins, window functions,
  AI-assisted query generation), Excel & Dashboarding with AI Storytelling (1mo/12 sessions), Python Foundations +
  AI Coding Assistants (1mo/12 sessions), Data to Decisions: Product Analytics with AI (1mo/12 sessions),
  Generative AI for Data Analytics & Automation (1mo/12 sessions). Plus supervised ML, NLP & transformers,
  cloud/AWS, experimentation frameworks, agentic AI workflows.
- Teaching format: Live classes 3x/week with industry instructors. 1:1 monthly mentorship. AI labs (config review,
  production failure simulation). 50+ hands-on projects on real business cases (Swiggy, Meesho, Myntra, etc.). AI
  mock interviews for data science formats. Lifetime access to recordings + curriculum updates.
- Fees: Starting ~Rs. 9,791/month, total ~Rs. 3,99,000 (~$4,790 USD). No-cost EMI, ~Rs. 20,000 upfront.
- Outcomes: 37,000+ alumni across tech (also stated elsewhere on the page as 40,000+ peers - site has this minor
  inconsistency, cite the lower/more-repeated 37,000+ figure), 900+ hiring partner companies. Median salary hike
  ~110% post-completion, median CTC Rs. 18 LPA. Average placement timeline within 3-6 months. Verified named
  transition (scaler.com/data-science-course/): Associate Analyst -> Associate at Razorpay.
- Instructors: Saurabh Kango (Senior Manager, DS&A @Meesho) - Ex-LinkedIn Analytics Lead and Airbnb Data
  Scientist, 10+ YOE. Thanish Batcha (Senior Data Scientist II @Poshmark) - built end-to-end ML at Amazon using
  BERT and RoBERTa, 8+ YOE. Shared instructors also teaching on this track: Anshuman Singh (Facebook Messenger
  founding team), Shubham Singh (Uber-scale products, ex-Dream11).
- Differentiators: AI built into every module; portfolio-ready, interview-ready projects; lifelong curriculum
  updates at no extra cost; structured accountability (check-ins, mentorship, community) to prevent
  content-consumption-without-capability.

## Scaler DevOps, Cloud & AI Platform Engineering
- Duration: 12 months, full-time.
- Audience: 0-3 yrs grads/junior devs/QA; 3-7 yrs SW/DevOps engineers; 7-12 yrs SREs/security/data engineers;
  12+ yrs cloud architects/eng leaders. No prior coding required for beginners.
- Curriculum: Beginner Python (1mo/12 sessions - data types, control flow, functions, problem-solving), Linux Shell
  Scripting & Computer Systems, split into two modules (1mo/11 sessions + 1mo/10 sessions - file systems, processes,
  networking, Git), DevOps Tools 1: Docker & Kubernetes (3mo/33 sessions - container orchestration, security,
  observability), DevOps Tools 2: CI/CD & Infra-as-Code (2mo/24 sessions - Jenkins, GitHub Actions, Argo CD,
  Ansible). Specialisation in MLOps and Cybersecurity.
- Teaching format: 1:1 mentor support from active industry pros. AI-assisted labs (config review, failure
  simulation). Project-based with AI-integrated capstones. AI mock interviews for platform engineer/SRE/cloud
  architect roles. Live sessions + lifetime recorded access.
- Fees: Starting ~Rs. 9,791/month, total ~Rs. 3,99,000. No-cost EMI, ~Rs. 20,000 upfront. Lifelong curriculum update access.
- Outcomes/market context cited: 9.8x growth in MLOps roles over five years; 41.8% YoY growth in AI/ML engineer
  roles (Q1 2025); 25-35% salary premium for MLOps engineers over standard DevOps; <2% unemployment rate for
  DevOps engineers. Emerging roles highlighted: AIOps Systems Architect, AI Gateway Engineer, Agentic Workflow
  Designer, RAG Engineer, AI-Enabled Platform Engineer/SRE.
- Instructors (scaler.com/devops-course/): Anshuman Singh (Co-Founder, shared across programs) - 2x ACM ICPC
  World Finalist, built Facebook Messenger, 15+ YOE. Vilas Varghese (Senior DevOps Consultant) - BITS Pilani
  alumnus, 4 AWS certifications, 20+ YOE. Rajat Bansal (Senior SRE at Eventbrite), 5+ YOE. Govind Kumar (Cloud
  Architect) - 11 AWS certifications, 12+ YOE. Do not attribute Microsoft/Oracle background to DevOps instructors
  specifically - that's Academy-track only (Shivank Agarwal).
- Differentiators: AI built into every module; production-first tool teaching; 5 capstone projects with AI
  components (observability, security, FinOps, GenAI, ML platforms); proprietary coding/interview-prep tools;
  37,000+ alumni network; MLOps & Cybersecurity specialization tracks.

## Advanced AI/ML with Agentic AI Specialization
- Duration: 12 months. Focus: deep learning, NLP, RAG pipelines, agentic system design. Evolution path: AI
  Engineers building intelligent features. Rating 4.6+.

## Company-wide facts
- Positioning: "Professionals Built for the Next Decade in AI" - AI-integrated curriculum with quarterly updates,
  not retrofitted.
- 1,00,000+ alumni network overall; enterprise partnerships include IIT Roorkee (advanced AI programs) and ADGM
  Academy (government AI training).
- General financing: no-cost EMI available across programs, ~Rs. 20,000 upfront commitment typical.

## Anti-hallucination rule (critical)
Only state specifics (numbers, module names, instructor names, outcomes) that appear above. If a lead asks
something more specific than this file covers (e.g. "is there a module on X exact tool", "what's the exact
placement rate for people from a service company background"), do NOT invent a number or fact. Instead, write
something honest like "the BDA will confirm the exact figure on your next call" or "worth confirming with your
BDA directly" - and flag it in the "what we're not sure about" section. A confident wrong answer about curriculum
is worse than admitting a gap.
`.trim();
