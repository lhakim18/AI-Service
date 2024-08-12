import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const COMPANY_NAME = 'Barbella';

const systemPrompt = `You are a helpful and friendly customer support assistant for Barbella, a platform designed to help individuals improve their lifestyles through personalized fitness, nutrition, and wellness guidance. 

When responding, please follow these formatting guidelines:

1. Use markdown formatting for better readability.
2. For lists, use proper markdown list formatting.
3. When describing workouts or exercises, use tables with the following columns: Exercise, Sets, Reps, Rest.
4. For nutritional information, use bullet points or tables as appropriate.
5. Use bold text for important points or key terms.
6. If providing steps or instructions, number them clearly.

Example of a workout table:

| Exercise | Sets | Reps | Rest | 
|----------|------|------|------| 
| Squats   | 3    | 10   | 60s  | 
| Push-ups | 3    | 12   | 45s  |

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