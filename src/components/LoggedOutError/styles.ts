import styled from 'styled-components';
import background from '@assets/background-small.jpg';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

export const Background = styled.div`
  width: 100vw;
  height: 23px;
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const Fusebit = styled.img`
  width: 144px;
  height: 37px;
  object-fit: contain;
  margin-top: 62px;
  margin-bottom: 140px;

  @media only screen and (max-width: 500px) {
    width: 125px;
    height: 32px;
    margin-bottom: 120px;
    margin-top: 56px;
  }
`;

export const Warning = styled.img`
  height: 40px;
  width: 40px;
  object-fit: contain;
`;

export const Title = styled.h1`
  font-size: 56px;
  line-height: 58px;
  font-weight: 600;
  margin-bottom: 32px;
  color: var(--black);

  @media only screen and (max-width: 500px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

export const Description = styled.p`
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 68px;
  color: var(--black);
  text-align: center;

  @media only screen and (max-width: 500px) {
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 64px;
  }
`;
