import { useTranslation } from "react-i18next";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { getCategories, useQuery } from "wasp/client/operations";
import { BookOpen } from "lucide-react";

export default function Categories() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useQuery(getCategories);

  if (isLoading) {
    return (
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t('landing.categories.title')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="bg-muted h-12 w-12 rounded-full mx-auto mb-3"></div>
                <div className="bg-muted h-4 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('landing.categories.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('landing.categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 justify-items-center">
          {categories?.map((category) => (
            <a
              key={category.id}
              href={`${routes.BooksRoute.to}?category=${category.slug}`}
              className="group w-full"
            >
              <div className="bg-card hover:bg-accent rounded-lg p-6 text-center transition-colors duration-200 shadow-sm hover:shadow-md w-full">
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center transition-colors">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
