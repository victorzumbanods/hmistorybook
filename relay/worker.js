// Cloudflare Worker: Figma webhook → GitHub repository_dispatch.
// Figma cannot send GitHub's auth header itself, so this relay checks Figma's passcode and forwards the event.
//
// Secrets (wrangler secret put …): FIGMA_WEBHOOK_PASSCODE, GITHUB_TOKEN (fine-grained PAT, Contents: read & write)
// Var (wrangler.toml):             GITHUB_REPO = "owner/name"

const FORWARD = new Set(['LIBRARY_PUBLISH', 'FILE_UPDATE'])

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Figma webhook relay is running.')

    let body
    try {
      body = await request.json()
    } catch {
      return new Response('Bad JSON', { status: 400 })
    }
    if (body.passcode !== env.FIGMA_WEBHOOK_PASSCODE) return new Response('Forbidden', { status: 403 })
    if (body.event_type === 'PING') return new Response('pong')
    if (!FORWARD.has(body.event_type)) return new Response(`Ignored ${body.event_type}`)

    const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'figma-webhook-relay',
      },
      body: JSON.stringify({
        event_type: 'figma-variables-updated',
        client_payload: { file_key: body.file_key, file_name: body.file_name, figma_event: body.event_type },
      }),
    })
    return new Response(res.ok ? 'Dispatched' : `GitHub ${res.status}`, { status: res.ok ? 200 : 502 })
  },
}
