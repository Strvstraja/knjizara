import type { PrismaClient } from "@prisma/client";

export async function updateBookImages(prismaClient: PrismaClient) {
  const imageUpdates = [
    { isbn: "978-86-521-0123-4", coverImage: "https://placehold.co/300x450/e8e8e8/666?text=Na+Drini+cuprija" },
    { isbn: "978-86-521-0234-5", coverImage: "https://placehold.co/300x450/d4d4d4/555?text=Hazarski+recnik" },
    { isbn: "978-86-521-0345-6", coverImage: "https://placehold.co/300x450/e0e0e0/444?text=Sapiens" },
    { isbn: "978-86-521-0456-7", coverImage: "https://placehold.co/300x450/f0f0f0/333?text=Mali+Princ" },
    { isbn: "978-86-521-0567-8", coverImage: "https://placehold.co/300x450/dcdcdc/555?text=1984" },
    { isbn: "978-86-521-0678-9", coverImage: "https://placehold.co/300x450/e8e8e8/666?text=Prokleta+Avlija" },
  ];

  for (const update of imageUpdates) {
    await prismaClient.book.update({
      where: { isbn: update.isbn },
      data: { coverImage: update.coverImage },
    });
  }

  console.log(`✅ Updated ${imageUpdates.length} book cover images to optimized placeholders`);
}
