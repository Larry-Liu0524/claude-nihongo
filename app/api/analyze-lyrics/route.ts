import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface LyricAnalysisResult {
  annotated_lyrics: string;
  vocabulary: Array<{
    word: string;
    reading: string;
    meaning: string;
    part_of_speech: string;
  }>;
  grammar_notes: string[];
  learning_tips: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lyrics } = body;

    if (!lyrics || typeof lyrics !== 'string' || lyrics.trim().length === 0) {
      return NextResponse.json({ error: '請提供歌詞內容' }, { status: 400 });
    }

    const prompt = `你是一個日文老師，專門幫助對動漫和J-POP有興趣的初學者學習日文。
請分析以下日文歌詞，並用繁體中文回應：

${lyrics}

請提供：
1. 帶假名標注的歌詞（在漢字旁邊標示讀音，用ruby HTML格式：<ruby>漢字<rt>読み</rt></ruby>）
2. 重要單字列表（每個單字包含：日文、讀音、中文意思、詞性）
3. 適合初學者的文法重點說明（最多3點）
4. 這首歌的學習建議

用JSON格式回應，結構如下：
{
  "annotated_lyrics": "帶標注的歌詞，每行用\\n分隔，包含ruby標籤",
  "vocabulary": [{"word": "...", "reading": "...", "meaning": "...", "part_of_speech": "..."}],
  "grammar_notes": ["文法說明1", "文法說明2", "文法說明3"],
  "learning_tips": "學習建議..."
}

請確保只回傳JSON格式，不要有其他文字。`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    let jsonText = text;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const analysisResult: LyricAnalysisResult = JSON.parse(jsonText);
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing lyrics:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: '解析回應時出錯，請再試一次' }, { status: 500 });
    }
    return NextResponse.json({ error: '分析歌詞時發生錯誤，請稍後再試' }, { status: 500 });
  }
}
