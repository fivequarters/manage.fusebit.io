import { createGlobalStyle, keyframes } from 'styled-components';
import styled from 'styled-components';
import spinner from '../assets/spinner.svg';
import cross from '../assets/cross.svg';

export default createGlobalStyle`
   :root {
        --primary-color: #F83420;
        --secondary-color: rgba(215, 229, 255, 0.4);
        --black: #333333;
        --grey: #959595;
    }
    a {
        text-decoration: none;
        span {
            display: block;
        }
    }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div<{ margin?: string }>`
  height: 20px;
  width: 20px;
  background-image: url(${spinner});
  background-size: contain;
  margin: ${(props) => props.margin && props.margin};
  animation: ${rotate} 1s linear infinite;
`;

export const BigSpinner = styled(Spinner)`
  height: 50px;
  width: 50px;
`;

export const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
`;

export const BigSpinnerContainer = styled(LoaderContainer)`
  margin-top: 0;
  height: 100vh;
  justify-content: center;
`;

export const ModalTitle = styled.h2<{ margin?: string }>`
  font-size: 24px;
  line-height: 30px;
  font-weight: 600;
  color: var(--black);
  margin: ${(props) => (props.margin ? props.margin : '0 0 50px 0')};
  text-align: center;
`;

export const ModalDescription = styled.p<{ textAlign?: string; margin?: string }>`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  margin: ${(props) => (props.margin ? props.margin : 0)};
  text-align: ${(props) => props.textAlign && props.textAlign};
  margin-bottom: 24px;

  & > a {
    color: var(--primary-color);
    text-decoration: none;
  }
`;

export const LineTitle = styled.h4<{ margin?: string }>`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: ${(props) => (props.margin ? props.margin : '16px')};

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Close = styled.div`
  height: 12px;
  width: 12px;
  object-fit: contain;
  position: absolute;
  background-image: url(${cross});
  background-repeat: no-repeat;
  top: 32px;
  right: 32px;
  transition: all 0.25s linear;

  &:hover {
    cursor: pointer;
    transform: rotate(90deg);
  }
`;
