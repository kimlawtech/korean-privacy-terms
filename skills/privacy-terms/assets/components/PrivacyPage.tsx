import { LabelingCard } from "@/components/legal/LabelingCard"
import PrivacyContent from "@/content/legal/privacy-policy.mdx"

export const metadata = {
  title: "개인정보 처리방침",
  description: "서비스의 개인정보 처리방침",
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          개인정보 처리방침
        </h1>
      </header>

      <section aria-labelledby="labeling" className="mb-16">
        <h2 id="labeling" className="sr-only">
          주요 내용 요약
        </h2>
        <LabelingCard layout="grid" density="comfortable" iconSet="none" />
      </section>

      <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-base prose-p:leading-relaxed prose-p:text-foreground prose-li:text-foreground prose-table:text-sm prose-th:font-medium prose-a:text-foreground prose-a:underline prose-a:decoration-muted-foreground hover:prose-a:decoration-foreground prose-strong:font-medium">
        <PrivacyContent />
      </article>
    </main>
  )
}
