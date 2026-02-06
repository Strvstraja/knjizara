import type { CookieConsentConfig } from "vanilla-cookieconsent";

declare global {
  interface Window {
    dataLayer: any;
  }
}

const getConfig = (lang: string = 'sr-Latn') => {
  const isCyrillic = lang === 'sr-Cyrl';
  // See https://cookieconsent.orestbida.com/reference/configuration-reference.html for configuration options.
  const config: CookieConsentConfig = {
    // Default configuration for the modal.
    root: "body",
    autoShow: true,
    disablePageInteraction: false,
    hideFromBots: import.meta.env.PROD ? true : false, // Set this to false for dev/headless tests otherwise the modal will not be visible.
    mode: "opt-in",
    revision: 0,

    // Default configuration for the cookie.
    cookie: {
      name: "cc_cookie",
      domain: location.hostname,
      path: "/",
      sameSite: "Lax",
      expiresAfterDays: 365,
    },

    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    categories: {
      necessary: {
        enabled: true, // this category is enabled by default
        readOnly: true, // this category cannot be disabled
      },
      analytics: {
        autoClear: {
          cookies: [
            {
              name: /^_ga/, // regex: match all cookies starting with '_ga'
            },
            {
              name: "_gid", // string: exact cookie name
            },
          ],
        },

        // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
        services: {
          ga: {
            label: "Google Analytics",
            onAccept: () => {
              try {
                const GA_ANALYTICS_ID = import.meta.env
                  .REACT_APP_GOOGLE_ANALYTICS_ID;
                if (!GA_ANALYTICS_ID || !GA_ANALYTICS_ID.length) {
                  return;
                }
                window.dataLayer = window.dataLayer || [];
                function gtag(..._args: unknown[]) {
                  (window.dataLayer as Array<any>).push(arguments);
                }
                gtag("js", new Date());
                gtag("config", GA_ANALYTICS_ID);

                // Adding the script tag dynamically to the DOM.
                const script = document.createElement("script");
                script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ANALYTICS_ID}`;
                script.async = true;
                document.body.appendChild(script);
              } catch (error) {
                console.error(error);
              }
            },
            onReject: () => {},
          },
        },
      },
    },

    language: {
      default: "sr",
      translations: {
        sr: {
          consentModal: {
            title: isCyrillic ? "Користимо колачиће" : "Koristimo kolačiće",
            description: isCyrillic
              ? "Користимо колачиће за аналитику како бисмо побољшали ваше искуство. Прихватањем се слажете са коришћењем ових колачића."
              : "Koristimo kolačiće za analitiku kako bismo poboljšali vaše iskustvo. Prihvatanjem se slažete sa korišćenjem ovih kolačića.",
            acceptAllBtn: isCyrillic ? "Прихвати све" : "Prihvati sve",
            acceptNecessaryBtn: isCyrillic ? "Само неопходни" : "Samo neophodni",
            footer: `
            <a href="/privacy-policy" target="_blank">${isCyrillic ? "Политика приватности" : "Politika privatnosti"}</a>
            <a href="/terms" target="_blank">${isCyrillic ? "Услови коришћења" : "Uslovi korišćenja"}</a>
                    `,
          },
          preferencesModal: {
            sections: [],
          },
        },
      },
    },
  };

  return config;
};

export default getConfig;
