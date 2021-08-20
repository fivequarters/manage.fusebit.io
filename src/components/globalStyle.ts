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

export const Spinner = styled.div<{ loading: boolean }>`
  display: ${(props) => (props.loading ? 'block' : 'none')};
  height: 18px;
  width: 18px;
  background-image: url(${spinner});
  background-size: contain;
  animation: ${rotate} 1s linear infinite;
`;
