import { json, LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { useMatchesData } from "~/utils/misc";

// export const loader: LoaderFunction = async () => {
//   return json({ message: "Hello From Loader" });
// };

export async function loader() {
  return json({ message: "Hello from the loader" });
}

const Settings = () => {
  const data = useLoaderData<typeof loader>();
  // const data = useMatchesData("routes/settings/profile");
  return (
    <div>
      <h1>Settings</h1>
      <p>This is the settings page</p>
      <p>{data.message}</p>
      <nav>
        <Link to="app">App</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export function ErrorBoundary() {
  return <div>Error loading data</div>;
}

export default Settings;
