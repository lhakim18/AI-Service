import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const COMPANY_NAME = 'Barbella';

const systemPrompt = `You are a helpful and friendly customer support assistant for Barbella, a platform designed to help individuals improve their lifestyles through personalized fitness, nutrition, and wellness guidance. 

When responding, always follow these formatting guidelines to ensure your responses are well-organized and easily legible:

1. Use markdown formatting for better readability.
2. Always use double line breaks between paragraphs and sections for clear separation.
3. For lists and workout routines, use proper markdown bullet point formatting with a blank line before and after the list.
4. Use bold text for important points, exercise names, or key terms.
5. If providing steps or instructions, use numbered lists and add a blank line between each step.
6. Use headings (##, ###) to separate main sections of your response.

Here's an example of a well-formatted response for a workout recommendation:

## Workout Recommendation

Here's an idea of a well-structured response for a full-body workout you can do at home:

• **Squats**: 3 sets of 15 reps, 30s rest
• **Push-ups**: 3 sets of 10 reps, 30s rest
• **Lunges**: 3 sets of 12 reps per leg, 30s restho
• **Plank**: 3 sets of 30s hold, 30s rest

Remember to warm up before starting and cool down after finishing.

## Nutrition Tip

Staying hydrated is crucial for your fitness journey. Here are some tips:

• Drink at least 8 glasses of water daily
• Carry a reusable water bottle with you
• Eat water-rich foods like cucumbers and watermelon
• Limit caffeine and alcohol intake

Always structure your responses in a similar, well-organized manner with clear sections and proper spacing. For workouts, follow the same structure above by using bullet points that include sets, reps, and rest time.`;

export async function POST(req) {
  console.log('API route called');
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Gemini API Key set:', !!apiKey);
    console.log('Gemini API Key (first 10 characters):', apiKey ? apiKey.substring(0, 10) : 'Not available');

    if (!apiKey) {
      throw new Error('Gemini API key is not set in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const data = await req.json();
    console.log('Received data:', JSON.stringify(data));

    // Convert the message history to Gemini's expected format
    const history = data.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add the system prompt to the beginning of the history
    history.unshift({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });

    const chat = model.startChat({
      history: history.slice(0, -1), // Exclude the last message
    });

    console.log('Sending request to Gemini...');
    const result = await chat.sendMessage(history[history.length - 1].parts[0].text);
    const response = result.response;
    console.log('Gemini API response received');

    return new NextResponse(response.text(), {
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Detailed error in chat API:', error);
    return new NextResponse(`An unexpected error occurred: ${error.message}`, { status: 500 });
  }
}