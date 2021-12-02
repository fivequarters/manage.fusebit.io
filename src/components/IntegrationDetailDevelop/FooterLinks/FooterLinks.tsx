import { Integration } from '@interfaces/integration';
import { trackEvent } from '@utils/analytics';
import styled from 'styled-components';

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: underline;
  margin-bottom: 16px;
  margin-left: 5px;
  transition: all 0.25s linear;

  &:hover {
    color: var(--primary-color);

    > div {
      background-color: var(--primary-color);
    }
  }

  &:visited {
    color: #959595;

    > div {
      background-color: #959595;
    }
  }
`;

export const StyledBullet = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: var(--black);
  margin-right: 10px;
  transition: all 0.25s linear;
`;

interface Props {
  links: ('connectingFusebit' | 'gettingStarted' | 'programmingModel')[];
  integration?: Integration;
}

const FooterLinks = ({ links, integration }: Props) => {
  return (
    <>
      {links.includes('connectingFusebit') && (
        <StyledLink
          target="_blank"
          rel="noopener_noreferrer"
          href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
          onClick={() =>
            trackEvent('Docs Connect Fusebit Link Clicked', 'Integration', {
              Integration: integration?.tags['fusebit.feedId'],
            })
          }
        >
          <StyledBullet />
          Connecting Fusebit with Your Application
        </StyledLink>
      )}
      {links.includes('gettingStarted') && (
        <StyledLink
          target="_blank"
          onClick={() =>
            trackEvent('Docs Getting Started Link Clicked', 'Integration', {
              Integration: integration?.tags['fusebit.feedId'],
            })
          }
          rel="noopener_noreferrer"
          href="https://developer.fusebit.io/docs/getting-started"
        >
          <StyledBullet />
          Getting Started
        </StyledLink>
      )}
      {links.includes('programmingModel') && (
        <StyledLink
          target="_blank"
          rel="noopener_noreferrer"
          onClick={() =>
            trackEvent('Docs Programming Model Link Clicked', 'Integration', {
              Integration: integration?.tags['fusebit.feedId'],
            })
          }
          href="https://developer.fusebit.io/docs/integration-programming-model"
        >
          <StyledBullet />
          Integration Programming Model
        </StyledLink>
      )}
    </>
  );
};

export default FooterLinks;
