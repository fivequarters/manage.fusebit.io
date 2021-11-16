import React from 'react';
import styled from 'styled-components';
import warning from '@assets/warning-red.svg';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

const StyledWarning = styled.img`
  height: 40px;
  width: 40px;
  object-fit: contain;
  margin-top: 80px;
`;

const StyledTitle = styled.h1`
  font-size: 56px;
  line-height: 58px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 32px;

  @media only screen and (max-width: 500px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

const StyledSubtitle = styled.h3`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 12px;

  @media only screen and (max-width: 500px) {
    font-size: 16px;
    line-height: 18px;
  }
`;

const StyledDescription = styled.p`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  text-align: center;
  max-width: 578px;
  margin-bottom: 88px;

  @media only screen and (max-width: 500px) {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 64px;
  }
`;

const StyledHr = styled.div`
  width: 65.5px;
  height: 2px;
  background-color: var(--primary-color);
`;

const FatalError: React.FC<{}> = () => {
  return (
    <StyledWrapper>
      <StyledWarning src={warning} alt="warning" height="40" width="40" />
      <StyledTitle>Error</StyledTitle>
      <StyledSubtitle>Lorem ipsum dolor sit amet</StyledSubtitle>
      <StyledDescription>
        Aenean et pretium felis, et porttitor quam. Nam mi mauris, lacinia ut orci non, placerat maximus quam. Morbi at
        purus tellus. Mauris cursus porta est, vel elementum tellus interdum vitae. Sed in pellentesque mi. Nunc et enim
        odio. Phasellus vestibulum enim ut tortor commodo, eu mattis risus dictum. Integer dictum blandit justo, vel
        feugiat mi eleifend id. Suspendisse potenti. Suspendisse eu odio vel lorem commodo egestas. Ut in libero
        fringilla, fringilla ante sodales, maximus lacus. Integer eget fringilla elit. Mauris eu nisl libero.
      </StyledDescription>
      <StyledHr />
    </StyledWrapper>
  );
};

export default FatalError;
