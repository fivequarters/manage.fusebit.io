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

export const ButtonWrapper = styled.div`
  width: 200px;
  margin: 0 auto;
  margin-top: 32px;
`;
