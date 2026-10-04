# Pandan Valley MVP V2 - Secure SEA-LION AI Setup

## Important
Do **not** put the SEA-LION API key in `index.html`, `app.js`, `ai-config.js`, or any other GitHub Pages file. GitHub Pages is public client-side code, so a key placed there can be extracted by anyone.

## Recommended architecture

Browser (GitHub Pages)
→ Secure server-side endpoint / serverless function
→ SEA-LION API

The browser sends only the task and necessary demo data. The backend reads the SEA-LION API key from a protected environment secret and returns the AI response.

## Secret name
Use a protected secret such as:

`SEA_LION_API_KEY`

You may store this as:
- a GitHub repository secret for a deployment workflow,
- a Cloudflare Worker secret,
- a Vercel/Netlify environment secret,
- or an environment variable on an Axon-hosted backend.

## Public frontend configuration
Once the backend exists, edit:

`ai-config.js`

and set only the public backend URL:

```js
window.PV_AI_ENDPOINT = "https://your-secure-backend.example.com/pv-ai";
```

This URL is safe to be public. The API key is not.

## Expected frontend request format
The current MVP sends JSON similar to:

```json
{
  "task": "classify_ticket",
  "payload": {
    "message": "Resident complaint text...",
    "categories": ["Cleaning","Security","Pest Control","Light","Facilities","Landscape","Dispute","Safety","Others","Compliment"]
  }
}
```

or:

```json
{
  "task": "management_summary",
  "payload": {
    "vendorAttendance": "96%",
    "jobsWithEvidence": "93%",
    "ticketsResolved": 84
  }
}
```

The backend should return:

```json
{"text":"AI-generated response"}
```

## Safety / data design
For the sales MVP, send demo/sample data only. Do not send real resident names, NRICs, biometric images, phone numbers, access records or confidential contract data to an external AI service until Pandan Valley approves the production privacy architecture.

## Trial-key limitation
SEA-LION provides a free API for prototype/POC development. The current trial API is rate-limited to 10 requests per minute per user and should not be used for production or commercial purposes. Production deployment should use an approved production/cloud deployment arrangement. Keep the public Pandan Valley sales MVP in simulation mode until a production/commercial SEA-LION key or approved plan is available.

## Current behaviour
Until a secure backend URL is configured, the MVP clearly displays **AI Simulation Mode** and uses realistic sample AI responses. This avoids exposing credentials while still demonstrating the workflow.


## SEA-LION provider information

SEA-LION (Southeast Asian Languages in One Network) is an open-source LLM family anchored by AI Singapore and built for Southeast Asian languages, contexts and cultures.

Development / POC:
https://playground.sea-lion.ai/

API documentation:
https://docs.sea-lion.ai/guides/inferencing/api

Public API endpoint:
https://api.sea-lion.ai/v1/chat/completions

The API is OpenAI-compatible for chat completion workflows.
