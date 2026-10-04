# Pandan Valley Smart Estate Management — MVP Demo
Pages deployment trigger
Concept prototype prepared by Axon 1Pro Solutions for MCST 581 Pandan Valley Condominium.

## Scope covered
1. Service Vendor Work Reporting
2. Digital Work Reporting with before/after verification
3. Contractor / Mover Registration and Digital QR Pass
4. Routine Works, NFC Checkpoints and Patrol Route Verification
5. Resident Feedback with Live Ticket Status
6. Managing Agent Evaluation and SLA Financial Penalty Calculator

## How to run
Open `index.html` in any modern browser. No backend is required for this concept demo.

## Important
This is an interactive front-end MVP using demo data. GPS/geofencing, facial recognition, NFC hardware reads, SMS/email delivery, QR validation, secure photo metadata, resident authentication and SLA billing integrations are simulated in this version.

## Production architecture
- Web/PWA frontend for MA, security, vendors and residents
- Secure API/backend with role-based access
- SQL database and audit log
- Object storage for work photos
- GPS/geofence service
- Device camera capture + metadata/hash validation
- NFC tag checkpoint validation
- Signed/expiring QR passes
- Email/SMS notification provider
- Configurable SLA/de-merit rules engine
- Reporting/export dashboard

## Recommended delivery phases
**Phase 1:** Vendor attendance, work reports, resident tickets, admin dashboard  
**Phase 2:** Contractor QR passes, guard workflow, photo verification  
**Phase 3:** NFC patrols, geofence automation, stronger identity verification  
**Phase 4:** SLA penalty engine, analytics, integrations, production hardening

No production biometric data should be enabled until privacy, consent, retention, security and Singapore PDPA requirements are reviewed and approved.
