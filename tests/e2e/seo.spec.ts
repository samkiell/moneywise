import { test, expect } from '@playwright/test';

test('/robots.txt is valid plain text and references sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Disallow: /admin/');
  expect(body).toContain('sitemap.xml');
});

test('story page includes Article JSON-LD', async ({ page }) => {
  // We visit a story page to check if our hidden code is there.
  // Note: replace 'test-story' with an actual slug from your database if tests fail
  await page.goto('/stories/test-story'); 
  const ld = page.locator('script[type="application/ld+json"]');
  
  // Checks if the hidden JSON-LD script exists on the page
  await expect(ld).toHaveCount(1);
});