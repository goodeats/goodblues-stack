import { Link } from '@remix-run/react';

import type { ButtonProps } from '~/components';
import { Button } from '~/components';

// for consideration when in doubt of what link to use
// and whether it should open in a new tab
// https://css-tricks.com/use-target_blank/
interface LinkButtonProps extends ButtonProps {
  to: string;
  children: React.ReactNode;
  external?: boolean;
  newTab?: boolean;
}

const LinkButton = ({
  to,
  children,
  external = false,
  newTab = false,
  ...props
}: LinkButtonProps) => {
  const renderExternalLink = () => (
    <a
      href={to}
      target={newTab ? '_blank' : '_self'}
      rel={newTab ? 'noopener noreferrer' : ''}
    >
      {children}
    </a>
  );

  // https://remix.run/docs/en/main/components/link
  const renderInternalLink = () => <Link to={to}>{children}</Link>;

  return (
    <Button asChild {...props}>
      {external ? renderExternalLink() : renderInternalLink()}
    </Button>
  );
};
LinkButton.displayName = 'LinkButton';

export { LinkButton };
