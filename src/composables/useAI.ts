import OpenAI from "openai";

const token = import.meta.env.VITE_GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o-mini";

console.log(token)

const client = new OpenAI({
    baseURL: endpoint,
    apiKey: token,
    dangerouslyAllowBrowser: true
});

export interface StoryResponse {
    narrative: string;
    choices: string[];
}

export async function generateStoryResponse(message: string): Promise<StoryResponse> {
    try {
      const result = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: `
            You are a narrative engine for an interactive story. 
            Your output must be valid JSON with this structure:
            {
              "narrative": "short narrative text",
              "choices": ["Option A text", "Option B text"]
            }
            Ensure you strictly return JSON — no extra text, commentary, or explanation.`
          },
          { role: "user", content: message }
        ],
        response_format: { type: "json_object" }
      });
  
      const content = result.choices[0].message?.content ?? "{}";
      return JSON.parse(content);
    } catch (err: any) {
      console.error("OpenAI API error:", err);
      return { narrative: "Error occurred.", choices: [] };
    }
}

export async function queryGPT(message: string): Promise<string> {
    try {
      const result = await client.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: message }],
      })
  
      return result.choices[0].message.content ?? ""
    } catch (err: any) {
      console.error("OpenAI API error:", err)
      if (err.response) {
        return `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
      } else {
        return err.message ?? "Unknown error"
      }
    }
}
