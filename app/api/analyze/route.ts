import { NextRequest, NextResponse } from 'next/server';
import { Anthropic } from '@anthropic-ai/sdk';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const buffer = Buffer.from(await file!.arrayBuffer());
    
    let text = '';
    const name = file!.name.toLowerCase();
    
    if (name.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (name.match(/\.(doc|docx)$/)) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Analyze for GDPR/CCPA gaps. JSON only:

{
  "gdr": {
    "risk_score": 1-10,
    "findings": ["item1", "item2"]
  },
  "ccpa": {
    "risk_score": 1-10,
    "findings": ["item1", "item2"]
  },
  "overall_risk_score": 1-10
}

Document: ${text.slice(0, 8000)}`
      }]
    });

    const analysis = JSON.parse(response.content[0].text);
    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
