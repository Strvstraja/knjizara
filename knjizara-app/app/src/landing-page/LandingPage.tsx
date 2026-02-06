import Hero from "./components/Hero";
import FeaturedBooks from "./components/FeaturedBooks";
import Bestsellers from "./components/Bestsellers";
import NewArrivals from "./components/NewArrivals";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="isolate -mt-0">
        <Hero />
        <FeaturedBooks />
        <Bestsellers />
        <NewArrivals />
      </main>
    </div>
  );
}
