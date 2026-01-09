import Anthropic from '@anthropic-ai/sdk';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) return Response.json({ error: 'No file' }, { status: 400 });
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let text = '';
    const name = file.name.toLowerCase();
    
    if (name.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text.slice(0, 3000);
    } else if (name.match(/\.(doc|docx)$/)) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value.slice(0, 3000);
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `GDPR/CCPA gaps. JSON only:

{
  "gdr": {"risk_score": 5, "findings": ["No consent", "Missing DPA"]},
  "ccpa": {"risk_score": 4, "findings": ["No opt-out"]},
  "overall_risk_score": 5
}

Text: ${text}`
      }]
    });

    const analysis = JSON.parse(response.content[0].text);
    return Response.json({ success: true, ...analysis });
    
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 });
  }
}

