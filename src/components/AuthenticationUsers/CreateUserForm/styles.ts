import styled from 'styled-components';

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 64px;
  height: 544px;
  width: 642px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 660px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    padding: 32px;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0px auto;
  width: 400px;

  @media only screen and (max-width: 660px) {
    width: 100%;
  }
`;

export const FormInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 64px;

  @media only screen and (max-width: 880px) {
  }
`;

export const UserCreatedButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 90px;
`;
