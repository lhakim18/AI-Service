/*import { NextResponse } from 'next/server';

const systemPrompt = "You are a helpful and friendly customer support assistant for Headstarter, a platform designed to help individuals and businesses grow by providing personalized tools, resources, and support. Answer the user's questions and provide assistance where needed.";

export async function POST(req) {
  try {
    const data = await req.json();
    const userMessage = data[data.length - 1].content.toLowerCase();

    // Custom responses for specific questions
    let customResponse = null;

    if (userMessage.includes("what is headstarter")) {
      customResponse = "Headstarter is a platform designed to help individuals and businesses grow by providing personalized tools, resources, and support.";
    } else if (userMessage.includes("how can i get started")) {
      customResponse = "You can sign up on our website, choose the services or tools you need, and follow our guided setup process.";
    } else if (userMessage.includes("what types of services")) {
      customResponse = "We offer a variety of services, including project management tools, AI-driven analytics, training resources, and customer support solutions.";
    } else if (userMessage.includes("project management")) {
      customResponse = "Yes, Headstarter provides project management tools that help you plan, track, and execute projects efficiently.";
    } else if (userMessage.includes("contact customer support")) {
      customResponse = "You can reach out to our customer support team via email, phone, or live chat on our website.";
    }

    if (customResponse) {
      return new NextResponse(customResponse, {
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // If no custom response, return a generic message
    return new NextResponse("I'm sorry, I don't have specific information about that. Is there anything else I can help you with regarding Headstarter's services?", {
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return new NextResponse('An unexpected error occurred', { status: 500 });
  }
} */

 /* import { NextResponse } from 'next/server';
import OpenAI from "openai";

const systemPrompt = "You are a helpful and friendly customer support assistant for StarrLight, a platform designed to help individuals who want to improve their lifestyles by providing personalized tools, resources, and support. Answer the user's questions and provide assistance where needed.";

export async function POST(req) {
  console.log('API route called');
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    console.log('API Key set:', !!apiKey);
    console.log('API Key (first 4 characters):', apiKey ? apiKey.substring(0, 4) : 'Not available');

    if (!apiKey) {
      throw new Error('OpenRouter API key is not set in environment variables');
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.YOUR_SITE_URL || 'http://localhost:3000',
        "X-Title": process.env.YOUR_SITE_NAME || 'Local Development',
      }
    });

    const data = await req.json();
    console.log('Received data:', JSON.stringify(data));

    console.log('Sending request to OpenRouter...');
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        { role: 'system', content: systemPrompt },
        ...data
      ],
    });

    console.log('OpenRouter API response:', completion);

    const aiResponse = completion.choices[0].message.content;

    return new NextResponse(aiResponse, {
      headers: { 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Detailed error in chat API:', error);
    return new NextResponse(`An unexpected error occurred: ${error.message}`, { status: 500 });
  }
}*/

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const COMPANY_NAME = 'Barbella';

const systemPrompt = `You are a helpful and friendly customer support assistant for ${COMPANY_NAME}, a platform designed to help individuals improve their lifestyles through personalized fitness, nutrition, and wellness guidance. 

When responding, please follow these formatting guidelines:

1. Use markdown formatting for better readability.
2. For lists, use proper markdown list formatting.
3. When describing workouts or exercises, use tables with the following columns: Exercise, Sets, Reps, Rest.
4. For nutritional information, use bullet points or tables as appropriate.
5. Use bold text for important points or key terms.
6. If providing steps or instructions, number them clearly.

Example of a workout table:

| Exercise | Sets | Reps | Rest | Notes |
|----------|------|------|------| ------|
| Squats   | 3    | 10   | 60s  | 240 lbs
| Push-ups | 3    | 12   | 45s  | Modified

For recipes, please format them as follows:

1. Start with a brief description of the dish.
2. List the ingredients in a bulleted list.
3. Provide the instructions in numbered steps.
4. Include nutritional information in a table at the end.
5. Make sure to include spaces between each section. 

Here's an example of how a recipe should be formatted:

**Healthy Chicken Quinoa Bowl**

A nutritious and delicious meal packed with protein and vegetables.

Ingredients:
- 1 cup cooked quinoa
- 4 oz grilled chicken breast, sliced
- 1 cup mixed salad greens
- 1/4 cup cherry tomatoes, halved
- 1/4 avocado, sliced
- 2 tbsp low-fat feta cheese
- 1 tbsp olive oil
- 1 tsp lemon juice
- Salt and pepper to taste

Instructions:
1. In a large bowl, place the cooked quinoa as the base.
2. Arrange the sliced grilled chicken on top of the quinoa.
3. Add the mixed salad greens, cherry tomatoes, and avocado slices.
4. Sprinkle the feta cheese over the salad.
5. In a small bowl, whisk together olive oil, lemon juice, salt, and pepper.
6. Drizzle the dressing over the salad.
7. Toss gently before serving.

Nutritional Information:

| Calories | Protein | Carbs | Fat |
|----------|---------|-------|-----|
| 450      | 35g     | 40g   | 20g |

Remember to be encouraging and supportive in your responses. Provide clear, concise, and well-organized information to help users achieve their fitness and wellness goals.`;

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