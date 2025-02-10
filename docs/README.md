# Introduction

This is a chatbot application SiliconChat that uses SiliconFlow APIs. The features include:

- Settings
- Chat

## Settings

Users can set their own SiliconFlow API key. The app will store it in browser's local storage.

## Chat

Users can enter text and send. Users will receive responses in stream mode.

# UI

There are 3 pages, /, /chat and /settings. All the pages are in a unified layout design, with the navigation bar on the top.

## /

This is the homepage with a simple but cool design of introduction.

## /settings

There is a simple form allows users to enter their Silicon API key.

## /chat

The chat UI is of full height of the available view port, depending on the nav system design. If nav is on the top, then the chat UI takes the rest of the height. Otherwise, it takes the full view port height.

The chat UI consists of a message box at the bottom and a chat history list above it. The message box sticks to the bottom of the page. The whole UI should not cause y-scrollbar and the whole chat page takes full height of the viewport.

The message box consists of an auto resizable text area, a send button and a model selector. The model selector allows user to select the model to chat with. The model selector should be minimal and not take significant space.

Refer to the API below for retrieving the model list.

# Tech Stack

The whole API communications should be done at client side, which means the relevant React components should be implemented as client components.

## UI

The UI should be developed with shadcn components. The following components will be used:
- Input (for API key)
- Button (for sending messages)
- Textarea (for message input)
- Select (for model selection)
- Card (for message bubbles)
- Form (for settings)
- Toast (for notifications/errors)

## API

The chat feature is implemented by making SiliconFlow API call. See the API example below:

### Chat API

#### Request

The request supports stream mode. See the API doc below:

```
stream - boolean
default: false
If set, tokens are returned as Server-Sent Events as they are made available. Stream terminates with data: [DONE]
```

```javascript
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ${SILICONFLOW_API_KEY}',
    'Content-Type': 'application/json'
  },
  body: '{"model":"deepseek-ai/DeepSeek-V3","messages":[{"role":"user","content":"中国大模型行业2025年将会迎来哪些机遇和挑战？"}],"stream":false,"max_tokens":512,"stop":["null"],"temperature":0.7,"top_p":0.7,"top_k":50,"frequency_penalty":0.5,"n":1,"response_format":{"type":"text"},"tools":[{"type":"function","function":{"description":"<string>","name":"<string>","parameters":{},"strict":false}}]}'
};

fetch('https://api.siliconflow.cn/v1/chat/completions', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

#### Example Response

```json
{
  "id": "<string>",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "<string>",
        "reasoning_content": "<string>"
      },
      "finish_reason": "stop"
    }
  ],
  "tool_calls": [
    {
      "id": "<string>",
      "type": "function",
      "function": {
        "name": "<string>",
        "arguments": "<string>"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 123,
    "total_tokens": 123
  },
  "created": 123,
  "model": "<string>",
  "object": "chat.completion"
}
```

### Model list

#### Request

```javascript
const options = {
  method: 'GET',
  headers: {Authorization: 'Bearer ${SILICONFLOW_API_KEY}'}
};

fetch('https://api.siliconflow.cn/v1/models', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

#### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "stabilityai/stable-diffusion-xl-base-1.0",
      "object": "model",
      "created": 0,
      "owned_by": ""
    }
  ]
}
```

# Implementation Plan

## Phase 1: Component Setup
1. Install additional required shadcn components
2. Create base layout with navigation

## Phase 2: Settings Implementation
1. Create settings page with form
2. Implement localStorage management for API key
3. Add API key validation

## Phase 3: Chat UI Implementation
1. Create chat layout structure
2. Implement message input component
3. Create chat history display
4. Add model selector
5. Style components for full viewport usage

## Phase 4: API Integration (All Client-Side)
1. Create API service class/hooks for:
   - Chat completion with streaming
   - Model list fetching
2. Implement error handling
3. Add loading states

## Phase 5: Homepage and Polish
1. Create engaging homepage design
2. Add animations and transitions
3. Testing and bug fixes
