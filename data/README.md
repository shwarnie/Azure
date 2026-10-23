# Question bank (`data/questions.json`)

> Unofficial AZ-900 practice tool. Not affiliated with or endorsed by Microsoft.

## Contents

- 30 original questions: 10 per topic (4 easy, 4 medium, 2 hard each)
- Topics follow the public AZ-900 skills outline on Microsoft Learn
- ID prefixes: `cc-` Cloud Concepts, `arch-` Architecture and Services, `gov-` Management and Governance
- Every question has an explanation and a specific reason for each wrong option

## Validate before committing

```bash
node scripts/validate-questions.mjs
```

The validator checks valid JSON, unique IDs with the correct topic prefix, valid topics and difficulty, four unique options, `correctIndex` from 0 to 3, `null` at the correct position in `whyOthersWrong`, and counts per topic.

## Adding a question

1. Copy an existing object and keep every field name unchanged.
2. Write original wording. Never copy or paraphrase real exam or dump questions.
3. Keep options short and avoid putting definitions inside them.
4. Run the validator.

## Fact-check log

Verify each item against the current AZ-900 pages on Microsoft Learn, then tick it off.

| Question IDs | Fact to verify | Verified by |
| --- | --- | --- |
| cc-001, cc-007 | Public, private, and hybrid cloud definitions | [ ] |
| cc-002, cc-006, cc-010 | Consumption-based model; CapEx vs OpEx | [ ] |
| cc-003, cc-009 | Shared responsibility: data stays with the customer; OS management shifts to the provider in PaaS | [ ] |
| cc-004 | IaaS, PaaS, and SaaS definitions | [ ] |
| cc-005, cc-008 | High availability and scalability, including vertical vs. horizontal scaling | [ ] |
| arch-001, arch-002, arch-003 | Regions, availability zones, and resource groups | [ ] |
| arch-004, arch-008 | Blob Storage purpose; LRS, ZRS, and GRS behavior | [ ] |
| arch-005 | Azure Functions as serverless and event-driven | [ ] |
| arch-006, arch-010 | Conditional Access; Azure RBAC and least privilege | [ ] |
| arch-007 | ExpressRoute (private) vs. VPN Gateway (over the internet) | [ ] |
| arch-009 | Management groups sit above subscriptions and policies are inherited | [ ] |
| gov-001, gov-003 | Tags and resource locks | [ ] |
| gov-002, gov-009 | Pricing calculator, TCO calculator, and Microsoft Cost Management; confirm current names and outline coverage | [ ] |
| gov-004, gov-008 | Azure Cloud Shell and Azure Resource Manager | [ ] |
| gov-005 | Azure Policy | [ ] |
| gov-006 | Azure Advisor categories | [ ] |
| gov-007 | Azure Arc | [ ] |
| gov-010 | Microsoft Purview | [ ] |
