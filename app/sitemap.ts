import type { MetadataRoute } from 'next';
import { publicationService } from '@/lib/services/publication.service';

// Fetch publications at request time instead of freezing them at build time
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // TODO: confirm the real production domain (also fix in robots.ts)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://TODO.example.com';

  const staticRoutes = ['', '/about', '/newsletter', '/search', '/team'].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  );

  let publicationRoutes: MetadataRoute.Sitemap = [];

  try {
    // First call learns the total count (service pages at 12 by default)
    const { total } = await publicationService.getPublished({ limit: 1 });
    const { publications } = await publicationService.getPublished({
      limit: Math.max(total, 1),
    });

    publicationRoutes = publications.map((pub) => ({
      url: `${baseUrl}/${pub.type === 'tabloid' ? 'tabloids' : 'stories'}/${pub.slug}`,
      lastModified: new Date(pub.updatedAt ?? Date.now()),
    }));
  } catch {
    // DB unreachable — static routes only, better than a crashed sitemap
  }

  return [...staticRoutes, ...publicationRoutes];
}