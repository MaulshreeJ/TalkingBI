# TalkingBI: Viva Q&A Guide
## Conquer Your Technical Defense

This guide provides answers to common questions you might be asked during your viva. Use these to show deep technical understanding of the system you've built.

---

### Q1: "What is the core innovation of this project?"
**Answer**: The core innovation is the **Hybrid Intent Parsing Engine**. While many systems rely solely on LLMs (which are prone to hallucination and latency), TalkingBI uses a **Deterministic Override Layer (Phase 6G)**. This layer uses pattern matching and schema validation to resolve common queries instantly and accurately. Only when a query is semantically complex does it fall back to the Generative AI (LLM) layer.

### Q2: "How does the system understand 'Revenue' if the CSV column is named 'total_amt'?"
**Answer**: We use a **Semantic Interpreter (Phase 7)**. During the dataset profiling phase, the system builds an IQ (Intelligence Quotient) map of the data. When a query comes in, the interpreter uses semantic mapping to link natural language terms to the closest logical schema match based on data distribution and header names.

### Q3: "Is this system secure? Could a user perform a SQL injection?"
**Answer**: Security is a first-class citizen in TalkingBI. Since we use a **Pandas Execution Backend**, no raw SQL is ever generated from user input. Instead, the **Execution Planner (Phase 6D)** converts the parsed intent into a set of atomic, internal operations. This abstraction layer prevents traditional injection attacks.

### Q4: "How do you handle 'Context'? (e.g., 'What about next month?')"
**Answer**: We implement a **Multi-turn Context Resolver (Phase 6C)**. The system maintains a stateful conversation history. When a query fragment like "next month" is received, the resolver merges it with the previously resolved intent (e.g., the KPI and filters from the last question) to form a complete, actionable instruction.

### Q5: "What is the role of the 'Query Orchestrator'?"
**Answer**: The Orchestrator is the **Control Plane** of the entire application. It manages an 11-step pipeline that takes a raw query and transforms it through normalization, parsing, schema mapping, and execution planning. It decouples the API boundary from the business logic, ensuring that the same processing happens whether the query comes from the web UI or an API call.

### Q6: "Why did you use Next.js for the frontend?"
**Answer**: Next.js was chosen for its **App Router architecture**, which allows for a clean separation between server-side data fetching and client-side interactivity. This architecture ensures high performance and better SEO, while libraries like **Framer Motion** and **Zustand** provide the premium, reactive UX required for a modern BI tool.

---

### 🚀 Rapid-Fire Defense Tips:
- **Mention "DIL"**: Call it the "Dataset Intelligence Layer"—it sounds very professional.
- **Explain "Latency"**: If they ask about speed, mention the **Query Result Cache**.
- **The "Future"**: If they ask about scaling, say you've designed a **PostgresBackend** (Phase 9B) to handle big data beyond simple CSVs.

---

**Good luck with your viva! You have a powerful system—defend it with confidence.**
