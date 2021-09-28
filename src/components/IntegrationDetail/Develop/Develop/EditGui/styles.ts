import styled from 'styled-components';
import { CloseIconMixin } from '../../../../globalStyle';
import file from '../../../../../assets/file.svg';
import cogs from '../../../../../assets/cogs.svg';
import clock from '../../../../../assets/clock.svg';
import playEditor from '../../../../../assets/play-editor.svg';
import add from '../../../../../assets/add.svg';

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 32px 120px;
  border-radius: 8px;
  width: 907px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 1250px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
    overflow: auto;
    padding: 32px 24px;
  }
`;

export const FusebitEditorCard = styled(Card)`
  width: 90%;
  height: 90%;
  padding: 24px 60px;
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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

export const Title = styled.h2`
  font-size: 24px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 32px;

  @media only screen and (max-width: 1250px) {
    font-size: 20px;
    line-height: 22px;
  }
`;

export const LineTitle = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;

  @media only screen and (max-width: 1250px) {
    font-size: 14px;
    line-height: 16px;
    font-weight: 500;
  }
`;
export const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 16px;
`;

export const CopySuccess = styled.p<{ copy: boolean }>`
  font-size: 14px;
  line-height: 16px;
  color: var(--primary-color);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;

  @media only screen and (max-width: 1250px) {
    display: none;
  }
`;

export const OutlinedButtonWrapper = styled.div`
  margin-left: auto;

  @media only screen and (max-width: 1250px) {
    margin: 0 auto;
  }
`;

export const EditorContainer = styled.div`
  .fa {
    background-size: cover;
    background-repeat: no-repeat;

    &-file {
      background-image: url(${file});
    }

    &-cogs {
      background-image: url(${cogs});
    }

    &-clock {
      background-image: url(${clock});
    }

    &-play {
      background-image: url(${playEditor});
    }
  }

  .fusebit-code-action-add-btn {
    height: 1px;
    width: 1px;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }

  .fusebit-theme-light.fusebit-shell {
    position: relative;
    padding: 0 48px;
    padding-bottom: 60px;
    height: calc(100vh - 96px);
    background-color: #eff5ff;
  }

  .fusebit-action-container,
  .fusebit-status-container {
    display: none;
  }

  .fusebit-theme-light {
    .fusebit-main {
      height: 100%;
    }

    .fusebit-modal {
      border-radius: 8px;

      &-container {
        height: 100vh;
        transform: translateY(-96px);
      }
    }

    .fusebit-editor-container {
      padding-top: 20px;
      background-color: #ffffff;
      border-radius: 4px;
    }

    .fusebit-new-file-input {
      font-family: 'Poppins';
      font-size: 14px;
      line-height: 20px;
      border: 0;
      padding: 0;
      background: none;
      border-bottom: 1px solid var(--black);
    }

    .fusebit-nav {
      &-container {
        padding: 32px;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 4px;
        width: 253px;
      }

      &-splitter {
        opacity: 0;
        width: 8px;
      }

      &-category {
        font-family: 'Poppins';
        font-size: 16px;
        line-height: 18px;
        font-weight: 600;
        padding: 0;
        color: var(--black);
        margin-bottom: 16px;
      }

      &-file,
      &-new-file,
      &-item {
        font-family: 'Poppins';
        font-size: 14px;
        line-height: 20px;
        color: var(--black);
        margin-bottom: 12px;
        padding: 0;
        transition: all 0.1s linear;

        &:hover {
          background: none;
          font-weight: 700;
        }
      }

      &-icon {
        margin-right: 18px;

        > svg {
          width: 16px;
          height: 16px;
          margin-bottom: -1px;
          background-size: cover;
          background-repeat: no-repeat;
          > path {
            display: none;
          }
        }
      }

      &-item-selected {
        background: none;
        font-weight: 700;
      }
    }

    .fusebit-logs {
      &-splitter {
        opacity: 0;
        height: 8px;
      }

      &-container {
        font-family: courier;
        background-color: #ffffff;
        border-radius: 4px;
      }
    }
  }
`;

export const Close = styled.div`
  ${CloseIconMixin}
  top: 0;
  right: 0;
  position: relative;
  z-index: 1;
  height: 12px;
  width: 12px;
  margin-left: auto;
  background-size: cover;
`;

export const CloseHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 96px;
  z-index: 10;
  padding: 32px 48px;
  background-color: #eff5ff;

  h3 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    margin: 0;
    font-size: 20px;
    line-height: 26px;
    font-weight: 600;
    color: var(--black);
  }
`;

export const ActionsHelpWrapper = styled.div`
  position: absolute;
  right: 94px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`;

export const ActionsHelpLink = styled.a`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  text-decoration: underline;
  margin-right: 10px;
`;

export const ActionsHelpImage = styled.img`
  height: 16px;
  width: 16px;

  &:hover {
    cursor: pointer;
  }
`;

export const FusebitEditorContainer = styled.div`
  position: relative;
`;

export const FusebitEditorLogo = styled.img`
  position: absolute;
  bottom: 24px;
  right: 48px;
  height: 20px;
  width: 80px;
  object-fit: contain;
`;

export const addNewStyles = `
  position: relative;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #333333;
  cursor: pointer;
`;

export const addNewIcon = `
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 16px;
    width: 16px;
    background-image: url(${add});
    background-size: contain;
    background-repeat: no-repeat;
`;
