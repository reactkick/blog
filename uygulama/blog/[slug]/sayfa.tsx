import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// Belirli bir slug'a sahip yazının verilerini getiren fonksiyon
async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Metadata ve içeriği ayır
  const { data, content } = matter(fileContents);

  // Markdown'ı HTML'e çevir
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...data as { title: string; date: string; author: string },
  };
}

// Sayfa component'i
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostData(params.slug);

  return (
    <article className="prose lg:prose-xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-8">
        {post.author} tarafından {new Date(post.date).toLocaleDateString('tr-TR')} tarihinde yayınlandı.
      </p>
      
      {/* Markdown'dan dönüştürülen HTML'i güvenli bir şekilde render et */}
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}

// Build sırasında hangi path'lerin oluşturulacağını Next.js'e bildiren fonksiyon
export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.md$/, ''),
  }));
}
