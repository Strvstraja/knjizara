import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const srLatn = {
  "nav": {
    "books": "Knjige",
    "cart": "Korpa",
    "login": "Prijavi se",
    "logout": "Odjavi se",
    "account": "Nalog"
  },
  "cart": {
    "title": "Korpa",
    "empty": "Vaša korpa je prazna",
    "continueShopping": "Nastavite sa kupovinom",
    "subtotal": "Međuzbir",
    "shipping": "Dostava",
    "total": "Ukupno",
    "free": "Besplatno",
    "freeShippingProgress": "Dodaj još {{amount}} {{currency}} za besplatnu dostavu!",
    "freeShippingAchieved": "Ostvarili ste besplatnu dostavu!",
    "goToCheckout": "Idi na plaćanje",
    "viewCart": "Pogledaj korpu",
    "remove": "Ukloni",
    "orderSummary": "Pregled porudžbine",
    "continueToPayment": "Nastavi na plaćanje"
  },
  "books": {
    "title": "Knjige",
    "search": "Pretraži po naslovu, autoru, ISBN...",
    "searchButton": "Pretraži",
    "allCategories": "Sve kategorije",
    "sortNewest": "Najnovije",
    "sortPriceAsc": "Cena: rastuće",
    "sortPriceDesc": "Cena: opadajuće",
    "sortTitle": "Naslov",
    "addToCart": "Dodaj u korpu",
    "noBooks": "Nema pronađenih knjiga.",
    "outOfStock": "Nema na stanju",
    "previous": "Prethodna",
    "next": "Sledeća",
    "page": "Strana",
    "of": "od"
  },
  "address": {
    "fullName": "Ime i prezime",
    "street": "Ulica i broj",
    "postalCode": "Poštanski broj",
    "city": "Grad",
    "phone": "Telefon",
    "setDefault": "Postavi kao podrazumevanu adresu",
    "cancel": "Otkaži",
    "save": "Sačuvaj adresu",
    "default": "Podrazumevano"
  },
  "checkout": {
    "title": "Plaćanje",
    "step1": "Adresa dostave",
    "step2": "Način dostave",
    "step3": "Plaćanje",
    "step4": "Pregled",
    "selectAddress": "Izaberite adresu dostave",
    "noAddresses": "Nemate sačuvanih adresa.",
    "addNewAddress": "+ Dodaj novu adresu",
    "continue": "Nastavi",
    "back": "Nazad",
    "yourOrder": "Vaša porudžbina",
    "quantity": "Količina",
    "selectDelivery": "Izaberite način dostave",
    "standardDelivery": "Standardna dostava",
    "standardDeliveryTime": "Isporuka za 3-5 radnih dana",
    "expressDelivery": "Ekspresna dostava",
    "expressDeliveryTime": "Isporuka za 1-2 radna dana",
    "selectPayment": "Izaberite način plaćanja",
    "cashOnDelivery": "Plaćanje pouzećem",
    "cashOnDeliveryDesc": "Platite kuriru prilikom preuzimanja",
    "recommended": "Preporučeno",
    "cardPayment": "Platna kartica",
    "cardPaymentDesc": "Visa, Mastercard, Maestro",
    "orderReview": "Pregled porudžbine",
    "shippingAddress": "Adresa dostave",
    "deliveryMethod": "Način dostave",
    "paymentMethod": "Način plaćanja",
    "items": "Stavke",
    "confirmOrder": "Potvrdi porudžbinu"
  },
  "bookDetail": {
    "notFound": "Knjiga nije pronađena",
    "backToCatalog": "Povratak na katalog",
    "inStock": "Na stanju ({{count}} kom.)",
    "addedToCart": "Dodato u korpu",
    "alreadyInCart": "Ova knjiga je već u vašoj korpi",
    "specifications": "Specifikacije",
    "isbn": "ISBN",
    "pageCount": "Broj strana",
    "binding": "Povez",
    "hardcover": "Tvrdi",
    "softcover": "Meki",
    "publisher": "Izdavač",
    "year": "Godina",
    "language": "Jezik",
    "categories": "Kategorije",
    "description": "Opis"
  },
  "orders": {
    "title": "Moje porudžbine",
    "noOrders": "Nemate porudžbina",
    "noOrdersMessage": "Još uvek niste napravili nijednu porudžbinu.",
    "startShopping": "Počnite sa kupovinom",
    "orderNumber": "Porudžbina",
    "placedOn": "Naručeno",
    "total": "Ukupno",
    "items": "Stavke",
    "quantity": "Količina",
    "shippingAddress": "Adresa dostave",
    "errorLoading": "Greška pri učitavanju porudžbina.",
    "status": {
      "pending": "Na čekanju",
      "processing": "U obradi",
      "shipped": "Poslato",
      "delivered": "Dostavljeno",
      "cancelled": "Otkazano"
    }
  },
  "orderSuccess": {
    "title": "Porudžbina uspešna!",
    "message": "Vaša porudžbina je uspešno primljena i biće obrađena uskoro.",
    "whatNext": "Šta dalje?",
    "emailConfirmation": "Dobićete email potvrdu sa detaljima porudžbine. Možete pratiti status vaše porudžbine u vašem profilu.",
    "viewOrders": "Pogledaj moje porudžbine",
    "continueShopping": "Nastavi sa kupovinom",
    "questions": "Imate pitanja? Kontaktirajte nas na"
  },
  "common": {
    "rsd": "RSD",
    "loading": "Učitavanje...",
    "error": "Greška"
  }
};

const srCyrl = {
  "nav": {
    "books": "Књиге",
    "cart": "Корпа",
    "login": "Пријави се",
    "logout": "Одјави се",
    "account": "Налог"
  },
  "cart": {
    "title": "Корпа",
    "empty": "Ваша корпа је празна",
    "continueShopping": "Наставите са куповином",
    "subtotal": "Међузбир",
    "shipping": "Достава",
    "total": "Укупно",
    "free": "Бесплатно",
    "freeShippingProgress": "Додај још {{amount}} {{currency}} за бесплатну доставу!",
    "freeShippingAchieved": "Остварили сте бесплатну доставу!",
    "goToCheckout": "Иди на плаћање",
    "viewCart": "Погледај корпу",
    "remove": "Уклони",
    "orderSummary": "Преглед поруџбине",
    "continueToPayment": "Настави на плаћање"
  },
  "books": {
    "title": "Књиге",
    "search": "Претражи по наслову, аутору, ISBN...",
    "searchButton": "Претражи",
    "allCategories": "Све категорије",
    "sortNewest": "Најновије",
    "sortPriceAsc": "Цена: растуће",
    "sortPriceDesc": "Цена: опадајуће",
    "sortTitle": "Наслов",
    "addToCart": "Додај у корпу",
    "noBooks": "Нема пронађених књига.",
    "outOfStock": "Нема на стању",
    "previous": "Претходна",
    "next": "Следећа",
    "page": "Страна",
    "of": "од"
  },
  "address": {
    "fullName": "Име и презиме",
    "street": "Улица и број",
    "postalCode": "Поштански број",
    "city": "Град",
    "phone": "Телефон",
    "setDefault": "Постави као подразумевану адресу",
    "cancel": "Откажи",
    "save": "Сачувај адресу",
    "default": "Подразумевано"
  },
  "checkout": {
    "title": "Плаћање",
    "step1": "Адреса доставе",
    "step2": "Начин доставе",
    "step3": "Плаћање",
    "step4": "Преглед",
    "selectAddress": "Изаберите адресу доставе",
    "noAddresses": "Немате сачуваних адреса.",
    "addNewAddress": "+ Додај нову адресу",
    "continue": "Настави",
    "back": "Назад",
    "yourOrder": "Ваша поруџбина",
    "quantity": "Количина",
    "selectDelivery": "Изаберите начин доставе",
    "standardDelivery": "Стандардна достава",
    "standardDeliveryTime": "Испорука за 3-5 радних дана",
    "expressDelivery": "Експресна достава",
    "expressDeliveryTime": "Испорука за 1-2 радна дана",
    "selectPayment": "Изаберите начин плаћања",
    "cashOnDelivery": "Плаћање поузећем",
    "cashOnDeliveryDesc": "Платите куриру приликом преузимања",
    "recommended": "Препоручено",
    "cardPayment": "Платна картица",
    "cardPaymentDesc": "Visa, Mastercard, Maestro",
    "orderReview": "Преглед поруџбине",
    "shippingAddress": "Адреса доставе",
    "deliveryMethod": "Начин доставе",
    "paymentMethod": "Начин плаћања",
    "items": "Ставке",
    "confirmOrder": "Потврди поруџбину"
  },
  "bookDetail": {
    "notFound": "Књига није пронађена",
    "backToCatalog": "Повратак на каталог",
    "inStock": "На стању ({{count}} ком.)",
    "addedToCart": "Додато у корпу",
    "alreadyInCart": "Ова књига је већ у вашој корпи",
    "specifications": "Спецификације",
    "isbn": "ISBN",
    "pageCount": "Број страна",
    "binding": "Повез",
    "hardcover": "Тврди",
    "softcover": "Меки",
    "publisher": "Издавач",
    "year": "Година",
    "language": "Језик",
    "categories": "Категорије",
    "description": "Опис"
  },
  "orders": {
    "title": "Моје поруџбине",
    "noOrders": "Немате поруџбина",
    "noOrdersMessage": "Још увек нисте направили ниједну поруџбину.",
    "startShopping": "Почните са куповином",
    "orderNumber": "Поруџбина",
    "placedOn": "Наручено",
    "total": "Укупно",
    "items": "Ставке",
    "quantity": "Количина",
    "shippingAddress": "Адреса доставе",
    "errorLoading": "Грешка при учитавању поруџбина.",
    "status": {
      "pending": "На чекању",
      "processing": "У обради",
      "shipped": "Послато",
      "delivered": "Достављено",
      "cancelled": "Отказано"
    }
  },
  "orderSuccess": {
    "title": "Поруџбина успешна!",
    "message": "Ваша поруџбина је успешно примљена и биће обрађена ускоро.",
    "whatNext": "Шта даље?",
    "emailConfirmation": "Добићете email потврду са детаљима поруџбине. Можете пратити статус ваше поруџбине у вашем профилу.",
    "viewOrders": "Погледај моје поруџбине",
    "continueShopping": "Настави са куповином",
    "questions": "Имате питања? Контактирајте нас на"
  },
  "common": {
    "rsd": "РСД",
    "loading": "Учитавање...",
    "error": "Грешка"
  }
};

const resources = {
  'sr-Latn': {
    translation: srLatn,
  },
  'sr-Cyrl': {
    translation: srCyrl,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sr-Latn', // default language
    fallbackLng: 'sr-Latn',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
