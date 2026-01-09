import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const client = new Anthropic({
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
      text = data.text.slice(0, 4000);
    } else if (name.match(/\.(doc|docx)$/)) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value.slice(0, 4000);
    } else {
      return NextResponse.json({ error: 'PDF/DOC only' }, { status: 400 });
    }

    // CORRECT Anthropic SDK usage
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Analyze GDPR/CCPA compliance gaps. Return ONLY valid JSON:

{
  "gdr": {
    "risk_score": 5,
    "findings": ["Missing consent form", "No Data Processing Agreement"]
  },
  "ccpa": {
    "risk_score": 4,
    "findings": ["No \"Do Not Sell\" link", "Missing data categories"]
  },
  "overall_risk_score": 5
}

Document content: ${text}`
      }]
    });

    // Parse AI response
    const content = response.content[0].text;
    const analysis = JSON.parse(content);
    
    return NextResponse.json({ 
      success: true, 
      filename: file.name,
      ...analysis 
    });
    
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
