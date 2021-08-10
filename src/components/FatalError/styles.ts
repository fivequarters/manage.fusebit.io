import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

export const Warning = styled.img`
  height: 40px;
  width: 40px;
  object-fit: contain;
  margin-top: 80px;
`;

export const Title = styled.h1`
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

export const Subtitle = styled.h3`
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

export const Description = styled.p`
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

export const Hr = styled.div`
  width: 65.5px;
  height: 2px;
  background-color: var(--primary-color);
`;
