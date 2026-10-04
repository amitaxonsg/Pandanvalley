# SEMS Provider & API Integration Registry

Axon 1Pro Smart Estate Management System v2.0 (SEMS) is designed as an **open integration platform — not a closed ecosystem**.

> Integrate first. Replace only if there is a business reason.

SEMS can connect third-party systems using REST APIs, OpenAI-compatible APIs, OAuth/OIDC, SMTP, webhooks, SFTP, CSV/Excel, database connectors and custom middleware.

If a provider is not listed, contact **support@axon.com.sg** for integration assessment.

## Secret Management

Production API keys and credentials must remain **server-side**.

The SEMS UI may display:
- Provider
- Secret/config name
- Configured status
- Environment
- Authentication type
- Last connection test
- Rotation due
- Webhook status

SEMS must **never display the actual secret value** to residents or client-side browser code.

Current demo secrets:
- `SEA_LION_API_KEY` — SEA-LION / AI Singapore — Configured
- `MAILTRAP` — Axon SMTP / Mailtrap — Configured

Other providers remain Not Configured / API Required unless separately connected.

---

## Singapore / Local-First

- SEA-LION — AI Singapore
- Homeplus — current Pandan Valley property / resident / facility / LPR environment; API assessment pending
- iCondo — property / condo-management provider; API assessment required
- Axon Resident Master — native SEMS resident/unit module
- Excel / CSV / Google Sheets — import / transition workflow
- Axon SMTP / Mailtrap — current SEMS email provider
- SMTP2GO — email / SMTP option
- Microsoft 365 / Exchange Online — email, identity and calendar integration
- Microsoft Entra ID / SSO — identity / OAuth / OIDC
- Microsoft Azure OpenAI — optional AI provider
- Microsoft Copilot Studio — optional workflow / agent integration
- GitHub Copilot — **developer tooling only**, not a SEMS resident/runtime inference provider

---

## AI / LLM Providers

Examples supported by the SEMS provider registry:

- SEA-LION — AI Singapore
  - Secret: `SEA_LION_API_KEY`
  - Status in current POC: Connected
- OpenAI API
  - Secret: `OPENAI_API_KEY`
- Anthropic Claude API
  - Secret: `ANTHROPIC_API_KEY`
- Google Gemini API
  - Secret: `GEMINI_API_KEY`
- Microsoft Azure OpenAI
  - `AZURE_OPENAI_API_KEY`
  - `AZURE_OPENAI_ENDPOINT`
- Microsoft Copilot Studio
  - OAuth / Microsoft credentials as applicable
- Kimi / Moonshot AI
  - `KIMI_API_KEY`
- Mistral AI
  - `MISTRAL_API_KEY`
- Cohere
  - `COHERE_API_KEY`
- Groq
  - `GROQ_API_KEY`
- Together AI
  - `TOGETHER_API_KEY`
- OpenRouter
  - `OPENROUTER_API_KEY`
- Local / Self-Hosted LLM
- Custom OpenAI-compatible API
  - `CUSTOM_LLM_ENDPOINT`
  - `CUSTOM_LLM_API_KEY`

Listed providers are examples and are not necessarily connected by default.

## Email / Marketing

- Axon SMTP / Mailtrap — Connected in demo
- SMTP2GO
- SendGrid
- Mailgun
- Amazon SES
- Brevo
- Mailchimp
- Postmark
- Microsoft 365 / Exchange Online
- Gmail / Google Workspace
- Custom SMTP
- Custom Email API

Example configuration names:
- `MAILTRAP`
- `SMTP2GO_API_KEY`
- `SENDGRID_API_KEY`
- `MAILGUN_API_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `BREVO_API_KEY`
- `MAILCHIMP_API_KEY`
- `POSTMARK_SERVER_TOKEN`
- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`
- Microsoft Graph / Google OAuth client credentials

## SMS

- Twilio
- Bird / MessageBird
- Vonage
- Sinch
- Infobip
- Custom SMS API

SMS is normally a client-paid subscription / usage-based service.

## WhatsApp Business

- Meta WhatsApp Business Cloud API
- Twilio WhatsApp
- Bird / MessageBird WhatsApp
- Vonage WhatsApp
- Infobip WhatsApp
- 360dialog
- Custom WhatsApp BSP/API

WhatsApp Business usually requires provider onboarding, approved message templates and usage charges.

## Voice / AI Voice

- ElevenLabs
  - Secret: `ELEVENLABS_API_KEY`
- Twilio Voice
- Vonage Voice
- Microsoft Azure Speech
- Google Cloud Text-to-Speech
- Amazon Polly
- Custom Voice API

ElevenLabs is an optional voice/TTS/voice-agent provider, not an email/SMS provider.

## Property / Condo / Resident Systems

- Homeplus
- iCondo
- BuildingLink
- Axon Resident Master
- Excel / CSV
- Google Sheets
- Custom Property API

For Pandan Valley, Homeplus remains the current system and is not automatically replaced.

## Facility Booking

- Homeplus
- iCondo
- BuildingLink
- Standalone Axon Booking — optional only
- Custom Booking API

SEMS is designed to integrate with an existing booking engine where possible.

## CCTV / Video Management

Examples:
- Hikvision
- Dahua
- Axis Communications
- Hanwha Vision
- Bosch Security
- Milestone XProtect
- Genetec
- Avigilon
- Uniview
- Custom ONVIF / VMS API

No provider is assumed to be connected unless API access is confirmed.

## Access / LPR / Gate

- Homeplus LPR — current Pandan Valley environment
- Hikvision
- Dahua
- Suprema
- ZKTeco
- HID
- Gallagher
- Genetec
- Axis
- Custom Access API

## Facial / Identity / Biometric

- Axon Selfie Verification
- Suprema
- ZKTeco
- HID
- Microsoft Azure Face — subject to service availability and client approval
- Amazon Rekognition
- Custom Identity API

**Biometric / PDPA Review Required**

No real biometric data should be used in the POC.

## Finance / Accounting

- Xero
- QuickBooks Online
- Microsoft Dynamics 365
- Sage
- Excel / CSV
- Custom Accounting API

## Storage / Files

- Dedicated VPS / client file storage
- Amazon S3
- Cloudflare R2
- Azure Blob Storage
- Google Cloud Storage
- SFTP
- Custom Storage API

## Monitoring / Security

- Cloudflare
- Sentry
- Uptime monitoring providers
- Microsoft Defender / security tooling
- Custom monitoring API

## Developer Tooling

These tools support development and operations but are not resident-facing runtime AI providers:

- GitHub
- GitHub Actions
- GitHub Copilot
- Lovable
- Supabase

## Provider Status Vocabulary

Every provider should be labelled accurately:

- Connected
- Current
- API Required
- Not Configured
- Coming Soon
- Optional
- Developer Tooling

## Custom Provider Flow

SEMS should allow an administrator to register a proposed provider using:

- Provider name
- Category
- API base URL
- Authentication type
- Secret/config name
- Webhook URL
- Notes

The provider is saved as **Pending Integration** until reviewed.

No actual secret value is stored in demo export data.

## Commercial Position

Third-party subscriptions, API fees and usage charges are normally paid directly by the client unless specifically included in an Axon quotation.

Custom connector/API development may be separately quoted.

**Need another provider? Email support@axon.com.sg for integration assessment.**
