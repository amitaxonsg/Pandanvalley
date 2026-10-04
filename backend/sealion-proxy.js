/**
 * Pandan Valley SEA-LION secure backend template
 *
 * IMPORTANT:
 * - Do not deploy this file on GitHub Pages.
 * - Run it on a server/serverless platform.
 * - Set SEA_LION_API_KEY as a server-side environment secret.
 * - The browser calls this endpoint; this endpoint calls SEA-LION.
 *
 * Development API: SEA-LION by AI Singapore.
 * Trial/POC API is rate-limited and not for production/commercial use.
 */

export default async function handler(req, res) {
  // Basic CORS for the Pandan Valley GitHub Pages MVP.
  const allowedOrigin = 'https://amitaxonsg.github.io';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});

  const apiKey = process.env.SEA_LION_API_KEY;
  if (!apiKey) return res.status(500).json({error:'SEA_LION_API_KEY not configured'});

  const { task, payload } = req.body || {};

  let systemPrompt = 'You are an AI assistant for Pandan Valley condominium estate management. Use concise, professional English. Do not make final financial, legal, biometric, security-access, or contractual decisions. Provide recommendations for authorised staff review.';
  let userPrompt = '';

  if (task === 'classify_ticket') {
    userPrompt = [
      'Classify this resident estate-management ticket.',
      'Return a concise plain-text answer with Category, Priority, Summary, Suggested Action.',
      'Allowed categories: ' + (payload?.categories || []).join(', '),
      'Resident message: ' + (payload?.message || '')
    ].join('\n');
  } else if (task === 'management_summary') {
    userPrompt = 'Write a short council-ready management summary from this demo operational data. Mention strengths, exceptions and recommended management attention. Data: ' + JSON.stringify(payload || {});
  } else {
    return res.status(400).json({error:'Unsupported task'});
  }

  try {
    const modelResponse = await fetch('https://api.sea-lion.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.SEA_LION_MODEL || 'aisingapore/Llama-SEA-LION-v3-8B-IT',
        messages: [
          {role:'system', content:systemPrompt},
          {role:'user', content:userPrompt}
        ],
        temperature: 0.3,
        max_tokens: 450
      })
    });

    const data = await modelResponse.json();
    if (!modelResponse.ok) {
      return res.status(modelResponse.status).json({error:'SEA-LION request failed', detail:data});
    }

    const text = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({text, provider:'SEA-LION / AI Singapore', mode:'development-poc'});
  } catch (err) {
    return res.status(500).json({error:'AI backend error'});
  }
}
