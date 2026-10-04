# Axon 1Pro Smart Estate Management System v2.0 — Full-Stack Demo

This folder is the GitHub mirror of the working Lovable/Supabase demo for MCST 581 Pandan Valley.

## Client URL
https://sems.axon.com.sg/

## Runtime
- Lovable full-stack application
- Supabase/PostgreSQL demo database
- Server-side SEA-LION AI integration
- Server-side Mailtrap/Axon SMTP integration

## Demo roles
- MA / Admin
- Security
- Vendor
- Resident
- Council

## Live integration status
- SEA-LION — AI Singapore: configured and successfully tested from the server side
- Mailtrap / Axon SMTP: configured and successfully tested using sender amit@axon.com.sg
- Homeplus: current client system; API access required; integration assessment pending
- Gate/LPR, CCTV, facial/identity and patrol integrations: demo/provider options only until API access is confirmed

## Demo data
The application stores fictional demo records in Supabase/PostgreSQL. The admin Demo Data page supports JSON export and reset-to-seed. The seed mirror is stored at src/data/seed.json.

## Security
No secrets are committed to GitHub. Required server-side secrets:
- SEA_LION_API_KEY
- MAILTRAP

Do not add real resident or biometric data to this POC.

## Production gaps
Before real deployment:
1. Replace demo role switching with authenticated accounts and server-side RBAC.
2. Confirm Homeplus API capabilities.
3. Confirm PDPA/biometric consent and retention policy.
4. Confirm exact demerit/SLA wording.
5. Move SEA-LION from free POC entitlement to an approved production deployment.
6. Finalise backup, monitoring, retention and incident-response policies.
