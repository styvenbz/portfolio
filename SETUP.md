# Setup

One-time steps to get this from local to live. Run them in order.

---

## 1. GitHub (private repo)

The repo must be **private** — `src/content/` holds case-study text, including
work under NDA. The password gate protects the website, not the repository.

Create an empty private repo at https://github.com/new (no README, no
.gitignore — this project already has both), then:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

---

## 2. Cloudinary (images and video)

1. Sign up at https://cloudinary.com (the free tier is plenty).
2. Copy your **cloud name** from the dashboard.
3. Create an **unsigned upload preset**: Settings → Upload → Upload presets →
   Add, signing mode **Unsigned**. Name it `portfolio`.
4. Upload media there, and paste each asset's **public ID** into the matching
   field in Keystatic.

Until `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set, media slots render a neutral
placeholder — the site still builds and deploys.

---

## 3. Vercel

1. https://vercel.com/new → import the repo. Framework preset: **Next.js**.
2. Add the environment variables from `.env.example` (Settings → Environment
   Variables). At minimum:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `CASE_PASSWORD_DEFAULT` | a shared fallback password |

3. Deploy.

---

## 4. Keystatic GitHub mode (editing on the live site)

Until this is done, `/keystatic` works locally but not in production.

1. Run the app locally and open http://localhost:3000/keystatic — Keystatic
   walks you through creating the GitHub App and prints the values below.
   (Or create it manually at https://github.com/settings/apps/new with
   callback URL `https://<your-domain>/api/keystatic/github/oauth/callback`,
   and repository permissions **Contents: Read & write**, **Pull requests:
   Read & write**, **Metadata: Read-only**.)
2. Install the App on the portfolio repo only.
3. Add to Vercel:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_GITHUB_REPO_OWNER` | your GitHub username |
   | `NEXT_PUBLIC_GITHUB_REPO_NAME` | the repo name |
   | `KEYSTATIC_GITHUB_CLIENT_ID` | from the App |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | from the App |
   | `KEYSTATIC_SECRET` | `openssl rand -base64 32` |

4. Redeploy. `/keystatic` on the live site now signs you in with GitHub; each
   save becomes a commit, which triggers a rebuild.

Storage mode is chosen in `keystatic.config.ts`: local in development, GitHub
in production once the two `NEXT_PUBLIC_GITHUB_REPO_*` vars exist.

---

## 5. Protected case studies

Set `access: Password protected` on the case study in Keystatic, then add the
password in Vercel:

```
CASE_PASSWORD_<SLUG_IN_CAPS>
```

For the slug `internal-platform`, that's `CASE_PASSWORD_INTERNAL_PLATFORM`.
Hyphens become underscores. Without a matching variable the case study stays
locked — the gate fails closed on purpose.

---

## 6. Domain and SEO

Add the custom domain in Vercel → Settings → Domains, then set **Site URL** in
Keystatic under SEO defaults. The sitemap and canonical tags stay empty until
that field is filled in.
