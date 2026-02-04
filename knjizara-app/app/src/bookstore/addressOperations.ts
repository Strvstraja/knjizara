import { HttpError } from 'wasp/server';
import type { Address } from 'wasp/entities';

// Address Operations

type CreateAddressInput = {
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
};

type UpdateAddressInput = {
  id: string;
  fullName?: string;
  street?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  isDefault?: boolean;
};

export const getUserAddresses = async (_args: void, context: any): Promise<Address[]> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const addresses = await context.entities.Address.findMany({
    where: {
      userId: context.user.id,
    },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return addresses;
};

export const createAddress = async (args: CreateAddressInput, context: any): Promise<Address> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { isDefault = false, ...addressData } = args;

  // If this is set as default, unset all other default addresses
  if (isDefault) {
    await context.entities.Address.updateMany({
      where: {
        userId: context.user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });
  }

  const address = await context.entities.Address.create({
    data: {
      ...addressData,
      isDefault,
      userId: context.user.id,
    },
  });

  return address;
};

export const updateAddress = async (args: UpdateAddressInput, context: any): Promise<Address> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  const { id, isDefault, ...updateData } = args;

  // Verify the address belongs to the user
  const existingAddress = await context.entities.Address.findUnique({
    where: { id },
  });

  if (!existingAddress || existingAddress.userId !== context.user.id) {
    throw new HttpError(403, 'Address not found or access denied');
  }

  // If setting as default, unset all other default addresses
  if (isDefault) {
    await context.entities.Address.updateMany({
      where: {
        userId: context.user.id,
        isDefault: true,
        id: { not: id },
      },
      data: {
        isDefault: false,
      },
    });
  }

  const address = await context.entities.Address.update({
    where: { id },
    data: {
      ...updateData,
      ...(isDefault !== undefined && { isDefault }),
    },
  });

  return address;
};

export const deleteAddress = async ({ id }: { id: string }, context: any): Promise<void> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  // Verify the address belongs to the user
  const existingAddress = await context.entities.Address.findUnique({
    where: { id },
  });

  if (!existingAddress || existingAddress.userId !== context.user.id) {
    throw new HttpError(403, 'Address not found or access denied');
  }

  await context.entities.Address.delete({
    where: { id },
  });
};

export const setDefaultAddress = async ({ id }: { id: string }, context: any): Promise<Address> => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized');
  }

  // Verify the address belongs to the user
  const existingAddress = await context.entities.Address.findUnique({
    where: { id },
  });

  if (!existingAddress || existingAddress.userId !== context.user.id) {
    throw new HttpError(403, 'Address not found or access denied');
  }

  // Unset all other default addresses
  await context.entities.Address.updateMany({
    where: {
      userId: context.user.id,
      isDefault: true,
      id: { not: id },
    },
    data: {
      isDefault: false,
    },
  });

  // Set this address as default
  const address = await context.entities.Address.update({
    where: { id },
    data: {
      isDefault: true,
    },
  });

  return address;
};
