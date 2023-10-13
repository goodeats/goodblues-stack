import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import { verifyLogin } from '~/models/user.server';
import { createUserSession, getUserId } from '~/session.server';
import { safeRedirect, validateEmail } from '~/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect('/');
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const login = formData.get('login');
  const password = formData.get('password');
  const redirectTo = safeRedirect(formData.get('redirectTo'), '/');
  const remember = formData.get('remember');

  if (!login || typeof login !== 'string') {
    return json(
      {
        errors: {
          login: 'Username or email is required',
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const loginType = validateEmail(login) ? 'email' : 'username';

  if (typeof password !== 'string' || password.length === 0) {
    return json(
      { errors: { login: null, password: 'Password is required' } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { login: null, password: 'Password is too short' } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(login, loginType, password);

  if (!user) {
    return json(
      { errors: { login: 'Invalid login or password', password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === 'on' ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: 'Login' }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/notes';
  const actionData = useActionData<typeof action>();
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.login) {
      loginRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="login"
              className="block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <div className="mt-1">
              <input
                ref={loginRef}
                id="login"
                required
                autoFocus={true}
                name="login"
                type="text"
                autoComplete="username"
                aria-invalid={actionData?.errors?.login ? true : undefined}
                aria-describedby="login-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.login ? (
                <div className="pt-1 text-red-700" id="login-error">
                  {actionData.errors.login}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
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
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/join',
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
