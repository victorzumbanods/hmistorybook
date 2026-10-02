#!/usr/bin/env node
// Registers a Figma webhook that fires when the library file is published (Enterprise / Organization).
//
//   FIGMA_TOKEN=figd_xxx FIGMA_FILE_KEY=AbC123 \
//   RELAY_URL=https://figma-webhook-relay.<you>.workers.dev FIGMA_WEBHOOK_PASSCODE=some-secret \
//   npm run webhook:create
//
// The token needs the `webhooks:write` scope. Use LIBRARY_PUBLISH so Storybook only updates when designers publish.

const { FIGMA_TOKEN, FIGMA_FILE_KEY, RELAY_URL, FIGMA_WEBHOOK_PASSCODE, FIGMA_EVENT = 'LIBRARY_PUBLISH' } = process.env
if (!FIGMA_TOKEN || !FIGMA_FILE_KEY || !RELAY_URL || !FIGMA_WEBHOOK_PASSCODE) {
  console.error('Missing FIGMA_TOKEN, FIGMA_FILE_KEY, RELAY_URL or FIGMA_WEBHOOK_PASSCODE.')
  process.exit(1)
}

const res = await fetch('https://api.figma.com/v2/webhooks', {
  method: 'POST',
  headers: { 'X-Figma-Token': FIGMA_TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event_type: FIGMA_EVENT,
    context: 'file',
    context_id: FIGMA_FILE_KEY,
    endpoint: RELAY_URL,
    passcode: FIGMA_WEBHOOK_PASSCODE,
    description: 'HMI Storybook: rebuild on variable publish',
  }),
})
const out = await res.json()
if (!res.ok) {
  console.error(`Figma API ${res.status}:`, out)
  process.exit(1)
}
console.log(`✓ Webhook ${out.id} created (${out.event_type} → ${out.endpoint})`)
