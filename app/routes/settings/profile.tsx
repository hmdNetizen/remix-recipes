import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json, useRouteError } from "react-router";

// export const loader: LoaderFunction = async () => {
//   return json({message: "Loader function route"})
// }

export function loader() {
  return json({ message: "Loader function route" });
}

const Profile = () => {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Profile Settings</h1>
      <p>These are settings profiles</p>
      <p>{data.message}</p>
    </div>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <div className="border-2 bg-red-300 border-red-700 rounded-md p-4">
        <h1>Hoops!!! something went wrong</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return <div>An unexpected error occurred.</div>;
}

export default Profile;
