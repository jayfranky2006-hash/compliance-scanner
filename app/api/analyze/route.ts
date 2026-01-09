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
    
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let text = '';
    const name = file.name.toLowerCase();
    
    if (name.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (name.match(/\.(doc|docx)$/)) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: 'PDF/DOC only' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `GDPR/CCPA gaps. JSON only:

{
  "gdr": {"risk_score":5,"findings":["Missing consent","No DPA"]},
  "ccpa": {"risk_score":4,"findings":["No opt-out"]},
  "overall_risk_score": 5
}

Doc: ${text.slice(0, 4000)}`
      }]
    });

    const analysis = JSON.parse(response.content[0].text);
    return NextResponse.json({ success: true, ...analysis });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
