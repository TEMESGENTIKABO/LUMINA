import { notFound } from "next/navigation";
import { getAuthorBySlug } from "@/content/cms/fetchers/getAuthor";
import { AuthorBio } from "@/components/author/AuthorBio";
import { AuthorArchive } from "@/components/author/AuthorArchive";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; authorSlug: string }>;
}) {
  const { locale, authorSlug } = await params;
  const result = await getAuthorBySlug(authorSlug);

  if (!result) notFound();

  return (
    <>
      <AuthorBio author={result.author} />
      <AuthorArchive articles={result.articles} locale={locale} />
    </>
  );
}
