import type { MetaFunction } from '@remix-run/node';

import { LinkButton } from '~/components';
import { useOptionalUser } from '~/utils';

export const meta: MetaFunction = () => [{ title: 'Remix is Good ' }];

export default function Index() {
  const user = useOptionalUser();

  const renderUserLoggedIn = (user: any) => {
    if (!user) return null;

    return (
      <LinkButton to="/notes" size="lg">
        View Notes for {user.email}
      </LinkButton>
    );
  };

  const renderUserLoggedOut = () => {
    return (
      <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
        <LinkButton to="/join" variant="secondary" size="lg">
          Sign up
        </LinkButton>
        <LinkButton to="/login" variant="default" size="lg">
          Log In
        </LinkButton>
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
                className="h-full w-full object-cover opacity-75"
                src="https://user-images.githubusercontent.com/1500684/158276320-c46b661b-8eff-4a4d-82c6-cf296c987a12.jpg"
                alt="BB King playing blues on his Gibson 'Lucille' guitar"
              />
              <div className="absolute inset-0 bg-green-700 opacity-25 mix-blend-multiply" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-primary-foreground drop-shadow-md">
                  goodblues stack
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
                The Good Blues Stack is the Blues Stack by Remix Run with
                additional features that I would be using in my own projects.
                Follow the progress on{' '}
                <LinkButton
                  to="https://github.com/goodeats/goodblues-stack"
                  variant="link"
                  size="lg"
                  external
                  newTab
                  className="p-1 text-xl text-primary"
                >
                  Github
                </LinkButton>
                .
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
          <p className="mx-auto mt-6 max-w-lg text-left text-xl text-secondary-foreground sm:max-w-3xl ">
            The Good Blues Stack is a full-stack starter kit for building web
            applications with Remix, Prisma, and Postgres. It includes
            authentication, database access, and a variety of other features.
          </p>
        </div>
      </div>
    </main>
  );
}
