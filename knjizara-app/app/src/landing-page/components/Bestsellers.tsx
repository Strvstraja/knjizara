import { useTranslation } from "react-i18next";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { getBooks, useQuery } from "wasp/client/operations";
import { Button } from "../../client/components/ui/button";
import { ArrowRight, ShoppingCart, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function Bestsellers() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: booksData, isLoading } = useQuery(getBooks, {
    page: 1,
    limit: 8,
    bestseller: true,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Najprodavanije knjige
            </h2>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-48 bg-card rounded-lg p-3 animate-pulse">
                <div className="bg-muted h-56 rounded-md mb-3"></div>
                <div className="bg-muted h-3 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const bestsellerBooks = booksData?.books || [];

  if (bestsellerBooks.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Najprodavanije knjige
          </h2>
        </div>

        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'smooth'
            }}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
                .overflow-x-auto::-webkit-scrollbar {
                  display: none;
                }
              `
            }} />
            <div className="flex gap-4">
              {bestsellerBooks.map((book) => (
                <a
                  key={book.id}
                  href={routes.BookDetailRoute.build({ params: { id: book.id } })}
                  className="group flex-shrink-0 w-48 flex"
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 relative flex flex-col w-full">
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="aspect-[3/4] overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={book.coverImage || '/placeholder-book.jpg'}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {book.author}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-bold text-primary">
                          {book.price.toLocaleString('sr-RS')} {t('common.rsd')}
                        </span>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-card hover:bg-accent transition-colors shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-card hover:bg-accent transition-colors shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
