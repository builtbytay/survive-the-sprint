# 💻 Survive the Sprint

**Keep the Developer Alive.™**

*Five days. One developer. Zero reasonable stakeholders.*

Welcome to **Survive the Sprint**, a tiny browser game about the very normal, very healthy experience of working in software development.

Your mission? Keep your developer caffeinated, productive, and emotionally intact long enough to survive Friday's deployment.

Easy, right?

Someone just scheduled a mandatory meeting at 4:55 PM.

**🎮 [Play Survive the Sprint](https://sprint.taylord.ink/)**


## 🧑‍💻 The situation

You are responsible for one developer.

Unfortunately, that developer has:

- ☕ A caffeine dependency masquerading as a productivity strategy
- 🐛 Bugs that reproduce faster than anyone can fix them
- 📅 Meetings that probably should have been emails
- 📋 A backlog that grows when nobody is looking
- 🧠 A finite supply of patience
- 🚀 A Friday deployment that absolutely cannot go wrong

Keep shipping tickets, manage the chaos, and survive the week.

Perform well enough and you might even get promoted!

*Congratulations. Your reward is more responsibility.*

## 🎮 How to play

Guide your developer around the office and decide what deserves attention before the workday runs out.

| Station | Your questionable responsibility |
|---|---|
| 💻 Code | Ship tickets and make progress |
| ☕ Coffee | Refill your developer's will to live |
| 🖥️ Servers | Fix bugs before they become features |
| 📅 Meetings | Attend, decline, or regret your choices |
| 🛋️ Break | Recover some morale and patience |

You'll also encounter surprise interruptions, competing priorities, accumulating technical debt, and increasingly absurd career responsibilities.

**Survive Monday through Friday.** Then do it again, because apparently we still have jobs.

### ⌨️ Controls

| Control | Action |
|---|---|
| WASD / Arrow keys | Move around the office |
| 1–5 | Navigate to workstations |
| Space | Interact near a workstation |
| B | Open the sprintboard |
| P | Pause the chaos |
| Mouse / Touch | Play using on-screen controls |

Single-key shortcuts can be disabled in the accessibility settings.

### ♿ Play your way

Because accessibility shouldn't be a stretch goal.

- Keyboard-accessible gameplay and dialogs
- Screen-reader announcements and status information
- Reduced-motion support
- Relaxed timing mode for a less frantic workday
- Optional single-key shortcuts
- Responsive mobile controls

Automated accessibility testing is included, with additional manual assistive-technology testing still part of ongoing validation.

## 🛠️ Under the hood

Built with **HTML, CSS, and vanilla JavaScript**.

No framework. No backend. No elaborate dependency tree required to render a rubber duck.

Hosted on **Cloudflare Workers Static Assets**, with:

- Content Security Policy and browser security headers
- Playwright end-to-end regression tests
- axe-core accessibility checks
- Automated GitHub Actions workflows
- Protected `main` branch and pull-request reviews

The game itself requires no accounts, advertisements, or server-side player data storage. Your best score and accessibility preferences stay in your browser.

### Run locally

Clone the repo and serve the `public` directory:

```bash
python3 -m http.server 4173 --directory public
```

Open `http://localhost:4173`.

To run the automated test suite:

```bash
npm install
npx playwright install chromium
npm test
```

See [TESTING.md](TESTING.md) for testing details, [CHANGELOG.md](CHANGELOG.md) for version history, and [RELEASING.md](RELEASING.md) for release procedures.

## 🦆 A note about the duck

There is a rubber duck.

It knows things.

That's all you're getting.

## 💖 Made by

**[Taylor Waldon](https://taylord.ink)** / [@builtbytay](https://github.com/builtbytay)

Product person. WordPress enthusiast. Professional backlog survivor.

Made for developers, product managers, and anyone who has ever heard the words *"Can we just squeeze this into the sprint?"*

---

**[🎮 Play the game](https://sprint.taylord.ink/)**

*No ads. No accounts. No mercy.*

**Remember: The sprint ends. The backlog does not.**
