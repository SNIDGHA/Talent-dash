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

