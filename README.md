# Axon 1Pro Smart Estate Management System v2.0 — Pandan Valley

**Client:** MCST 581 Pandan Valley Condominium  
**Product:** Axon 1Pro Smart Estate Management System v2.0  
**Company:** Axon 1Pro Solutions  
**Website:** axon.com.sg  
**Support:** support@axon.com.sg

## Live Full-Stack Demo

**Actual demo:** http://sems.axon.com.sg/

The GitHub Pages content in this repository is the client-facing concept / blueprint / quotation layer. The actual interactive full-stack demo runs separately on the application runtime and database environment, exposed through the Axon demo domain above.

### Platform separation

- **GitHub / GitHub Pages:** proposal, blueprint, discovery form, module quotation pages, source/version control and the static concept MVP.
- **Lovable + Supabase:** full-stack runtime, persistent demo database, role-based workflows, server-side SEA-LION AI calls, and server-side Mailtrap/Axon SMTP actions.
- **sems.axon.com.sg:** client-facing entry point for the playable full-stack demo.

## Full-Stack v2 Source

A protected source mirror is maintained on the `fullstack-v2` branch / folder. Secrets are never committed to GitHub.

Server secrets:
- `SEA_LION_API_KEY`
- `MAILTRAP`

## Demo Roles

- MA / Admin
- Security
- Vendor
- Resident
- Council

## Core Modules

1. Vendor Attendance & Geo-Fenced Accountability
2. Digital Work Orders & Before/After Evidence
3. Contractor / Mover Registration & QR Gate Access
4. NFC + GPS Patrol / Cleaning / Landscape Verification
5. Resident Feedback & Issue Resolution Tracking
6. MA Evaluation, Demerit & SLA Recommendation
7. Integrations / API Settings
8. SEA-LION AI Settings
9. Axon SMTP / Mailtrap Email Settings
10. Demo Data / JSON Export / Reset

## AI

AI assistance is designed around **SEA-LION — AI Singapore** for development/POC use. The current trial API is limited to 10 requests per minute and is not a production/commercial entitlement. Production use requires an approved production deployment arrangement.

## Email

Demo email workflows use **Axon SMTP API (Mailtrap)** with verified sender domain `axon.com.sg` and default sender `amit@axon.com.sg`. Secrets stay server-side.

## Important

All demo data is fictional. No real resident, biometric, access or confidential operational data should be loaded into the POC until production privacy, PDPA, retention, security and integration architecture are formally approved.


## Demo Readiness Status — 5 Oct 2026

The full-stack demo is ready for client demonstration at:

**https://sems.axon.com.sg/**

### Verified
- All five demo roles and their pages load successfully.
- SEA-LION / AI Singapore server-side integration has returned a real AI management summary.
- Mailtrap / Axon SMTP server-side integration has successfully sent a test email from the verified axon.com.sg sender setup.
- Secrets remain server-side and are not committed to GitHub.
- Supabase/PostgreSQL stores the fictional demo records.
- Demo Data supports JSON export/reset-to-seed.
- Contextual Help and guided-tour flows are included.
- Homeplus and other external providers are accurately marked Pending / API Required rather than presented as live integrations.
- Full non-secret source/config/database setup is mirrored under the `fullstack-v2` branch/folder.

### Intentionally pending before production
- Real authenticated user accounts and server-side RBAC
- Homeplus API assessment/integration
- Live gate/LPR/CCTV provider integrations
- Facial/biometric PDPA approval
- Exact security demerit/SLA contract wording
- Production SEA-LION deployment/entitlement
- Final module/hardware/AI pricing

These pending items do not block the sales / process-discovery demo.


## Product Strategy — Add-On, Integrate First

Axon 1Pro Smart Estate Management System v2.0 is positioned as a **smart operations, automation and accountability layer**, not as a forced replacement for the estate's existing specialist systems.

For Pandan Valley, Homeplus and existing tools can remain in place for functions they already perform well, such as facility booking, visitor/access workflows, LPR/gate management, resident-facing functions, payments and other estate services. Axon connects around those systems through API, scheduled import, CSV/Excel import or controlled parallel workflows where required.

### Principle

**Integrate first. Replace only if there is a business reason.**

Existing tools may include:
- Homeplus
- Facility booking platforms
- Gate / LPR / access systems
- CCTV
- Email
- Excel / Google Sheets
- Tender Board
- Accounting systems

Axon adds:
- Resident Master / Unit Directory where required
- Work orders and evidence
- Vendor accountability
- Tasks and escalation
- Automation rules
- Resident issue tracking
- Communications / circulars / notices
- Mass email
- SMS gateway integration
- NFC / GPS route verification
- SLA / demerit tracking
- SEA-LION AI assistance
- Management and council reporting

If an estate already has a suitable resident master or resident portal, Axon can synchronize with it. If the estate only has spreadsheets or an inaccessible legacy database, Axon can maintain its own Resident Master.

## Resident Master & Unit Directory

Optional Axon module:
- units, owners, tenants and occupants
- contact and emergency-contact records
- move-in / move-out dates
- communication preferences
- source system: Homeplus / Excel / Manual / API
- synchronization status and last-sync date
- CSV / Excel import
- API synchronization
- manual entry
- CSV / JSON export

This module does **not require replacement of Homeplus** if Homeplus remains the approved source of record.

## MA Communications Centre

The MA/Admin workspace is intended to include:
- Notices
- Monthly Circulars
- Mass Email
- Email history
- SMS notices
- Communication templates
- Audience targeting by all residents / owners / tenants / blocks / units
- publish/expiry dates
- read acknowledgement
- resident portal/PWA publication

Typical notice categories:
General, Maintenance, Water Shutdown, Lift, Security, Facilities, Event, AGM/Council, Emergency and Contractor Works.

Existing Axon SMTP / Mailtrap integration can be used for controlled email delivery.

## SMS

SMS is an **optional subscription / usage-based service**.

Admin should show:

**SMS Gateway Subscription Required — usage charges apply.**

Potential connector options include Twilio, MessageBird or a client-selected SMS API. SMS subscription and usage charges are quoted separately from the core application.

Critical messages may use:
- Resident PWA notification
- Email
- SMS, when subscribed/configured

## Automation Centre

The objective is to move recurring MA work out of spreadsheets and manual reminders into configurable automation.

Example automations:
- Vendor contract expiry
- Equipment warranty expiry
- Maintenance schedule reminders
- Monthly vendor attendance report
- Monthly resident circular
- Outstanding ticket escalation
- SLA warning escalation
- Work order overdue reminder
- Deposit follow-up
- Contractor pass expiry
- Cleaning/patrol missed checkpoint alert
- Resident move-in / move-out checklist

Axon can initially import CSV/Excel-based processes, map the fields, and progressively convert them into structured workflows.

## MA Tasks & Escalation

A unified MA work queue can combine tasks generated from:
- resident tickets
- work orders
- vendor exceptions
- patrol exceptions
- notices
- manual tasks
- automation rules

Typical states:
New → Assigned → In Progress → Waiting Vendor → Waiting Resident → Escalated → Completed.

## Resident Portal / PWA

The Resident Portal is designed as an installable **Progressive Web App (PWA)**.

Residents can:
- log in
- report issues
- attach photographs
- track issue status
- add comments or further evidence
- view MA replies
- reopen eligible resolved issues
- register contractors/movers
- view approved passes
- receive notices and monthly circulars
- acknowledge notices
- manage profile/unit information
- view notifications

Ticket flow:
Reported → Assigned → In Progress → Waiting Resident → Resolved.

Internal MA notes remain private.

The PWA can be installed on supported iOS, Android and desktop browsers. Native App Store / Google Play packaging can be offered separately if required.

## Resident Notices & Circulars

Resident PWA should provide:
- Notice feed
- Monthly circular archive
- Emergency banner
- Attachments
- Search/filter by category/month
- Read/acknowledge
- Ticket/notice notification centre

## Expanded Integration Categories

### Resident / Property Systems
Homeplus, iCondo, BuildingLink, Excel/CSV, Custom API, Axon Resident Master

### Facility Booking
Homeplus, iCondo, BuildingLink, Custom API, optional Standalone Axon booking only when required

### Gate / Access / LPR
Homeplus LPR, Hikvision, Dahua, Suprema, ZKTeco, Custom API

### CCTV
Existing CCTV, Hikvision, Dahua, Custom API

### Finance / Accounting
Excel/CSV, Custom API, Xero, QuickBooks — example connectors, subject to API availability

### Communications
Axon SMTP / Mailtrap, optional SMS gateway, WhatsApp Business/API where separately approved

### AI
SEA-LION — AI Singapore

All integrations must be labelled accurately as **Current / Connected / Pending API / Coming Soon / Optional**.

## Expanded Optional Quote Modules

In addition to the original six operational modules, the commercial proposal may separately quote:

1. Resident Master & Unit Directory
2. Communications Centre / Mass Email
3. SMS Gateway Integration & Subscription
4. Automation Centre / Excel-to-Workflow Automation
5. MA Task & Escalation Management
6. Resident PWA Portal

These are add-on modules and **do not require replacement of existing facility booking or gate systems**.


## Resident Portal / PWA — Core V2 Requirement

For Pandan Valley, the Resident Portal / PWA is treated as a **must-have V2 function**, not merely an optional presentation feature.

Residents must be able to:
- log in securely
- report estate incidents/issues
- choose category, block/location and urgency
- attach a photograph
- receive a ticket number
- track progress
- see MA public replies
- add follow-up comments and additional photographs
- reopen eligible resolved cases
- view contractor/mover pass status
- receive estate notices
- read monthly circulars
- acknowledge important notices
- view a notification centre
- view/update basic unit/profile information

Ticket lifecycle:
**Reported → Assigned → In Progress → Waiting Resident → Resolved**

MA internal notes remain private.

The resident interface is designed as an installable **Progressive Web App (PWA)** for supported iOS, Android and desktop browsers. Native App Store / Google Play packaging can be quoted separately if required.

A playable Resident PWA concept is included in the GitHub Pages MVP while the full-stack database version is being implemented.


## Product Overview

A full description of what **Axon 1Pro Smart Estate Management System v2.0 (SEMS)** does, its integration-first strategy, Resident PWA, SEA-LION AI positioning and dedicated client deployment model is maintained in:

[PRODUCT-OVERVIEW.md](PRODUCT-OVERVIEW.md)

### Recommended client portal model

Production deployments can use a dedicated client portal such as:

`sems.<clientdomain.com>`

with a dedicated application/VPS, database, storage, backup and audit environment where selected.

This supports client isolation and governance, but does **not** by itself guarantee Singapore PDPA compliance. Production requires a complete privacy/security review covering access, consent, retention, backups, incidents, contracts, authentication and other applicable controls.

### AI provider

Current POC/development AI is powered by **SEA-LION — AI Singapore**, with server-side credentials and human approval for sensitive actions.


## Resident Communications & Campaigns

SEMS includes a Resident Communications & Campaigns layer for MA/Admin teams.

Supported communication use cases:
- Notices
- Monthly Circulars
- Announcements
- Maintenance Advisories
- Emergency Notices
- Events / AGM / Council messages
- Contractor Works
- Surveys / Feedback Requests
- Optional Marketing / Promotion where permitted by estate policy and resident communication preferences

Possible channels:
- Resident PWA / portal notifications
- Email
- SMS
- WhatsApp Business
- Optional Voice / AI Voice

Campaign workflow:
**Draft → Preview → Test Send → Approval → Schedule/Send → Delivery Tracking → Analytics**

Mass communications should require authorised human approval before sending.

### Email providers

Examples:
- Axon SMTP / Mailtrap
- SendGrid
- Mailgun
- Amazon SES
- Brevo
- Mailchimp
- Custom SMTP
- Custom API

Mailtrap is currently used for the Pandan Valley demo's live email tests.

### SMS

SMS is an optional third-party subscription / usage-based service.

Example providers:
- Twilio
- Bird / MessageBird
- Vonage
- Custom SMS API

**SMS Gateway Subscription Required — usage charges apply.**

### WhatsApp

Possible WhatsApp Business/API providers:
- Meta WhatsApp Business Cloud API
- Twilio WhatsApp
- Bird / MessageBird
- Vonage
- Custom BSP/API

WhatsApp template approval, provider subscription and message charges are paid directly by the client unless otherwise agreed.

### Voice / AI Voice

Optional providers:
- ElevenLabs
- Twilio Voice
- Custom Voice API

ElevenLabs is treated as a voice/TTS/voice-agent provider, not as an email or SMS provider.

Possible use cases:
- emergency voice notice
- outbound reminder
- multilingual spoken circular
- IVR
- automated resident call

## Open Integration / Bring-Your-Own-Provider

**SEMS is an open integration platform — not a closed ecosystem.**

Third-party services can be connected through:
- API
- OAuth
- SMTP
- webhook
- CSV / Excel
- scheduled import
- custom connector

Providers listed in SEMS are examples, not an exclusive list.

If the client's preferred provider is not listed, contact:

**support@axon.com.sg**

for integration assessment.

Third-party subscriptions, API fees and usage charges are normally paid directly by the client unless explicitly included in an Axon quotation. Custom API/connector development may be separately quoted.

## Communication Preferences / PDPA Controls

SEMS is designed to support:
- Email preference
- SMS preference
- WhatsApp preference
- Voice-call preference
- Essential service / emergency notice distinction
- preference update / unsubscribe
- communication audit log

Production consent and lawful-purpose rules must be confirmed by the client under Singapore PDPA and applicable estate policies.


## Resident Mobile Camera / Photo Incident Reporting — Core Requirement

The Resident PWA must provide a complete self-service flow, not only a text ticket form.

Resident navigation should include:
- Dashboard
- Report an Issue
- My Issues
- Notices & Circulars
- Announcements / Notifications
- Contractor / Mover
- My Unit / Profile
- Communication Preferences
- Install App
- Help Centre

### Report an Issue

Residents must be able to:
- choose issue category
- enter short title
- select/enter block and location
- choose urgency
- write description
- **Take Photo** using the mobile camera where supported
- **Upload Photo** from the device
- preview the selected image/evidence
- optionally use SEA-LION to suggest category
- submit to MA
- receive ticket number
- immediately track the issue

Recommended mobile input:
`accept="image/*"` with camera capture enabled where supported by the browser/PWA.

### Issue Tracking

Residents can see:
**Reported → Assigned → In Progress → Waiting Resident → Resolved**

They may:
- read MA public replies
- add follow-up comment
- attach another photograph
- reopen an eligible resolved issue
- receive notifications

Residents must never see internal MA notes.

### Notices / Circulars / Announcements

Resident PWA must provide:
- notice feed
- monthly circular archive
- announcements
- emergency/maintenance banner
- attachments
- search/filter
- Mark Read
- Acknowledge
- unread counters
- notification history

### Communication Preferences

Resident can manage demo preferences for:
- Email
- SMS
- WhatsApp
- Voice
- Emergency / essential service notifications

These communication preferences and consent controls should be carried into the production architecture subject to the client's PDPA and estate-policy requirements.


## Product Direction — From Pandan Valley Pilot to Standard SEMS Platform

Axon 1Pro Smart Estate Management System v2.0 (SEMS) is being developed as a **standard product for condominiums, MCSTs and property-management teams**, not as a one-off custom system for Pandan Valley.

### Pandan Valley's role

Pandan Valley is currently treated as the **development-partner / pilot deployment** for SEMS.

The objective of the Pandan Valley pilot is to:

- validate the actual estate-management workflows
- test the resident, MA/Admin, Security, Vendor and Council experiences
- refine the resident PWA / issue-reporting process
- validate notices, circulars and communication workflows
- test work-order, attendance, patrol and SLA processes
- validate SEA-LION AI assistance in practical estate-management use cases
- validate Axon SMTP / Mailtrap communication workflows
- identify integration needs with existing systems such as Homeplus
- identify where Excel/manual processes can be automated
- validate dedicated client deployment and data-isolation requirements
- identify hardware, API and third-party provider dependencies
- refine pricing, support and deployment models

The work done with Pandan Valley is therefore part of **productisation and platform validation**, not merely bespoke development.

### Standard product model

Once the pilot workflows are validated, SEMS is intended to be deployable for other condominiums and MCSTs using a common platform architecture.

Each client can have:

- its own branded portal
- a hostname such as `sems.<clientdomain.com>`
- dedicated or isolated application/database infrastructure
- its own residents, units and operational data
- its own integrations
- its own communication providers
- its own policies, SLA rules and automation
- its own backup, monitoring and retention configuration

The software platform remains standard, while each estate receives its own configuration and data environment.

### Why this matters

The goal is to avoid creating a different codebase for every condominium.

Instead, SEMS should provide:

**One maintainable platform + configurable modules + client-specific integrations + isolated client data.**

This approach makes it easier to:

- keep the platform updated
- improve security centrally
- support new APIs/providers
- improve SEA-LION AI features
- add new communication channels
- maintain PWA/mobile compatibility
- improve reporting and automation
- deploy improvements across all SEMS clients without rebuilding each estate's system from scratch

### Subscription rather than one-off software ownership

SEMS is designed as a subscription platform because AI, APIs, browser/mobile standards, security requirements and third-party services evolve continuously.

A one-off custom system can become obsolete and expensive to maintain.

The SEMS subscription model allows Axon to continuously maintain and improve the common platform while keeping each client's data environment separate.

### Pandan Valley special development-partner arrangement

Because Pandan Valley is helping Axon validate and refine the platform during this productisation stage, Axon may offer a special development-partner commercial arrangement.

This arrangement is separate from the future standard SEMS pricing and remains subject to:

- agreed pilot scope
- council approval
- formal quotation
- infrastructure requirements
- confirmed integration requirements
- third-party provider/API costs

Pandan Valley's participation does not mean its operational data is shared with other SEMS clients.

Each production client environment is intended to remain logically and/or physically separated according to the agreed deployment architecture.

### Long-term SEMS roadmap

The platform is intended to evolve into a reusable estate-management ecosystem covering:

- Resident Master & Unit Directory
- Resident PWA / mobile experience
- Incident reporting with photo evidence
- Tickets and escalation
- Notices, circulars and announcements
- Email / SMS / WhatsApp / voice communications
- Vendor attendance
- Work orders and evidence
- Contractor / mover access workflows
- NFC / GPS route verification
- MA task management
- automation and Excel-to-workflow migration
- SLA / demerit management
- management / council reporting
- SEA-LION AI assistance
- open third-party API integrations
- dedicated client deployment and security controls

### Current status

**Pandan Valley = Pilot / Development Partner / Product Validation**

**SEMS = Standard Product Platform for Future Condominium / MCST Deployments**



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

