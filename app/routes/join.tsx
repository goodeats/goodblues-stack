import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { Button, Input, Label } from '~/components';

import {
  createUser,
  getUserByUsername,
  getUserByEmail,
} from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect, validateEmail } from '~/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');

  if (!username || typeof username !== 'string') {
    return json(
      {
        errors: {
          username: 'Username is required',
          email: null,
          password: null,
        },
      },
      { status: 400 },
    );
  }

  if (!validateEmail(email)) {
    return json(
      { errors: { username: null, email: 'Email is invalid', password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      {
        errors: {
          username: null,
          email: null,
          password: 'Password is required',
        },
      },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      {
        errors: {
          username: null,
          email: null,
          password: 'Password is too short',
        },
      },
      { status: 400 },
    );
  }

  const existingUserByUsername = await getUserByUsername(username);
  if (existingUserByUsername) {
    return json(
      {
        errors: {
          username: 'A user already exists with this username',
          email: null,
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const existingUserByEmail = await getUserByEmail(email);
  if (existingUserByEmail) {
    return json(
      {
        errors: {
          username: null,
          email: 'A user already exists with this email',
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const user = await createUser(username, email, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: 'Sign Up' }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? undefined;
  const actionData = useActionData<typeof action>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </Label>
            <div className="mt-1">
              <Input
                ref={usernameRef}
                id="username"
                required
                autoFocus={true}
                name="username"
                type="text"
                autoComplete="username"
                aria-invalid={actionData?.errors?.username ? true : undefined}
                aria-describedby="username-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.username ? (
                <div className="pt-1 text-red-700" id="username-error">
                  {actionData.errors.username}
                </div>
              ) : null}
            </div>
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </Label>
            <div className="mt-1">
              <Input
                ref={emailRef}
                id="email"
                required
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button type="submit" size="lg" className="w-full">
            Create Account
          </Button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/login',
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
