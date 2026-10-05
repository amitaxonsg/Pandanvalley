# Axon 1Pro Smart Estate Management System v2.0 (SEMS)

## What SEMS Is

Axon 1Pro Smart Estate Management System v2.0 is a **smart operations, automation, accountability and resident-service platform** for condominiums, MCSTs and property-management teams.

SEMS is designed to **integrate with existing systems first**, rather than forcing an estate to replace systems it has already paid for.

Examples of systems that may remain in place:
- facility booking platforms
- Homeplus or other resident/property systems
- gate, LPR and access-control systems
- CCTV
- payment systems
- accounting platforms
- email
- Excel / Google Sheets
- Tender Board and other specialist tools

SEMS adds the operational layer around them so work can be tracked, automated, evidenced, escalated and reported from one portal.

> **Core principle: Integrate first. Replace only if there is a business reason.**

## Core Functions

### 1. Resident Master & Unit Directory
SEMS can maintain its own unit/resident master when required, or synchronize with an external source such as Homeplus, Excel/CSV or a third-party API.

Typical records:
- unit
- owner / tenant / occupant
- email / mobile
- move-in / move-out
- emergency contact
- communication opt-in
- notes
- source system
- synchronization status

### 2. Resident PWA / Client Login
Residents can log in through an installable Progressive Web App (PWA) and:
- report an issue or incident
- attach photographs
- track the issue
- receive MA replies
- add follow-up comments/photos
- view notices and circulars
- acknowledge important notices
- register contractors/movers
- view pass status
- receive notifications
- manage basic unit/profile details

Issue workflow:
**Reported → Assigned → In Progress → Waiting Resident → Resolved**

Internal MA notes remain private.

The PWA is installable on supported iOS, Android and desktop browsers. Native App Store / Google Play packaging can be offered separately.

### 3. Work Orders & Vendor Evidence
- MA creates and assigns work
- mandatory before/after photographs
- optional video for selected work
- checklists
- parts/quantity records
- vendor submission
- MA sign-off
- rectification workflow
- evidence archive
- vendor performance reporting

### 4. Vendor Attendance & Geo-Fence
- individual worker attendance
- security-assisted check-in
- GPS/geofence
- late threshold
- re-entry/final checkout
- exception alerts
- month-end reporting
- optional identity/biometric integration subject to PDPA/privacy review

### 5. Contractor / Mover Workflow
- resident/MA registration
- MA approval
- deposit status
- temporary digital/QR pass
- gate verification
- multiple-entry validity
- email/SMS notification
- optional synchronization with existing LPR/access system

### 6. NFC + GPS Route Verification
One route/checkpoint engine can support:
- security
- cleaning
- landscape
- routine works

Features:
- NFC checkpoint tap
- GPS/time verification
- route completion
- missed checkpoint alerts
- unusual timing review
- compliance reports

### 7. MA Task & Escalation Management
Unified work queue for:
- resident tickets
- work orders
- patrol exceptions
- notices
- vendor exceptions
- manual tasks
- automation-generated tasks

Typical states:
**New → Assigned → In Progress → Waiting Vendor → Waiting Resident → Escalated → Completed**

### 8. Automation Centre
SEMS can automate recurring work currently handled in Excel, email or manual reminders.

Examples:
- vendor contract expiry
- warranty expiry
- maintenance schedule
- monthly attendance report
- monthly circular
- overdue ticket escalation
- SLA warning
- work-order reminder
- deposit follow-up
- contractor-pass expiry
- missed patrol checkpoint
- move-in/move-out checklist

Excel/CSV can be used during transition. Processes can later be converted into structured workflows.

### 9. MA Communications Centre
- notices
- monthly circulars
- mass email
- templates
- delivery history
- PWA publication
- audience targeting by resident type/block/unit
- read/acknowledgement tracking
- emergency communications

### 10. SMS
SMS is an optional subscription / usage-based service.

**SMS Gateway Subscription Required — usage charges apply.**

Example provider connectors:
- Twilio
- MessageBird
- Custom SMS API

SMS subscription and usage are quoted separately.

### 11. SLA / Demerit / Compliance
- operational exceptions
- evidence-linked demerit records
- deterministic contract rules
- compliance scoring
- financial recommendation
- human approval before financial action
- audit history

### 12. Council / Management Reporting
- vendor attendance
- work evidence compliance
- resident service levels
- patrol completion
- SLA exposure
- outstanding tasks
- monthly summaries
- PDF/Excel-ready reporting

## AI Assistance — SEA-LION / AI Singapore

SEMS uses **SEA-LION — AI Singapore** as the AI provider for the current POC/development environment.

AI-assisted use cases can include:
- ticket classification
- duplicate issue detection
- resident-message summarisation
- draft replies
- attendance anomalies
- vendor-performance insights
- recurring maintenance pattern detection
- monthly management summaries

Human approval remains required for sensitive actions.

The current SEA-LION development API is a POC/free tier and is rate-limited to **10 requests per minute**. Production deployment requires an approved production AI arrangement.

Why SEA-LION is relevant:
- Singapore / Southeast Asia AI ecosystem
- regional language/context focus
- suitable for multilingual Southeast Asian estate-management scenarios
- can be used server-side without exposing API credentials to the browser

## Dedicated Client Deployment Model

Recommended production architecture can use a **dedicated environment per client / MCST**.

Example portal:
`sems.<clientdomain.com>`

Examples:
- `sems.axon.com.sg`
- `sems.examplecondo.com`

Possible dedicated deployment components:
- dedicated VPS/application environment
- dedicated database
- separate object/file storage
- separate backups
- separate audit trail
- client-specific domain and TLS/HTTPS
- server-side secrets
- monitoring and incident logs
- role-based access

Root/server administrator access should be restricted to authorised technical administrators only.

### Singapore PDPA / Security

A dedicated VPS can support stronger tenant isolation and governance, but **a dedicated VPS by itself does not guarantee PDPA compliance**.

Production design must also address:
- purpose/consent where required
- access control
- authentication
- retention/deletion
- audit logging
- incident response
- backups
- encryption/TLS
- vendor/data-processing agreements
- biometric/privacy requirements
- hosting/data-location requirements agreed with the client

Production deployment should therefore be marked:

**Singapore PDPA / Security Review Required**

## Integration Layer

SEMS can integrate with external products where API/file access is available.

### Resident / Property Systems
- Homeplus
- iCondo
- BuildingLink
- Excel/CSV
- Custom API
- Axon Resident Master

### Facility Booking
- Homeplus
- iCondo
- BuildingLink
- Custom API
- optional Standalone Axon booking only when specifically required

### Gate / Access / LPR
- Homeplus LPR
- Hikvision
- Dahua
- Suprema
- ZKTeco
- Custom API

### CCTV
- existing CCTV
- Hikvision
- Dahua
- Custom API

### Finance / Accounting
- Excel/CSV
- Custom API
- Xero
- QuickBooks
- other approved systems

### Communications
- Axon SMTP / Mailtrap
- optional SMS gateway
- WhatsApp Business/API where approved

### AI
- SEA-LION — AI Singapore

Every integration should be labelled accurately as:
**Current / Connected / Pending API / Coming Soon / Optional**

## Pandan Valley Demo

Client portal:
https://sems.axon.com.sg/

The current demonstration uses fictional data and is intended for requirements validation, process mapping and commercial scoping before production deployment.


## Resident Communications & Campaigns

SEMS can manage estate communications from one MA/Admin workspace while still using the client's preferred delivery providers.

Channels:
- PWA / portal notifications
- Email
- SMS
- WhatsApp Business
- Voice / AI Voice

Campaign types:
- notices
- circulars
- announcements
- maintenance advisories
- emergency notices
- event / AGM / council
- contractor works
- surveys / feedback
- optional marketing/promotional messages where permitted

Audience targeting:
- all residents
- owners
- tenants
- occupants
- selected blocks
- selected units
- custom segments
- channel opt-in segments

### Example providers

Email:
Mailtrap, SendGrid, Mailgun, Amazon SES, Brevo, Mailchimp, Custom SMTP/API

SMS:
Twilio, Bird/MessageBird, Vonage, Custom API

WhatsApp:
Meta WhatsApp Business Cloud API, Twilio WhatsApp, Bird/MessageBird, Vonage, Custom BSP/API

Voice / AI Voice:
ElevenLabs, Twilio Voice, Custom Voice API

### Open Integration Policy

SEMS is not a closed platform.

If a provider has a suitable API, SMTP endpoint, webhook, OAuth integration or file-based interface, Axon can assess it for connection.

**Need another provider? Email support@axon.com.sg for integration assessment.**

Third-party subscriptions and usage charges are client-paid direct unless explicitly included in an Axon quotation.


## Why Axon Recommends Subscription Instead of One-Off Development

Axon does not generally recommend deploying a modern automation platform like SEMS as a one-off custom application with no ongoing maintenance or subscription arrangement.

The reason is practical: systems like SEMS depend on components that continue to change after launch, including:

- third-party APIs
- AI models and providers
- browsers and PWA/mobile standards
- email, SMS, WhatsApp and voice providers
- security libraries and operating-system dependencies
- database engines and application frameworks
- data-protection/security expectations
- integration endpoints
- infrastructure, backups and monitoring
- estate-management workflows and client requirements

A one-off system can work well at launch but may become outdated, incompatible or expensive to maintain after a few years if nobody is continuously responsible for keeping it current.

### Recommended SEMS Subscription Model

The SEMS subscription model is intended to keep the platform:

- maintained
- supported
- patched
- compatible
- continuously improved

The subscription supports ongoing:

- code maintenance
- security updates
- API/integration updates
- SEA-LION/AI integration updates
- PWA/browser compatibility updates
- database/infrastructure maintenance
- monitoring and backup improvements
- workflow enhancements
- common platform improvements that can benefit all SEMS clients

**Subscribe so the platform stays current, supported and maintainable.**

## One-Off Customized Development Option

Subscription is Axon's recommended model, but it is **not mandatory**.

Organizations that prefer to own and maintain a separate custom application can request a one-off customized SEMS-derived solution.

A one-off build can be quoted separately and may include, subject to contract:

- custom scope and architecture
- source-code handover
- deployment handover
- client-managed or Axon-managed hosting
- documentation
- agreed transition to the client's own IT team, webmaster or software developer

After handover, future work such as:

- API changes
- security patches
- AI/provider changes
- browser/mobile compatibility
- dependency upgrades
- infrastructure maintenance
- bug fixes
- new features

becomes the client's responsibility unless Axon is retained under a separate support/maintenance agreement.

A one-off build usually has a higher initial development cost and can be more expensive to maintain over time.

**Custom one-off development is available by quotation: support@axon.com.sg**



## What SEMS Supports — Open Integration Ecosystem

**Open platform. Your providers. Your integrations.**

SEMS is not a closed ecosystem. It is designed to work with existing property systems, AI providers, email/SMS/WhatsApp providers, CCTV, access control, finance tools, storage platforms and custom APIs.

If your provider is not listed, Axon can assess and build a connector.

### AI / LLM
SEA-LION — AI Singapore, OpenAI, Anthropic Claude, Google Gemini, Microsoft Azure OpenAI / Copilot Studio, Kimi, Mistral, Cohere, Groq, OpenRouter, local/self-hosted LLMs and custom OpenAI-compatible APIs.

### Property / Condo
Homeplus, iCondo, BuildingLink, Axon Resident Master, Excel/CSV, Google Sheets and custom property APIs.

### Communications
Email: Mailtrap/Axon SMTP, SMTP2GO, SendGrid, Mailgun, Amazon SES, Brevo, Mailchimp, Postmark, Microsoft 365 / Exchange, Gmail / Google Workspace.

SMS: Twilio, Bird/MessageBird, Vonage, Sinch, Infobip.

WhatsApp: Meta WhatsApp Business Cloud API, Twilio WhatsApp, Bird/MessageBird, Vonage, Infobip, 360dialog.

Voice / AI Voice: ElevenLabs, Twilio Voice, Azure Speech, Google Cloud Text-to-Speech, Amazon Polly.

### CCTV / Video
Hikvision, Dahua, Axis, Hanwha Vision, Bosch, Milestone XProtect, Genetec, Avigilon, Uniview and custom ONVIF/VMS APIs.

### Gate / Access / LPR
Homeplus LPR, Hikvision, Dahua, Suprema, ZKTeco, HID, Gallagher, Genetec, Axis and custom access APIs.

### Facial / Identity
Axon Selfie Verification, Suprema, ZKTeco, HID, Azure Face, Amazon Rekognition and custom identity APIs.

**Biometric / PDPA Review Required** for production use.

### Finance / Accounting
Xero, QuickBooks, Microsoft Dynamics 365, Sage, Excel/CSV and custom accounting APIs.

### Storage / Cloud / Monitoring
Dedicated VPS, Amazon S3, Cloudflare R2, Azure Blob Storage, Google Cloud Storage, SFTP, Cloudflare, Sentry and uptime monitoring.

### Developer / Platform Tooling
GitHub, GitHub Actions, GitHub Copilot (developer tooling only), Lovable and Supabase.

### Bring Your Own Provider
Already using Homeplus, iCondo, Hikvision, Mailchimp, Twilio, WhatsApp Business, ElevenLabs, Xero or another provider? Keep it.

SEMS can connect through REST API, OpenAI-compatible API, OAuth/OIDC, SMTP, webhook, SFTP, CSV/Excel or custom middleware.

### Provider Not Listed?
Email **support@axon.com.sg** for integration assessment.

### Third-Party Charges
Provider subscriptions, API usage, message charges and vendor fees are normally paid directly by the client unless explicitly included in an Axon quotation.

Custom connector development may be separately quoted.


## Operational Differentiator

The primary SEMS sales proposition is that estates can retain iCondo, Homeplus, BuildingLink or other resident/access platforms while adding a dedicated operational accountability layer.

Core differentiators:
1. Vendor Accountability — geo-fenced attendance, worker-level check-in/out, alerts and compliance reporting.
2. Digital Work Orders — structured workflows, before/after evidence, video archive and MA inspection/sign-off.
3. Rectification & Vendor Performance — rework tracking, performance scoring and contractor SLA monitoring.
4. Patrol/Cleaning/Landscape Verification — NFC checkpoints, GPS/time verification and route compliance.
5. MA Task & Escalation Queue — resident tickets, patrols and work orders in one prioritized audited queue.
6. Automation Centre — contracts, warranties, maintenance schedules, overdue escalation and spreadsheet-to-workflow automation.
7. SLA/Demerit/Compliance — evidence-linked records, compliance scoring and human-approved recommendations.
8. AI Estate Intelligence — ticket classification, duplicate detection, attendance anomaly analysis and management/council summaries.

This should be presented prominently in sales and demo experiences as: **SEMS does not replace your resident or access system. It connects to them and adds operations, accountability, automation and AI intelligence.**
