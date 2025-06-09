import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// Blog yazılarını getiren yardımcı fonksiyon
function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);

  const allPosts = fileNames.map((fileName) => {
    // .md uzantısını kaldırarak slug (URL dostu kimlik) oluştur
    const slug = fileName.replace(/\.md$/, '');

    // Markdown dosyasını string olarak oku
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter ile post'un metadata'sını ayrıştır
    const { data } = matter(fileContents);

    return {
      slug,
      ...data as { title: string; date: string; excerpt: string },
    };
  });

  // Yazıları tarihe göre en yeniden en eskiye sırala
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function HomePage() {
  const posts = getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog</h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-500 mb-4">{new Date(post.date).toLocaleDateString('tr-TR')}</p>
            <p className="text-gray-700">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
