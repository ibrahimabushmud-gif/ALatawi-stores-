import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await db.page.findUnique({ where: { slug: params.slug } });
  return { title: page?.seoTitle || page?.title, description: page?.seoDescription };
}

export default async function StaticPage({ params }: { params: { slug: string } }) {
  const page = await db.page.findUnique({ where: { slug: params.slug, isActive: true } });
  if (!page) notFound();
  return (
    <div className="container-x" style={{ paddingTop: 32, maxWidth: 800 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 20px" }}>{page.title}</h1>
      <div className="card" style={{ padding: 24, lineHeight: 2, fontSize: 15, whiteSpace: "pre-line" }}>
        {page.content}
      </div>
    </div>
  );
}
