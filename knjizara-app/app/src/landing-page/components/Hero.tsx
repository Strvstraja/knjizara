import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useTranslation } from "react-i18next";
import { BookOpen, ShoppingCart, Truck } from "lucide-react";
import { Button } from "../../client/components/ui/button";
import logoLatin from "../../client/static/csmk.png";
import logoCyrillic from "../../client/static/csmk1.png";

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isCyrillic = i18n.language === 'sr-Cyrl';

  return (
    <div className="relative w-full">
      <div className="px-6 lg:px-8 pb-8">
        <div className="max-w-8xl mx-auto">
          <div className="mx-auto max-w-5xl text-center">
            {/* Logo */}
            <div className="flex justify-center overflow-hidden -mb-24">
              <img 
                src={isCyrillic ? logoLatin : logoCyrillic}
                alt="Logo"
                className="w-full max-w-4xl -mt-[15%]"
                style={{ 
                  clipPath: 'inset(30% 0px)',
                  transform: 'scale(1.3)'
                }}
              />
            </div>
            <h1 className="text-foreground text-5xl font-bold sm:text-6xl">
              {t('landing.hero.title')}{" "}
              <span className="text-gradient-primary">{t('landing.hero.highlight')}</span>
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
              {t('landing.hero.subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" variant="default" asChild>
                <WaspRouterLink to={routes.BooksRoute.to}>
                  <BookOpen className="mr-2 h-5 w-5" />
                  {t('landing.hero.browseBooks')}
                </WaspRouterLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <WaspRouterLink to={routes.SignupRoute.to}>
                  {t('landing.hero.signup')} <span aria-hidden="true">→</span>
                </WaspRouterLink>
              </Button>
            </div>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                {t('landing.features.wideSelection.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('landing.features.wideSelection.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                {t('landing.features.easyOrdering.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('landing.features.easyOrdering.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                {t('landing.features.freeShipping.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('landing.features.freeShipping.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopGradient() {
  return (
    <div
      className="absolute right-0 top-0 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:top-0"
      aria-hidden="true"
    >
      <div
        className="aspect-[1020/880] w-[70rem] flex-none bg-gradient-to-tr from-amber-400 to-purple-300 opacity-10 sm:right-1/4 sm:translate-x-1/2 dark:hidden"
        style={{
          clipPath:
            "polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)",
        }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-65rem)]"
      aria-hidden="true"
    >
      <div
        className="relative aspect-[1020/880] w-[90rem] bg-gradient-to-br from-amber-400 to-purple-300 opacity-10 sm:-left-3/4 sm:translate-x-1/4 dark:hidden"
        style={{
          clipPath: "ellipse(80% 30% at 80% 50%)",
        }}
      />
    </div>
  );
}
