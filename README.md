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
