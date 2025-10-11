import { queryGPT } from "./useAI";

function summarize(summary: string) {
  return `
    Read the following story text. Generate a condensed summary that preserves all important events,
    character actions, relationships, and the story's tone and atmosphere. 
    Remove only filler or repetitive content. 
    This summary will be used to continue the story, so every critical detail must be retained,
    but it should be as brief and token-efficient as possible.

    STORY:
    ${summary}
  `;
}

export interface StoryMessage {
  role: "user" | "npc";
  content: string;
}

class StoryManager {
  private static instance: StoryManager;
  private messages: StoryMessage[] = [];
  private summary: string = "";

  private constructor() {}

  static getInstance(): StoryManager {
    if (!StoryManager.instance) {
      StoryManager.instance = new StoryManager();
    }
    return StoryManager.instance;
  }

  addMessage(role: "user" | "npc", content: string) {
    this.messages.push({ role, content });
  }

  async updateSummary() {
    const storySoFar = [this.summary, ...this.messages.map((m) => m.content)]
      .filter(Boolean)
      .join(". ");

    const prompt = summarize(storySoFar);
    const newSummary = await queryGPT(prompt);
    this.summary = newSummary;
  }

  resetStory() {
    this.messages = [];
    this.summary = "";
  }

  getSummary() {
    return this.summary;
  }

  getMessages() {
    return this.messages;
  }
}

// Public getter for singleton
export function getStory() {
  return StoryManager.getInstance();
}
