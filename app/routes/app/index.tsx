import { LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/app/pantry",
    },
  });

  //   return redirect("/app/pantry");
};
