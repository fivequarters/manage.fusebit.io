import styled from 'styled-components';

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 40px 96px;
  border-radius: 8px;
  width: 859px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 870px) {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 32px;
    padding-top: 200px;
    left: 0;
    top: auto;
    bottom: 0;
    border-radius: 0;
    transform: translate(0, 0);
  }
`;

export const CardClose = styled.div`
  height: 20px;
  width: 20px;
  position: absolute;
  top: 25px;
  right: 25px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;

    & > img {
      transform: rotate(90deg);
    }
  }

  & > img {
    height: 10px;
    width: 10px;
    object-fit: contain;
    transition: all 0.25s linear;
  }
`;

export const CardTitle = styled.h2`
  font-size: 24px;
  line-height: 26px;
  text-align: center;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 32px;
  max-width: 667px;
`;

export const CardSubtitle = styled.h5`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  text-align: center;
  color: var(--black);
  margin-bottom: 16px;
  text-align: center;
  max-width: 667px;
`;

export const CardButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 36px;
`;

export const CardActionButtons = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

export const LineInstructionWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
  max-width: 667px;

  &:hover {
    cursor: pointer;

    & > div {
      opacity: 1;
    }
  }
`;

export const LineInstruction = styled.div`
  position: relative;
  height: 50px;
  padding: 16px;
  border: 0;
  margin: 0;
  outline: rgba(255, 255, 255, 0);
  border-radius: 4px;
  background-color: var(--secondary-color);
  overflow: hidden;
  white-space: nowrap;
  font-family: 'Courier';
  font-size: 16px;
  line-height: 18px;
  color: var(--black);
  display: flex;

  & > span {
    color: var(--primary-color);
    font-weight: 400;
    margin: 0 10px;
  }

  & > strong {
    color: var(--primary-color);
    font-weight: 400;
    margin: 0 10px;
  }

  .unselectable {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
    line-height: 16px;
    width: 100%;
  }
`;

export const LineInstructionFade = styled.div<{ change: boolean; onlyMobileVisible?: boolean }>`
  display: ${(props) => props.onlyMobileVisible && 'none'};
  position: absolute;
  right: 0;
  top: 0;
  height: 50px;
  width: ${(props) => (props.change ? '300px' : '60px')};
  background-image: linear-gradient(to left, #eff5ff 10%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
  transition: all 0.25s linear;

  @media only screen and (max-width: 1250px) {
    right: -2px;
    display: ${(props) => props.onlyMobileVisible && 'block'};
    width: 60px;
  }
`;

export const LineInstructionCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  height: 50px;
  width: 70px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
  z-index: 2;
  opacity: 0;
  transition: all 0.25s linear;

  @media only screen and (max-width: 1250px) {
    display: none;
  }
`;

export const CopySuccess = styled.p<{ copy: boolean }>`
  position: absolute;
  right: 0;
  bottom: -35px;
  font-size: 14px;
  line-height: 16px;
  color: var(--grey);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;
`;

export const CopyMobile = styled.img`
  display: none;
  height: 16px;
  width: 16px;
  object-fit: contain;
  margin-left: auto;

  @media only screen and (max-width: 1250px) {
    display: block;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  max-width: 667px;
`;

export const LineTitle = styled.h4<{ margin?: string }>`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: ${(props) => (props.margin ? props.margin : '8px')};

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
  }
`;

export const LineDescription = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  margin-bottom: 18px;
  max-width: 667px;

  @media only screen and (max-width: 1250px) {
    font-size: 12px;
    line-height: 14px;
  }
`;

export const ButtonWrapper = styled.div`
  width: 200px;
  margin: 0 auto;
  margin-top: 32px;
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  max-width: 556px;
  margin-top: 48px;

  & > a {
    color: var(--primary-color);
    text-decoration: none;
  }
`;
