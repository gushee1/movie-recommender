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
