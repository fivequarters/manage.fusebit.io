import styled from 'styled-components';
import dottedBox from '@assets/dotted-box.svg';

const StyledDashContainer = styled.div`
  position: relative;
  display: flex;

  @media only screen and (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const StyledDashedBox = styled.div`
  height: 72px;
  width: 72px;
  background-image: url(${dottedBox});
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 24px;
`;

const StyledTitle = styled.h4`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  max-width: 190px;
`;

const StyledText = styled.p`
  font-size: 12px;
  line-height: 16px;
  font-weight: 300;
  color: var(--black);
  margin-top: 24px;
  max-width: 315px;
`;

const EmptyBackendList = () => {
  return (
    <StyledContainer>
      <StyledDashContainer>
        <StyledDashedBox />
        <StyledTitle>No application connections configured</StyledTitle>
      </StyledDashContainer>
      <StyledText>
        Once you have tested your integration, click “Connect” to see how to call it from your application.
      </StyledText>
    </StyledContainer>
  );
};

export default EmptyBackendList;
