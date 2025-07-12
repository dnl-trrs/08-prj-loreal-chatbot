// Copy this code into your Cloudflare Worker script

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    const apiKey = env.OPENAI_API_KEY; // Make sure to name your secret OPENAI_API_KEY in the Cloudflare Workers dashboard
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    let requestBodyInput;
    try {
      requestBodyInput = await request.json();
      if (!Array.isArray(requestBodyInput.messages)) {
        throw new Error("Invalid request: 'messages' must be an array");
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const requestBody = {
      model: 'gpt-4o',
      messages: requestBodyInput.messages,
      temperature: 0.7,
      max_tokens: 300,
      stream: false
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch from OpenAI" }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
