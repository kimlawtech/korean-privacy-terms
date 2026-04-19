import TermsContent from "@/content/legal/terms-of-service.mdx"

export const metadata = {
  title: "이용약관",
  description: "서비스 이용약관",
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">이용약관</h1>
      </header>

      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-base prose-p:leading-relaxed prose-p:text-foreground prose-li:text-foreground prose-table:text-sm prose-th:font-medium prose-a:text-foreground prose-a:underline prose-a:decoration-muted-foreground hover:prose-a:decoration-foreground prose-strong:font-medium">
        <TermsContent />
      </article>
    </main>
  )
}
