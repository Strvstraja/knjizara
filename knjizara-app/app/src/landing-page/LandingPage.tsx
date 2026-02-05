import Footer from "./components/Footer";
import Hero from "./components/Hero";
import FeaturedBooks from "./components/FeaturedBooks";
import NewArrivals from "./components/NewArrivals";
import Categories from "./components/Categories";
import { footerNavigation } from "./contentSections";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="isolate">
        <Hero />
        <FeaturedBooks />
        <Categories />
        <NewArrivals />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}
