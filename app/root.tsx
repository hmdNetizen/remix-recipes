import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useNavigation,
  useResolvedPath,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import {
  HomeIcon,
  DisoverIcon,
  RecipeBookIcon,
  SettingsIcon,
} from "./components/icons";
import classNames from "classnames";
import React from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Recipes" },
    { name: "description", content: "Welcome to the Remix Receipes App" },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="md:flex md:h-screen bg-background">
        <nav className="bg-primary text-white">
          <ul className="flex md:flex-col">
            <AppNavLink to="/">
              <HomeIcon />
            </AppNavLink>

            <AppNavLink to="discover">
              <DisoverIcon />
            </AppNavLink>

            <AppNavLink to="app">
              <RecipeBookIcon />
            </AppNavLink>

            <AppNavLink to="settings">
              <SettingsIcon />
            </AppNavLink>
          </ul>
        </nav>
        <div className="p-4 w-full md:w-[calc(100%-4rem)]">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

type AppNavLinkProps = {
  to: string;
  children: React.ReactNode;
};

export function AppNavLink({ to, children }: AppNavLinkProps) {
  const navigation = useNavigation();
  const path = useResolvedPath(to);
  const isLoading =
    navigation.state === "loading" &&
    navigation.location.pathname === path.pathname &&
    navigation.formData === null;
  return (
    <li className="w-16">
      <NavLink to={to}>
        {({ isActive }) => (
          <div
            className={classNames(
              "py-4 flex justify-center hover:bg-primary-light",
              {
                "bg-primary-light": isActive,
                "animate-pulse bg-primary-light": isLoading,
              }
            )}
          >
            {children}
          </div>
        )}
      </NavLink>
    </li>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
      <head>
        <title>Whooops!!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="p-4">
        <h1 className="text-2xl pb-3">Whooops!!</h1>
        <p>You're seeing this page because an unexpected error occurred!</p>
        {error instanceof Error && (
          <p className="my-4 font-bold">{error.message}</p>
        )}
        <Link to="/" className="text-primary">
          Take me home
        </Link>
      </body>
    </html>
  );
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: styles },
];
