import { Prisma, PrismaClient } from "@prisma/client";
import db from "db.server";

export const getAllShelves = (query: string | null) => {
  return db.pantryShelf.findMany({
    where: {
      name: {
        contains: query ?? "",
        mode: "insensitive",
      },
    },
    include: { items: { orderBy: { name: "asc" } } },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createShelf = () => {
  return db.pantryShelf.create({
    data: {
      name: "New Shelf",
    },
  });
};

export const deleteShelf = async (shelfId: string) => {
  try {
    const deleted = await db.pantryShelf.delete({
      where: {
        id: shelfId,
      },
    });

    return deleted;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return error.message;
      }

      throw error;
    }
  }
};

export const saveShelfName = (shelfId: string, shelfName: string) => {
  return db.pantryShelf.update({
    where: {
      id: shelfId,
    },
    data: {
      name: shelfName,
    },
  });
};
