import Hero from "./components/Hero";
import FeaturedBooks from "./components/FeaturedBooks";
import NewArrivals from "./components/NewArrivals";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="isolate">
        <Hero />
        <FeaturedBooks />
        <NewArrivals />
      </main>
    </div>
  );
}
