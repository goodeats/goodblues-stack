import { conform, useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import {
  json,
  type DataFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import { z } from 'zod';
import {
  EmailSchema,
  PasswordSchema,
  UsernameSchema,
} from '~/utils/schema/user-schema';
import { Button, Errors, Field } from '~/components';
import { prisma } from '../db.server';
import { useIsPending } from '~/utils/api/responses';
import { createUser } from '~/models/user.server';
import { createUserSession } from '~/session.server';

const SignupSchema = z.object({
  username: UsernameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();

  const submission = await parse(formData, {
    schema: SignupSchema.superRefine(async (data, ctx) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      });
      if (existingUser) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'A user already exists with this email',
        });
        return;
      }
    }),
    async: true,
  });
  if (submission.intent !== 'submit') {
    return json({ status: 'idle', submission } as const);
  }
  if (!submission.value) {
    return json({ status: 'error', submission } as const, { status: 400 });
  }
  const { username, email, password } = submission.value;
  const user = await createUser(username, email, password);

  return createUserSession({
    redirectTo: '/',
    remember: false,
    request,
    userId: user.id,
  });
}

export const meta: MetaFunction = () => {
  return [{ title: 'Sign Up | Good Blues' }];
};

export default function SignupRoute() {
  const actionData = useActionData<typeof action>();
  const isPending = useIsPending();

  const [form, fields] = useForm({
    id: 'signup-form',
    constraint: getFieldsetConstraint(SignupSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      const result = parse(formData, { schema: SignupSchema });
      return result;
    },
    shouldRevalidate: 'onBlur',
  });

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="POST" {...form.props}>
          <Field
            labelProps={{
              htmlFor: fields.username.id,
              children: 'Username',
            }}
            inputProps={{
              ...conform.input(fields.username),
              autoFocus: true,
              autoComplete: 'username',
              className: 'lowercase',
            }}
            errors={fields.username.errors}
          />
          <Field
            labelProps={{
              htmlFor: fields.email.id,
              children: 'Email Address',
            }}
            inputProps={{
              ...conform.input(fields.email),
              type: 'email',
              autoComplete: 'email',
              className: 'lowercase',
            }}
            errors={fields.email.errors}
          />
          <Field
            labelProps={{
              htmlFor: fields.password.id,
              children: 'Password',
            }}
            inputProps={{
              ...conform.input(fields.password),
              type: 'password',
            }}
            errors={fields.password.errors}
          />
          <Errors errors={form.errors} errorId={form.errorId} />
          <Button className="w-full" type="submit" disabled={isPending}>
            Create Account
          </Button>
          <div className="flex items-center justify-center pt-1">
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: '/login',
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
