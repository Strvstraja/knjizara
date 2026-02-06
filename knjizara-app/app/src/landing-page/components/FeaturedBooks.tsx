import { useTranslation } from "react-i18next";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { getBooks, useQuery } from "wasp/client/operations";
import { Button } from "../../client/components/ui/button";
import { ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function FeaturedBooks() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: booksData, isLoading } = useQuery(getBooks, {
    page: 1,
    limit: 8,
    featured: true,
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('landing.featured.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="bg-muted h-64 rounded-md mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredBooks = booksData?.books || [];

  return (
    <section className="py-16 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t('landing.featured.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('landing.featured.subtitle')}
          </p>
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
            <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
              {featuredBooks.map((book) => (
                <a
                  key={book.id}
                  href={routes.BookDetailRoute.build({ params: { id: book.id } })}
                  className="group flex-shrink-0 w-64 flex"
                >
                  <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col w-full">
                    <div className="aspect-[3/4] overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={book.coverImage || '/placeholder-book.jpg'}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-medium text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors h-12">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {book.author}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-semibold text-primary">
                            {book.price.toLocaleString('sr-RS')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {t('common.rsd')}
                          </span>
                        </div>
                        <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full bg-card hover:bg-muted transition-colors shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full bg-card hover:bg-muted transition-colors shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </button>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <WaspRouterLink to={routes.BooksRoute.to}>
              {t('landing.featured.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </WaspRouterLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
