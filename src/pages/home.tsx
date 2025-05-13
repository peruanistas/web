import { HomeFeed } from "@/components/feed";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeBanner } from "@/components/home_banner";

export function HomePage() {
  return (
    <main>
      <Header />
      <HomeBanner />
      <HomeFeed />
      <Footer />
    </main>
  );
}
