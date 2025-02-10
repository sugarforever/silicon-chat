export interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning_content?: string;
}
