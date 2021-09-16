import styled from 'styled-components';
import info from '../../assets/info.svg';

export const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 24px;
  border-radius: 8px;
  background-color: #dae8ff;
  max-width: 912px;
  margin: 0 auto 48px 0;
`;

export const InfoIcon = styled.div`
  height: 20px;
  width: 20px;
  background-image: url(${info});
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 18px;
  flex-shrink: 0;
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--black);
  max-width: 760px;
  margin: 0;

  & > strong {
    font-weight: 500;
    line-height: 16px;
  }

  & > a,
  a:visited,
  a:link {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 1px;
  }
`;
