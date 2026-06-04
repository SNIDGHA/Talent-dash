This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Cache Control Strategy

This application implements HTTP caching headers to optimize performance and reduce database load when served via a CDN (like Cloudflare).

### 1. `/api/salaries`
* **Headers**: `Cache-Control: s-maxage=300, stale-while-revalidate=3600`
* **Rationale**:
  * `s-maxage=300` (5 minutes): Salary submissions are active and dynamic. A short 5-minute edge cache TTL keeps the main database directory listing fresh, ensuring new submissions show up relatively quickly.
  * `stale-while-revalidate=3600` (1 hour): Allows serving stale content from cache immediately while fetching the fresh data in the background. This minimizes page load times for users by shielding them from direct database queries, while still ensuring eventual consistency.

### 2. `/api/companies/:slug`
* **Headers**: `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`
* **Rationale**:
  * `s-maxage=3600` (1 hour): Company-specific profiles and aggregated stats change much less frequently than the raw salary feed. A longer 1-hour CDN cache duration is optimal to keep profile pages load times fast.
  * `stale-while-revalidate=86400` (24 hours): Allows serving cached company stats for up to a day while lazily updating them in the background. Since company statistics don't require real-time accuracy, this trade-off significantly improves responsiveness and scales effectively.

## Architecture Decisions

### 1. Page Rendering Strategy (Static vs ISR vs Dynamic)
* **`/` (Landing Page)**: **Static**. Uses static markup for the marketing layout, while Clerk manages auth status on the client. This maximizes performance and minimizes server resource utilization.
* **`/salaries` & `/companies`**: **Incremental Static Regeneration (ISR)**. Configured with a low revalidation TTL (`revalidate = 60`) to serve cached HTML from the CDN edge instantly while lazily updating when changes occur, preventing database connection spikes.
* **`/api/*` & `/compare`**: **Dynamic**. Require real-time inputs (search parameters, dynamic comparisons, and ingestion payloads) which must query the PostgreSQL database fresh at request time.
* **`/submit`**: **Static / Client-Rendered**. An interactive form containing a live total compensation calculator that functions entirely on the client, sending requests to the backend ingest API only on form submission.

### 2. Pagination Design (Page-based vs Cursor-based)
* We chose **Page-based pagination** (using offset `skip` and limit `take` in Prisma queries).
* **Rationale**: For directories (like salary feeds and company lists), users expect a standard tabular interface where they can see the total count of items, jump to specific pages, and click 'Next'/'Prev'. While cursor-based pagination is more performant for infinite-scroll feeds on massive datasets, page-based pagination provides a much better directory exploration user experience for datasets of this scale.

### 3. What We Would Build Differently with Another Day
* **Connection Pooling at the Edge**: Integrate Cloudflare Hyperdrive or Prisma Accelerate. Currently, standard TCP pools are opened from serverless workers, which can lead to connection exhaustion under heavy load.
* **R2 Direct File Uploads**: Build a `/api/upload` endpoint returning pre-signed URLs to upload company logos and document screenshots directly to Cloudflare R2 from the browser.
* **Elastic Search Integration**: Replace the simple Prisma database `contains` search with a search index (like Algolia or Elasticsearch) to support fuzzy matching and fast query auto-complete.

### 4. What Was Not Built & Why
* **Image Processing Pipeline**: We did not build a image-resizing/crop service for uploaded logo files. Users currently use default generated letter-avatars or provide image URLs. This was scoped out to prioritize robust database schemas, normalization logic, and core page layouts.
* **Interactive Forum Pages**: Forum components are currently placeholder links or static guides. Real-time community forums require advanced WebSockets or live polling, which was deferred to focus on core salary comparison tools.
