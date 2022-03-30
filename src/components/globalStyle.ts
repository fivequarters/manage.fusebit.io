import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import spinner from '@assets/spinner.svg';
import copy from '@assets/copy.svg';
import { IconButton } from '@material-ui/core';

export default createGlobalStyle`
   :root {
        --primary-color: #F83420;
        --secondary-color: rgba(215, 229, 255, 0.4);
        --black: #333333;
        --grey: #959595;
        --yellow: #FFC940;
        --navbar-height: 185px;
    }
    
    a {
        text-decoration: none;
        span {
            display: block;
        }
    }

    .monaco-editor {
      a {
          span {
              display: initial;
          }
      }
    }

    #pendo-text-7f2119cd { // this is pendo launch guide, for some reason it doesnt have cursor pointer by default ):
      &:hover {
        cursor: pointer;
      }
    }

    #_pendo-badge_jF5N6MCHUdDHNs8d6qkdUArNI6M { // this is pendo launch guide wrapper
      z-index: 0 !important;
    }

    // TODO: Review if this can be moved to the notistack provider
    .SnackbarItem-variantError {
      background-color: #D32F2F !important;
    }

    button {
      &:hover {
        cursor: pointer;
      }
    }

    @media only screen and (max-width: 880px) {
      :root {
        --navbar-height: 164px;
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

export const InfoField = styled.h4`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  margin: 0;
  color: black;
`;

export const InfoFieldPlaceholder = styled.div`
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  color: var(--grey);
  margin-bottom: 4px;
`;

export const InfoFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const withError = css<{ $hasError?: boolean }>`
  margin-bottom: 25px;

  ${(props) =>
    props.$hasError &&
    `
    margin-bottom: 0px;
  `}
`;

export const inputBlueMixin = css<{ hasError: boolean }>`
  padding: 8px 16px;
  background-color: var(--secondary-color);
  width: 100%;
  border: none;
  resize: none;
  border-radius: 4px;
  outline: rgba(255, 255, 255, 0);
  margin: 0;
  min-height: 50px !important;

  & > div > input {
    font-family: courier;
    font-size: 16px;
    line-height: 18.5px;
    color: var(--black);
  }
  & > ::after {
    display: none;
  }

  & > ::before {
    display: none;
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

export const ModalDescription = styled.p<{ textAlign?: string; margin?: string; maxWidth?: string }>`
  font-size: 16px;
  line-height: 22px;
  color: var(--black);
  max-width: ${(props) => props.maxWidth && props.maxWidth};
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

export const Copy = styled.div<{ margin?: string }>`
  min-height: 12px;
  min-width: 12px;
  background-image: url(${copy});
  background-repeat: no-repeat;
  background-size: contain;
  margin: ${(props) => props.margin && props.margin};

  &:hover {
    cursor: pointer;
  }
`;

export const CloseWrapper = styled(IconButton)`
  position: absolute;
  right: 16px;
  top: 16px;
  color: var(--black);
`;

export const StyledListItem = styled.li`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);

  @media only screen and (max-width: 510px) {
    font-size: 12px;
    line-height: 16px;
  }

  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

export const editorNavTextStyles = css`
  font-family: 'Poppins';
  font-size: 14px;
  line-height: 20px;
  font-weight: inherit;
  color: var(--black);
`;

export const StyleEditorNavLink = styled.a`
  ${editorNavTextStyles}
  text-decoration: underline;
  color: var(--black);
  width: fit-content;
  margin-bottom: 12px;
`;
