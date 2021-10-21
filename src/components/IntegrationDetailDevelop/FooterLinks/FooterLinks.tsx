import styled from 'styled-components';

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 16px;
  color: var(--black);
  text-decoration: underline;
  width: max-content;
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
}

const FooterLinks = ({ links }: Props) => {
  return (
    <>
      {links.includes('connectingFusebit') && (
        <StyledLink
          target="_blank"
          rel="noopener_noreferrer"
          href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
        >
          <StyledBullet />
          Connecting Fusebit with Your Application
        </StyledLink>
      )}
      {links.includes('gettingStarted') && (
        <StyledLink target="_blank" rel="noopener_noreferrer" href="https://developer.fusebit.io/docs/getting-started">
          <StyledBullet />
          Getting Started
        </StyledLink>
      )}
      {links.includes('programmingModel') && (
        <StyledLink
          target="_blank"
          rel="noopener_noreferrer"
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
