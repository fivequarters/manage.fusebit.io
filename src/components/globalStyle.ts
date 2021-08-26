import { createGlobalStyle, keyframes } from 'styled-components';
import styled from 'styled-components';
import spinner from '../assets/spinner.svg';

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
