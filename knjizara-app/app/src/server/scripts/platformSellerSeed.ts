import type { PrismaClient } from '@prisma/client';

export async function createPlatformSeller(prisma: PrismaClient) {
  console.log('🏪 Creating platform seller...');

  // Create platform user if doesn't exist
  const platformUser = await prisma.user.upsert({
    where: { email: 'platform@knjizara.rs' },
    update: {},
    create: {
      email: 'platform@knjizara.rs',
      username: 'platform',
      isAdmin: true,
    }
  });

  console.log('✅ Platform user created/found:', platformUser.email);

  // Create platform seller profile
  const platformSeller = await prisma.sellerProfile.upsert({
    where: { userId: platformUser.id },
    update: {},
    create: {
      userId: platformUser.id,
      type: 'BUSINESS',
      displayName: 'Čika Strajina Mala Knjižara',
      companyName: 'Čika Strajina Mala Knjižara',
      phone: '+381 11 1234567',
      city: 'Beograd',
      isVerified: true,
    }
  });

  console.log('✅ Platform seller profile created:', platformSeller.displayName);

  // Assign all existing books to platform seller
  const updatedBooks = await prisma.book.updateMany({
    where: { sellerId: null },
    data: { 
      sellerId: platformSeller.id,
      condition: 'NEW',
      status: 'ACTIVE'
    }
  });

  console.log(`✅ Assigned ${updatedBooks.count} books to platform seller`);

  return platformSeller;
}
