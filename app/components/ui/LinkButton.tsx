import { Link } from '@remix-run/react';
import type { ButtonProps } from '~/components';
import { Button } from '~/components';

interface LinkButtonProps extends ButtonProps {
  to: string;
  children: React.ReactNode;
}

const LinkButton = ({ to, children, ...props }: LinkButtonProps) => {
  return (
    <Button {...props}>
      <Link to={to}>{children}</Link>
    </Button>
  );
};
LinkButton.displayName = 'LinkButton';

export { LinkButton };
