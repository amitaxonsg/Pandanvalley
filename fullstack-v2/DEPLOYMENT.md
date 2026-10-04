# Deployment

## Client-facing domain
https://sems.axon.com.sg/

## Components
1. Frontend + server runtime: Lovable
2. Database: Supabase/PostgreSQL
3. AI: SEA-LION — AI Singapore, called server-side only
4. Email: Mailtrap/Axon SMTP API, called server-side only
5. Source/version control mirror: GitHub branch fullstack-v2

## Server secrets
Configure in the runtime secret manager only:
- SEA_LION_API_KEY
- MAILTRAP

Never expose these in browser code, public JSON, screenshots or GitHub files.

## Sender
- Domain: axon.com.sg
- Sender: amit@axon.com.sg
- Default display name: Axon 1Pro Smart Estate Management

## SEA-LION POC
Current development API is a free POC tier, rate-limited to 10 requests/minute and not a production/commercial entitlement.
