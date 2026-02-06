import { useTranslation } from "react-i18next";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { getBooks, useQuery } from "wasp/client/operations";
import { Button } from "../../client/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";

export default function FeaturedBooks() {
  const { t } = useTranslation();
  const { data: booksData, isLoading } = useQuery(getBooks, {
    page: 1,
    limit: 8,
    featured: true,
  });

  if (isLoading) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
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
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('landing.featured.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('landing.featured.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <a
              key={book.id}
              href={routes.BookDetailRoute.build({ params: { id: book.id } })}
              className="group h-full flex"
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
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary">
                      {book.price.toLocaleString('sr-RS')} {t('common.rsd')}
                    </span>
                    <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </a>
          ))}
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
