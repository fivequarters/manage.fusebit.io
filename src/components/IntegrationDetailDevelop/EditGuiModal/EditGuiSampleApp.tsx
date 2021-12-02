import styled from 'styled-components';
import useSampleApp from '@hooks/useSampleApp';

const StyledSampleApp = styled.a`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  text-decoration: underline;
  margin-right: 10px;
`;

export const EditGuiSampleApp = () => {
  const { url } = useSampleApp();

  return url ? (
    <StyledSampleApp target="_blank" rel="noreferrer" href={url}>
      Run a Sample App
    </StyledSampleApp>
  ) : null;
};
