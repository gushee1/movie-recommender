import { create } from "zustand";
import { queryGPT } from "./useAI";

// TODO: might not need this struct, simple string might be enough.
export interface StoryMessage {
  role: "user" | "npc";
  content: string;
}

interface StoryState {
  messages: StoryMessage[];
  summary: string;
  addMessage: (role: "user" | "npc", content: string) => void;
  updateSummary: () => void;
  resetStory: () => void;
}

function summarize(summary: string) {
    return "Read the following story text. Generate a condensed summary that preserves all important events, character actions, relationships, and the story's tone and atmosphere. Remove only filler or repetitive content. This summary will be used to continue the story, so every critical detail must be retained, but it should be as brief and token-efficient as possible." + summary;
}

export const useStory = create<StoryState>((set, get) => ({
  messages: [],
  summary: "",
  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { role, content }],
    })),
  updateSummary: async () => {
    const { messages, summary } = get();
    const storySoFar = [summary, ...messages.map((m) => m.content)].join(". ");
    let newSummary = await queryGPT(summarize(storySoFar))
    set({ summary: newSummary });
  },
  resetStory: () => set({ messages: [], summary: "" }),
}));
