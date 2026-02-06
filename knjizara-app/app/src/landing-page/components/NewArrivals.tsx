import { useTranslation } from "react-i18next";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { getBooks, useQuery } from "wasp/client/operations";
import { Button } from "../../client/components/ui/button";
import { ArrowRight, ShoppingCart, Sparkles } from "lucide-react";

export default function NewArrivals() {
  const { t } = useTranslation();
  const { data: booksData, isLoading } = useQuery(getBooks, {
    page: 1,
    pageSize: 6,
  });

  if (isLoading) {
    return (
      <section className="py-16 px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-2">
              {t('landing.newArrivals.title')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg p-3 animate-pulse">
                <div className="bg-muted aspect-[3/4] rounded-md mb-3"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const books = booksData?.books || [];
  const newArrivals = books.slice(0, 6);

  return (
    <section className="py-16 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">
              {t('landing.newArrivals.title')}
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            {t('landing.newArrivals.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {newArrivals.map((book) => (
            <a
              key={book.id}
              href={routes.BookDetailRoute.build({ params: { id: book.id } })}
              className="group h-full flex"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col w-full">
                <div className="aspect-[3/4] overflow-hidden bg-muted relative flex-shrink-0">
                  <img
                    src={book.coverImage || '/placeholder-book.jpg'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                    {t('landing.newArrivals.badge')}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors h-10">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-semibold text-primary">
                        {book.price.toLocaleString('sr-RS')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t('common.rsd')}
                      </span>
                    </div>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild className="w-full">
            <WaspRouterLink to={routes.BooksRoute.to}>
              {t('landing.newArrivals.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </WaspRouterLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
