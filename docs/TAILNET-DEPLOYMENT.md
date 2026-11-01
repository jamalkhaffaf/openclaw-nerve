# Fork deployment on macOS

This checkout runs independently of Cockpit. Production HTTP binds only to
127.0.0.1:3081; Tailscale Serve forwards private HTTPS port 8446 to it.
No Funnel/public-internet exposure is enabled.

## Runtime

- Build: `npm ci && npm run build`
- Launcher: `node scripts/start-tailnet.mjs`
- Installed LaunchAgent: `~/Library/LaunchAgents/dev.jamjam.openclaw-nerve.plist`
- Restart: `launchctl kickstart -k gui/$(id -u)/dev.jamjam.openclaw-nerve`
- Status: `launchctl print gui/$(id -u)/dev.jamjam.openclaw-nerve`
- Health: `curl -fsS http://127.0.0.1:3081/health`
- Route: `tailscale serve --bg --https=8446 http://127.0.0.1:3081`
- Disable only this route: `tailscale serve --https=8446 off`

The LaunchAgent starts at user login and supervises exits. It does not promise
pre-login availability after reboot. Tailscale Serve uses its persisted background
configuration. Logs are in ignored `.nerve/service.log` and `service-error.log`.

## Credentials and state

The launcher obtains the active local gateway token without logging it or storing
it in this repository. It falls back to inherited environment or a literal config
token and rejects unresolved SecretRef objects. Start the gateway first.

Ignored `.env` contains the scrypt login-password hash, durable session signing
secret, exact public-origin allowlist, and server settings. These must remain
private. The initial generated login password is in mode-0600
`.nerve/access-password` for owner recovery. Never commit `.env` or `.nerve`.
The gateway origin was appended to its existing allowlist; other entries were
preserved. The private pre-change config backup is in `.nerve`.

Agent data remains in the existing OpenClaw directories. The new UI connects to the
same live gateway; it is a separate UI deployment, not a separate agent backend.

## Verified 2026-11-01

Production build and launcher syntax passed. HTTPS health reported gateway OK.
Password login passed. Chrome DevTools loaded the deployed HTTPS UI, signed in,
and observed CONNECTED and populated sessions/history. No chat message was sent.
Crash/reboot recovery and microphone/TTS end-to-end use were not tested.
Optional OpenAI/Replicate voice-provider keys are not configured.
