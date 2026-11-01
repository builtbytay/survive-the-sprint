// Read-only production social-preview audit. Makes no changes to the website.
import assert from 'node:assert/strict';

const origin = (process.env.SOCIAL_CARD_URL || 'https://sprint.taylord.ink/').replace(/\/?$/, '/');
const imageURL = new URL('social-card-v102.png', origin).href;
const twitterbot = 'Twitterbot/1.0';
const browser = 'Mozilla/5.0 (compatible; BrowserSocialCardDiagnostic/1.0)';
const failures = [];

async function request(url, userAgent) {
  const r = await fetch(url, {
    headers: { 'User-Agent': userAgent, 'Accept': '*/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  });
  const bytes = Buffer.from(await r.arrayBuffer());
  const result = {
    url, userAgent, status: r.status, finalURL: r.url,
    type: r.headers.get('content-type'),
    bytes: bytes.length,
    cfMitigated: r.headers.get('cf-mitigated'),
    cacheControl: r.headers.get('cache-control'),
    server: r.headers.get('server'),
  };
  console.log(JSON.stringify(result));
  return { ...result, bytesBuffer: bytes };
}

async function probe(name, run) {
  try {
    await run();
  } catch (e) {
    failures.push(name + ': ' + (e?.message || String(e)));
  }
}
let html = '';
await probe('HTML as Twitterbot', async () => {
  const r = await request(origin, twitterbot);
  assert.equal(r.status, 200, 'Twitterbot must fetch HTML with 200');
  assert.match(r.type || '', /text\/html/i);
  assert.equal(r.cfMitigated, null, 'Cloudflare challenge for Twitterbot');
  html = r.bytesBuffer.toString('utf8');
  for (const [name, value] of [
    ['twitter:card', 'summary_large_image'],
    ['twitter:image', imageURL],
    ['og:image', imageURL],
  ]) {
    const tag = html.match(new RegExp('<meta\\s+[^>]*(?:name|property)="' + name.replace(':', '\\:') + '"[^>]*>', 'i'))?.[0];
    assert.ok(tag, 'Missing raw HTML tag: ' + name);
    assert.ok(tag.includes('content="' + value + '"'), 'Incorrect ' + name + ': ' + tag);
    console.log(name + ' = ' + value);
  }
  assert.equal((html.match(/name="twitter:card"/g) || []).length, 1, 'Duplicate twitter:card tags');
});

await probe('PNG as Twitterbot', async () => {
  const r = await request(imageURL, twitterbot);
  assert.equal(r.status, 200, 'Twitterbot must fetch image with 200');
  assert.equal(r.cfMitigated, null, 'Cloudflare image challenge for Twitterbot');
  assert.match(r.type || '', /image\/png/i, 'Expected image/png');
  assert.ok(r.bytesBuffer.length <= 5 * 1024 * 1024, 'Image exceeds 5MB');
  const b = r.bytesBuffer;
  assert.ok(b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'Invalid PNG signature');
  assert.equal(b.toString('ascii',12,16), 'IHDR');
  const width=b.readUInt32BE(16), height=b.readUInt32BE(20);
  console.log('PNG dimensions: ' + width + 'x' + height + '; color type ' + b[25]);
  assert.equal(width, 1200);
  assert.equal(height, 630);
  assert.ok(b.includes(Buffer.from('IEND')), 'PNG missing IEND');
});

await probe('PNG as browser', async () => {
  const r = await request(imageURL, browser);
  assert.equal(r.status, 200, 'Browser must fetch social image with 200');
  assert.match(r.type || '', /image\/png/i);
});

await probe('Robots policy', async () => {
  const r = await request(new URL('robots.txt',origin).href, twitterbot);
  if (r.status === 404) {
    console.log('No robots.txt found: no site-level crawler restriction');
    return;
  }
  assert.equal(r.status, 200, 'robots.txt unexpectedly inaccessible');
  const t=r.bytesBuffer.toString('utf8');
  console.log('robots.txt content: ' + t.slice(0,1000));
  const relevant=t.split(/(?=^User-agent:\s*)/im).filter(section=>/User-agent:\s*(\*|Twitterbot)/i.test(section));
  assert.ok(!relevant.some(section => /^Disallow:\s*\/\s*$/im.test(section)), 'Robots blocks Twitterbot (or all bots)');
});

console.log(failures.length ? '\nSOCIAL CARD AUDIT FAILED:\n- ' + failures.join('\n- ') : '\nSOCIAL CARD AUDIT PASSED: public HTML and image accessible with Twitterbot user-agent.');
if (failures.length) process.exitCode = 1;
