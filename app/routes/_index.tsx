import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

import { useOptionalUser } from '~/utils';

export const meta: MetaFunction = () => [{ title: 'Good Remix' }];

export default function Index() {
  const user = useOptionalUser();

  const renderUserLoggedIn = (user: any) => {
    if (!user) return null;

    return (
      <Link
        to="/notes"
        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
      >
        View Notes for {user.email}
      </Link>
    );
  };

  const renderUserLoggedOut = () => {
    return (
      <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
        <Link
          to="/join"
          className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
        >
          Sign up
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
        >
          Log In
        </Link>
      </div>
    );
  };

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0">
              <img
                className="h-full w-full object-cover"
                src="https://user-images.githubusercontent.com/1500684/158276320-c46b661b-8eff-4a4d-82c6-cf296c987a12.jpg"
                alt="BB King playing blues on his Gibson 'Lucille' guitar"
              />
              <div className="absolute inset-0 bg-[color:rgba(27,167,254,0.5)] mix-blend-multiply" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-blue-500 drop-shadow-md">
                  Good Blues Stack
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                Check the README.md file for instructions on how to get this
                project deployed.
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? renderUserLoggedIn(user) : renderUserLoggedOut()}
              </div>
              <a href="https://remix.run">
                <img
                  src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                  alt="Remix"
                  className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
