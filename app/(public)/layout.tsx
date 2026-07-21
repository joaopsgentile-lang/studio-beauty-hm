import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getLocalBusinessSchema } from "@/lib/seo/localBusinessSchema";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessSchema()) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
