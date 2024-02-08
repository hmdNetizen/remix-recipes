import { PrismaClient, PantryShelf } from "@prisma/client";
import { ActionFunction, json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import classNames from "classnames";
import db from "db.server";
import { z } from "zod";
import { DeleteButton, PrimaryButton } from "~/components/form";
import { PlusIcon, SaveIcon, SearchIcon } from "~/components/icons";
import {
  createShelf,
  deleteShelf,
  getAllShelves,
  saveShelfName,
} from "~/models/pantry-shelf.server";

type FieldErrors = {
  [key: string]: string;
};

const saveShelfNameSchema = z.object({
  shelfId: z.string(),
  shelfName: z.string().min(1),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const shelves = await getAllShelves(q);

  return json({ shelves });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "createShelf": {
      return createShelf();
    }
    case "deleteShelf": {
      const shelfId = formData.get("shelfId");

      if (typeof shelfId !== "string") {
        return json({
          error: { shelfId: "Shelf ID must be a type of string" },
        });
      }

      return deleteShelf(shelfId);
    }
    case "saveShelfName": {
      const result = saveShelfNameSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!result.success) {
        return null;
      }

      const shelfId = result.data.shelfId;
      const shelfName = result.data.shelfName;

      return saveShelfName(shelfId, shelfName);
    }
    default: {
      return null;
    }
  }
};

const pantry = () => {
  const data = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const createShelfFetcher = useFetcher();

  const navigation = useNavigation();
  const isSearching = navigation.formData?.has("q");
  const isCreatingShelf =
    createShelfFetcher.formData?.get("_action") === "createShelf";

  return (
    <div>
      <Form
        className={classNames(
          "flex border-2 border-gray-300 rounded-md",
          "focus-within:border-primary md:w-80",
          {
            "animate-pulse": isSearching,
          }
        )}
      >
        <button type="submit" className="px-2 mr-1">
          <SearchIcon />
        </button>
        <input
          defaultValue={searchParams.get("q") ?? ""}
          name="q"
          placeholder="Search shelves..."
          className="flex-1 outline-none px-2 py-3"
          autoComplete="off"
        />
      </Form>
      <createShelfFetcher.Form method="POST">
        <PrimaryButton
          value="createShelf"
          name="_action"
          className={classNames("mt-4 w-full md:w-fit")}
          isLoading={isCreatingShelf}
        >
          <PlusIcon />
          <span className="pl-2">
            {isCreatingShelf ? "Creating Shelf" : "Create Shelf"}
          </span>
        </PrimaryButton>
      </createShelfFetcher.Form>
      <ul
        className={classNames(
          "flex gap-8 overflow-x-auto mt-4 pb-4",
          "snap-x snap-mandatory",
          "md:snap-none"
        )}
      >
        {data.shelves.map((shelf) => (
          <Shelf key={shelf.id} shelf={shelf} />
        ))}
      </ul>
    </div>
  );
};

type ShelfProps = {
  shelf: {
    id: string;
    name: string;
    items: {
      id: string;
      name: string;
      shelfId: string;
    }[];
  };
};

const Shelf = ({ shelf }: ShelfProps) => {
  const deleteShelfFetcher = useFetcher();
  const saveShelfNameFetcher = useFetcher();

  const isDeletingShelf =
    deleteShelfFetcher.formData?.get("_action") === "deleteShelf" &&
    deleteShelfFetcher.formData.get("shelfId") === shelf.id;
  return (
    <li
      key={shelf.id}
      className={classNames(
        "border-2 border-primary rounded-md p-4",
        "w-[calc(100vw-2rem)] flex-none snap-center h-fit",
        "md:w-96"
      )}
    >
      <saveShelfNameFetcher.Form method="POST" className="flex">
        <input
          type="text"
          name="shelfName"
          defaultValue={shelf.name}
          placeholder="Shelf Name"
          autoComplete="off"
          className={classNames(
            "text-2xl font-extrabold mb-2 w-full outline-none",
            "border-b-2 focus:border-b-primary border-b-background"
          )}
        />
        <button name="_action" value="saveShelfName" className="ml-4">
          <SaveIcon />
        </button>
        <input type="hidden" name="shelfId" value={shelf.id} />
      </saveShelfNameFetcher.Form>
      {/* <h1 className="text-2xl font-extrabold mb-2">{shelf.name}</h1> */}
      <ul className="py-2">
        {shelf.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <deleteShelfFetcher.Form method="POST" className="pt-4">
        <input type="hidden" name="shelfId" value={shelf.id} />
        <DeleteButton
          className="w-full"
          name="_action"
          value="deleteShelf"
          isLoading={isDeletingShelf}
        >
          {isDeletingShelf ? "Deleting Shelf" : "Delete Shelf"}
        </DeleteButton>
      </deleteShelfFetcher.Form>
    </li>
  );
};

export default pantry;
