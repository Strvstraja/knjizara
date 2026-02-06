import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const srLatn = {
  "nav": {
    "books": "Knjige",
    "createListing": "Objavi knjigu",
    "myListings": "Moji oglasi",
    "mySales": "Moje prodaje",
    "cart": "Korpa",
    "login": "Prijavi se",
    "logout": "Odjavi se",
    "account": "Nalog"
  },
  "userMenu": {
    "myOrders": "Moje porudžbine",
    "wishlist": "Lista želja",
    "myAddresses": "Moje adrese",
    "accountSettings": "Podešavanja naloga",
    "adminPanel": "Admin panel"
  },
  "landing": {
    "hero": {
      "title": "Dobrodošli u",
      "highlight": "Čika Strajinu malu knjižaru",
      "subtitle": "Mesto gde knjige menjaju vlasnike. Kupuj i prodaj nove i polovne naslove od prodavaca iz cele Srbije.",
      "browseBooks": "Pregledaj knjige",
      "signup": "Registruj se"
    },
    "features": {
      "wideSelection": {
        "title": "Širok izbor",
        "description": "Hiljade naslova iz svih žanrova"
      },
      "easyOrdering": {
        "title": "Jednostavna kupovina",
        "description": "Brza i sigurna online porudžbina"
      },
      "freeShipping": {
        "title": "Besplatna dostava",
        "description": "Za kupovinu preko 3000 RSD"
      }
    },
    "featured": {
      "title": "Izdvajamo",
      "subtitle": "Najpopularnije knjige ovog meseca",
      "viewAll": "Pogledaj sve knjige"
    },
    "categories": {
      "title": "Kategorije",
      "subtitle": "Pronađite knjige po žanru"
    },
    "newArrivals": {
      "title": "Novo u ponudi",
      "subtitle": "Najnoviji naslovi u našoj knjižari",
      "viewAll": "Pogledaj sve",
      "badge": "Novo"
    }
  },
  "cart": {
    "title": "Korpa",
    "empty": "Vaša korpa je prazna",
    "continueShopping": "Nastavite sa kupovinom",
    "subtotal": "Međuzbir",
    "shipping": "Dostava",
    "total": "Ukupno",
    "free": "Besplatno",
    "freeShipping": "Besplatno",
    "freeShippingProgress": "Dodaj još {{amount}} {{currency}} za besplatnu dostavu!",
    "freeShippingAchieved": "Ostvarili ste besplatnu dostavu!",
    "goToCheckout": "Idi na plaćanje",
    "viewCart": "Pogledaj korpu",
    "remove": "Ukloni",
    "orderSummary": "Pregled porudžbine",
    "continueToPayment": "Nastavi na plaćanje",
    "maxQuantityReached": "Dostignuta maksimalna količina na stanju"
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
  "addressManagement": {
    "title": "Moje adrese",
    "addNew": "Dodaj novu",
    "addNewAddress": "Dodaj novu adresu",
    "editAddress": "Izmeni adresu",
    "noAddresses": "Nemate sačuvanih adresa",
    "noAddressesMessage": "Dodajte adresu da biste ubrzali proces poručivanja.",
    "addFirst": "Dodaj prvu adresu",
    "default": "Podrazumevano",
    "setAsDefault": "Postavi kao podrazumevano",
    "edit": "Izmeni",
    "delete": "Obriši",
    "confirmDelete": "Da li ste sigurni da želite da obrišete ovu adresu?"
  },
  "wishlist": {
    "title": "Lista želja",
    "empty": "Vaša lista želja je prazna",
    "emptyMessage": "Dodajte knjige koje želite da kupite kasnije.",
    "browseBooks": "Pregledaj knjige",
    "addToCart": "Dodaj u korpu",
    "remove": "Ukloni",
    "addedToWishlist": "Dodato u listu želja",
    "removedFromWishlist": "Uklonjeno iz liste želja"
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
    "error": "Greška",
    "back": "Nazad"
  },
  "seller": {
    "displayName": "Ime i prezime",
    "phone": "Broj telefona",
    "city": "Grad",
    "companyName": "Naziv firme",
    "pib": "PIB",
    "address": "Adresa",
    "contactEmail": "Kontakt email",
    "website": "Web sajt"
  },
  "listing": {
    "create": "Objavi knjigu",
    "edit": "Izmeni oglas",
    "myListings": "Moji oglasi",
    "totalListings": "Ukupno oglasa",
    "all": "Svi",
    "views": "Pregleda",
    "stockLabel": "Zaliha",
    "noListings": "Još nemate nijedan oglas",
    "noListingsStatus": "Nemate oglase sa ovim statusom",
    "createFirst": "Kreiraj prvi oglas",
    "subtitle": "Popunite podatke o knjizi koju želite da prodate",
    "requiredFields": "Osnovni podaci",
    "optionalFields": "Dodatni podaci (opciono)",
    "title": "Naslov knjige",
    "titlePlaceholder": "Na primer: 1984",
    "author": "Autor",
    "authorPlaceholder": "Na primer: Džordž Orvel",
    "price": "Cena",
    "pricePlaceholder": "1200",
    "condition": "Stanje",
    "conditionNew": "Nova (neotpakovana)",
    "conditionLikeNew": "Kao nova",
    "conditionVeryGood": "Odlična",
    "conditionGood": "Dobra",
    "conditionAcceptable": "Prihvatljiva",
    "category": "Kategorija",
    "description": "Opis",
    "descriptionPlaceholder": "Opišite stanje knjige, eventualna oštećenja, podvlačenja...",
    "isbn": "ISBN",
    "publisher": "Izdavač",
    "publishYear": "Godina izdanja",
    "pageCount": "Broj strana",
    "binding": "Povez",
    "bindingHardcover": "Tvrdi povez",
    "bindingSoftcover": "Meki povez",
    "language": "Jezik",
    "stock": "Količina",
    "negotiable": "Cena po dogovoru",
    "images": "Slike",
    "coverImage": "Naslovna slika",
    "coverImagePlaceholder": "https://example.com/cover.jpg",
    "status": "Status",
    "statusActive": "Aktivno",
    "statusPaused": "Pauzirano",
    "statusSold": "Prodato",
    "statusExpired": "Isteklo",
    "actions": "Akcije",
    "pause": "Pauziraj",
    "activate": "Aktiviraj",
    "markSold": "Označi kao prodato",
    "delete": "Obriši",
    "confirmDelete": "Da li ste sigurni da želite da obrišete ovaj oglas?",
    "confirmMarkSold": "Da li ste sigurni da želite da označite kao prodato?",
    "errorRequired": "Molimo popunite sva obavezna polja",
    "errorCategory": "Molimo izaberite bar jednu kategoriju",
    "createSuccess": "Oglas uspešno kreiran",
    "updateSuccess": "Oglas uspešno ažuriran",
    "deleteSuccess": "Oglas uspešno obrisan"
  },
  "auth": {
    "signup": {
      "title": "Napravite novi nalog",
      "email": "E-mail",
      "password": "Lozinka",
      "button": "Registruj se",
      "haveAccount": "Već imam nalog",
      "goToLogin": "idi na prijavu"
    },
    "login": {
      "title": "Prijavite se na nalog",
      "email": "E-mail",
      "password": "Lozinka",
      "button": "Prijavi se",
      "noAccount": "Nemate nalog?",
      "goToSignup": "registrujte se",
      "forgotPassword": "Zaboravili ste lozinku?"
    },
    "forgotPassword": {
      "title": "Zaboravljena lozinka",
      "email": "E-mail",
      "button": "Pošalji link za resetovanje",
      "backToLogin": "Nazad na prijavu"
    }
  }
};

const srCyrl = {
  "nav": {
    "books": "Књиге",
    "createListing": "Објави књигу",
    "myListings": "Моји огласи",
    "mySales": "Моје продаје",
    "cart": "Корпа",
    "login": "Пријави се",
    "logout": "Одјави се",
    "account": "Налог"
  },
  "userMenu": {
    "myOrders": "Моје поруџбине",
    "wishlist": "Листа жеља",
    "myAddresses": "Моје адресе",
    "accountSettings": "Подешавања налога",
    "adminPanel": "Админ панел"
  },
  "landing": {
    "hero": {
      "title": "Добродошли у",
      "highlight": "Чика Страјину малу књижару",
      "subtitle": "Место где књиге мењају власнике. Купуј и продај нове и половне наслове од продаваца из целе Србије.",
      "browseBooks": "Прегледај књиге",
      "signup": "Региструј се"
    },
    "features": {
      "wideSelection": {
        "title": "Широк избор",
        "description": "Хиљаде наслова из свих жанрова"
      },
      "easyOrdering": {
        "title": "Једноставна куповина",
        "description": "Брза и сигурна онлине поруџбина"
      },
      "freeShipping": {
        "title": "Бесплатна достава",
        "description": "За куповину преко 3000 РСД"
      }
    },
    "featured": {
      "title": "Издвајамо",
      "subtitle": "Најпопуларније књиге овог месеца",
      "viewAll": "Погледај све књиге"
    },
    "categories": {
      "title": "Категорије",
      "subtitle": "Пронађите књиге по жанру"
    },
    "newArrivals": {
      "title": "Ново у понуди",
      "subtitle": "Најновији наслови у нашој књижари",
      "viewAll": "Погледај све",
      "badge": "Ново"
    }
  },
  "cart": {
    "title": "Корпа",
    "empty": "Ваша корпа је празна",
    "continueShopping": "Наставите са куповином",
    "subtotal": "Међузбир",
    "shipping": "Достава",
    "total": "Укупно",
    "free": "Бесплатно",
    "freeShipping": "Бесплатно",
    "freeShippingProgress": "Додај још {{amount}} {{currency}} за бесплатну доставу!",
    "freeShippingAchieved": "Остварили сте бесплатну доставу!",
    "goToCheckout": "Иди на плаћање",
    "viewCart": "Погледај корпу",
    "remove": "Уклони",
    "orderSummary": "Преглед поруџбине",
    "continueToPayment": "Настави на плаћање",
    "maxQuantityReached": "Достигнута максимална количина на стању"
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
  "addressManagement": {
    "title": "Моје адресе",
    "addNew": "Додај нову",
    "addNewAddress": "Додај нову адресу",
    "editAddress": "Измени адресу",
    "noAddresses": "Немате сачуваних адреса",
    "noAddressesMessage": "Додајте адресу да бисте убрзали процес поручивања.",
    "addFirst": "Додај прву адресу",
    "default": "Подразумевано",
    "setAsDefault": "Постави као подразумевано",
    "edit": "Измени",
    "delete": "Обриши",
    "confirmDelete": "Да ли сте сигурни да желите да обришете ову адресу?"
  },
  "wishlist": {
    "title": "Листа жеља",
    "empty": "Ваша листа жеља је празна",
    "emptyMessage": "Додајте књиге које желите да купите касније.",
    "browseBooks": "Прегледај књиге",
    "addToCart": "Додај у корпу",
    "remove": "Уклони",
    "addedToWishlist": "Додато у листу жеља",
    "removedFromWishlist": "Уклоњено из листе жеља"
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
    "error": "Грешка",
    "back": "Назад"
  },
  "seller": {
    "displayName": "Име и презиме",
    "phone": "Број телефона",
    "city": "Град",
    "companyName": "Назив фирме",
    "pib": "ПИБ",
    "address": "Адреса",
    "contactEmail": "Контакт емаил",
    "website": "Веб сајт"
  },
  "listing": {
    "create": "Објави књигу",
    "edit": "Измени оглас",
    "myListings": "Моји огласи",
    "totalListings": "Укупно огласа",
    "all": "Сви",
    "views": "Прегледа",
    "stockLabel": "Залиха",
    "noListings": "Још немате ниједан оглас",
    "noListingsStatus": "Немате огласе са овим статусом",
    "createFirst": "Креирај први оглас",
    "subtitle": "Попуните податке о књизи коју желите да продате",
    "requiredFields": "Основни подаци",
    "optionalFields": "Додатни подаци (опционо)",
    "title": "Наслов књиге",
    "titlePlaceholder": "На пример: 1984",
    "author": "Аутор",
    "authorPlaceholder": "На пример: Џорџ Орвел",
    "price": "Цена",
    "pricePlaceholder": "1200",
    "condition": "Стање",
    "conditionNew": "Нова (неотпакована)",
    "conditionLikeNew": "Као нова",
    "conditionVeryGood": "Одлична",
    "conditionGood": "Добра",
    "conditionAcceptable": "Прихватљива",
    "category": "Категорија",
    "description": "Опис",
    "descriptionPlaceholder": "Опишите стање књиге, евентуална оштећења, подвлачења...",
    "isbn": "ISBN",
    "publisher": "Издавач",
    "publishYear": "Година издања",
    "pageCount": "Број страна",
    "binding": "Повез",
    "bindingHardcover": "Тврди повез",
    "bindingSoftcover": "Меки повез",
    "language": "Језик",
    "stock": "Количина",
    "negotiable": "Цена по договору",
    "images": "Слике",
    "coverImage": "Насловна слика",
    "coverImagePlaceholder": "https://example.com/cover.jpg",
    "status": "Статус",
    "statusActive": "Активно",
    "statusPaused": "Паузирано",
    "statusSold": "Продато",
    "statusExpired": "Истекло",
    "actions": "Акције",
    "pause": "Паузирај",
    "activate": "Активирај",
    "markSold": "Означи као продато",
    "delete": "Обриши",
    "confirmDelete": "Да ли сте сигурни да желите да обришете овај оглас?",
    "confirmMarkSold": "Да ли сте сигурни да желите да означите као продато?",
    "errorRequired": "Молимо попуните сва обавезна поља",
    "errorCategory": "Молимо изаберите бар једну категорију",
    "createSuccess": "Оглас успешно креиран",
    "updateSuccess": "Оглас успешно ажуриран",
    "deleteSuccess": "Оглас успешно обрисан"
  },
  "auth": {
    "signup": {
      "title": "Направите нови налог",
      "email": "Е-маил",
      "password": "Лозинка",
      "button": "Региструј се",
      "haveAccount": "Већ имам налог",
      "goToLogin": "иди на пријаву"
    },
    "login": {
      "title": "Пријавите се на налог",
      "email": "Е-маил",
      "password": "Лозинка",
      "button": "Пријави се",
      "noAccount": "Немате налог?",
      "goToSignup": "региструјте се",
      "forgotPassword": "Заборавили сте лозинку?"
    },
    "forgotPassword": {
      "title": "Заборављена лозинка",
      "email": "Е-маил",
      "button": "Пошаљи линк за ресетовање",
      "backToLogin": "Назад на пријаву"
    }
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
