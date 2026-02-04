import type { PrismaClient } from "@prisma/client";

export async function seedBooks(prismaClient: PrismaClient) {
  // Create categories first
  const categories = await Promise.all([
    prismaClient.category.create({
      data: {
        name: "Beletristika",
        nameCyrillic: "Белетристика",
        slug: "beletristika",
      },
    }),
    prismaClient.category.create({
      data: {
        name: "Naučna literatura",
        nameCyrillic: "Научна литература",
        slug: "naucna-literatura",
      },
    }),
    prismaClient.category.create({
      data: {
        name: "Dečje knjige",
        nameCyrillic: "Дечје књиге",
        slug: "decje-knjige",
      },
    }),
    prismaClient.category.create({
      data: {
        name: "Domaći autori",
        nameCyrillic: "Домаћи аутори",
        slug: "domaci-autori",
      },
    }),
  ]);

  // Create sample books
  const books = [
    {
      title: "Na Drini ćuprija",
      titleCyrillic: "На Дрини ћуприја",
      author: "Ivo Andrić",
      authorCyrillic: "Иво Андрић",
      description: "Istorijski roman o životu uz Drinu kroz četiri veka. Delo dobitnika Nobelove nagrade za književnost.",
      descriptionCyrillic: "Историјски роман о животу уз Дрину кроз четири века. Дело добитника Нобелове награде за књижевност.",
      price: 1200,
      coverImage: "https://placehold.co/300x450/e8e8e8/666?text=Na+Drini+cuprija",
      isbn: "978-86-521-0123-4",
      pageCount: 420,
      binding: "HARDCOVER" as const,
      publisher: "Laguna",
      publishYear: 2020,
      language: "Srpski",
      stock: 15,
      featured: true,
      categories: {
        connect: [{ id: categories[0].id }, { id: categories[3].id }],
      },
    },
    {
      title: "Hazarski rečnik",
      titleCyrillic: "Хазарски речник",
      author: "Milorad Pavić",
      authorCyrillic: "Милорад Павић",
      description: "Roman-leksikon u 100.000 reči. Muški primerak.",
      descriptionCyrillic: "Роман-лексикон у 100.000 речи. Мушки примерак.",
      price: 1500,
      discountPrice: 1200,
      coverImage: "https://placehold.co/300x450/d4d4d4/555?text=Hazarski+recnik",
      isbn: "978-86-521-0234-5",
      pageCount: 380,
      binding: "HARDCOVER" as const,
      publisher: "Dereta",
      publishYear: 2019,
      language: "Srpski",
      stock: 8,
      featured: true,
      categories: {
        connect: [{ id: categories[0].id }, { id: categories[3].id }],
      },
    },
    {
      title: "Sapiens: Kratka istorija čovečanstva",
      titleCyrillic: "Сапиенс: Кратка историја човечанства",
      author: "Yuval Noah Harari",
      authorCyrillic: "Јувал Ноа Харари",
      description: "Revolucionarna knjiga o istoriji ljudske vrste.",
      descriptionCyrillic: "Револуционарна књига о историји људске врсте.",
      price: 1800,
      coverImage: "https://placehold.co/300x450/e0e0e0/444?text=Sapiens",
      isbn: "978-86-521-0345-6",
      pageCount: 512,
      binding: "SOFTCOVER" as const,
      publisher: "Laguna",
      publishYear: 2021,
      language: "Srpski",
      stock: 20,
      featured: true,
      categories: {
        connect: [{ id: categories[1].id }],
      },
    },
    {
      title: "Mali princ",
      titleCyrillic: "Мали принц",
      author: "Antoine de Saint-Exupéry",
      authorCyrillic: "Антоан де Сент Егзипери",
      description: "Klasična priča o malom princu koji putuje sa planete na planetu.",
      descriptionCyrillic: "Класична прича о малом принцу који путује са планете на планету.",
      price: 800,
      coverImage: "https://placehold.co/300x450/f0f0f0/333?text=Mali+Princ",
      isbn: "978-86-521-0456-7",
      pageCount: 96,
      binding: "HARDCOVER" as const,
      publisher: "Kreativni centar",
      publishYear: 2022,
      language: "Srpski",
      stock: 30,
      featured: false,
      categories: {
        connect: [{ id: categories[2].id }],
      },
    },
    {
      title: "1984",
      author: "George Orwell",
      authorCyrillic: "Џорџ Орвел",
      description: "Distopijski roman o totalitarnom društvu.",
      descriptionCyrillic: "Дистопијски роман о тоталитарном друштву.",
      price: 1100,
      discountPrice: 900,
      coverImage: "https://placehold.co/300x450/dcdcdc/555?text=1984",
      isbn: "978-86-521-0567-8",
      pageCount: 328,
      binding: "SOFTCOVER" as const,
      publisher: "Laguna",
      publishYear: 2020,
      language: "Srpski",
      stock: 12,
      featured: false,
      categories: {
        connect: [{ id: categories[0].id }],
      },
    },
    {
      title: "Prokleta avlija",
      titleCyrillic: "Проклета авлија",
      author: "Ivo Andrić",
      authorCyrillic: "Иво Андрић",
      description: "Priča o životu u turskom zatvoru u Carigradu.",
      descriptionCyrillic: "Прича о животу у турском затвору у Цариграду.",
      price: 950,
      coverImage: "https://placehold.co/300x450/e8e8e8/666?text=Prokleta+Avlija",
      isbn: "978-86-521-0678-9",
      pageCount: 180,
      binding: "SOFTCOVER" as const,
      publisher: "Laguna",
      publishYear: 2021,
      language: "Srpski",
      stock: 10,
      featured: false,
      categories: {
        connect: [{ id: categories[0].id }, { id: categories[3].id }],
      },
    },
  ];

  for (const bookData of books) {
    await prismaClient.book.create({
      data: bookData,
    });
  }

  console.log(`✅ Seeded ${books.length} books and ${categories.length} categories`);
}
