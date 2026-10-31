const { test, expect } = require('@playwright/test');
test('deployed security headers are effective', async ({ request }) => {
  test.skip(!process.env.SECURITY_PREVIEW_URL, 'Set SECURITY_PREVIEW_URL to verify the deployed Cloudflare headers');
  const response = await request.get(process.env.SECURITY_PREVIEW_URL);
  expect(response.ok()).toBeTruthy();
  const h=response.headers();
  expect(h['content-security-policy']).toContain("script-src 'self'");
  expect(h['content-security-policy']).toContain("frame-ancestors 'none'");
  expect(h['content-security-policy']).not.toMatch(/script-src[^;]*'unsafe-inline'/);
  expect(h['x-content-type-options']).toBe('nosniff');
  expect(h['x-frame-options']).toBe('DENY');
  expect(h['referrer-policy']).toBe('no-referrer');
});
