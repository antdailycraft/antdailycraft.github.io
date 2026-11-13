import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { posts, normalizeMarkdown } from '../src/lib/content.mjs';
test('legacy post URLs stay unique and unpublished content stays private', () => {
  assert.equal(new Set(posts.map(p => p.url)).size, posts.length);
  assert.ok(posts.some(p => p.url === '/changing-syntax-highlight-in-jekyll/'));
  assert.ok(!posts.some(p => p.slug === 'shortcut'));
  assert.ok(posts.every(p => Number.isFinite(p.date.getTime())));
});
test('legacy Liquid highlights and space-bearing image paths render in Markdown', () => {
  assert.equal(normalizeMarkdown('{% highlight ruby %}\nputs 1\n{% endhighlight %}'), '```ruby\nputs 1\n```');
  assert.equal(normalizeMarkdown('![]({{site.baseurl}}/assets/images/Pasted image.png)'), '![](/assets/images/Pasted%20image.png)');
  assert.ok(posts.find(p => p.slug === 'toddler').html.includes('shiki'));
  assert.ok(posts.find(p => p.slug === 'changing-syntax-highlight-in-jekyll').html.includes('Pasted%20image'));
});
test('post covers use available local files or absolute external URLs', () => {
  for (const post of posts) {
    if (!post.image) continue;
    assert.ok(!post.image.startsWith('/https:'), post.slug);
    if (/^https?:\/\//.test(post.image)) assert.ok(new URL(post.image).hostname);
    else assert.ok(existsSync(post.image.slice(1)), `${post.slug}: ${post.image}`);
  }
});
