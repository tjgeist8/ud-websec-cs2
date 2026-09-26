# Chalk

Announcement wall for a campus robotics club. Members post shop hours, ride shares, and missing tools. Officers can pin posts and keep a private desk page for things that should not live on the public wall.

Next.js App Router, server actions, and SQLite.

## Features

- Register with a `.edu` email, sign in, sign out
- Public wall with pinned posts
- Compose a post with light markdown (`**bold**`, `*italic*`, `` `code` ``, headings, links)
- Authors and officers can take a post down
- Officer desk (role-gated)

## Run locally

You need Node 22.13+.

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database is created and seeded on first request at `data/chalk.db`.

```bash
npm run build && npm start
npm run seed
```

## Run with Docker

```bash
docker compose up --build
```

The app listens on port 3000. Data lives in the `chalk-data` volume.

## Deploy on Render

For a Node web service, use `npm ci && npm run build` as the build command and `npm start` as the start command. Use Node.js 22.13 or later. Render provides the `PORT` value used by the start script.

Attach a persistent disk mounted at `/var/data` and set `DATABASE_PATH` to `/var/data/chalk.db`. Without persistent storage, SQLite data can be lost on redeploy or restart. Keep this service to one instance; use PostgreSQL if you need multiple instances.

Demo accounts are created only outside production. After registering the intended officer account, promote it from the Render shell by replacing the email below with that account's email:

```bash
node -e 'const { DatabaseSync } = require("node:sqlite"); const db = new DatabaseSync(process.env.DATABASE_PATH); const result = db.prepare("UPDATE users SET role = ? WHERE email = ?").run("officer", "approved@campus.edu"); console.log(`Updated ${result.changes} user(s)`); db.close();'
```

## Demo accounts

These accounts are for local development only. They are not seeded in production.

| Email | Password | Role |
|---|---|---|
| `maya@campus.edu` | `campus123` | member |
| `devon@campus.edu` | `campus123` | member |
| `priya@campus.edu` | `officer123` | officer |

Register your own account if you want; it just has to end in `.edu`. New accounts are members.

## Project layout

```
app/page.js              Public wall
app/compose/page.js      New post
app/login/page.js        Sign in
app/register/page.js     Create account
app/mod/page.js          Officer desk
app/layout.js            Shell + nav
lib/actions.js           Server actions
lib/auth.js              Sessions
lib/db.js                SQLite schema
lib/markdown.js          Post formatting
lib/seed.js              First-run demo data
components/PostBody.js   Renders a formatted post
```

## Assignment notes

Host this somewhere your classmates and instructor can reach. Walk the running app until you can explain:

- which code runs on the server vs in the browser
- how a session cookie becomes `currentUser`
- how a post body gets from the compose form onto the wall
- what an officer can see that a member cannot

Then look for a security defect in the running system, document how to trigger it, and patch it without breaking normal markdown on the wall. Submit the hosted URL, a short architecture sketch, the writeup, and the patched repo.
