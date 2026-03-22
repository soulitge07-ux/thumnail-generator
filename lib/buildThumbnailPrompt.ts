import { THUMBNAIL_SYSTEM_PROMPT } from './prompts/thumbnailSystemPrompt'

/**
 * Combines the system prompt with the user's request
 * to produce a fully optimized Gemini image generation prompt.
 */
export function buildThumbnailPrompt(userRequest: string): string {
  return `${THUMBNAIL_SYSTEM_PROMPT}

---

## User Request
${userRequest}`
}
