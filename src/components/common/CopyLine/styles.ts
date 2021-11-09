import { Typography } from '@material-ui/core';
import styled from 'styled-components';

export const LineInstructionWrapper = styled.div<{ disableCursorPointer?: boolean }>`
  position: relative;
  margin-bottom: 16px;

  &:hover {
    cursor: ${(props) => (props.disableCursorPointer ? 'default' : 'pointer')};

    & > div {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 870px) {
    max-width: none;
  }
`;

export const LineInstruction = styled.div<{ horizontalScrollbar?: boolean; warning?: boolean }>`
  position: relative;
  height: 50px;
  padding: 16px;
  border: 0;
  margin: 0;
  outline: rgba(255, 255, 255, 0);
  border-radius: 4px;
  border: ${(props) => props.warning && '2px solid #F83420'};
  background-color: var(--secondary-color);
  white-space: nowrap;
  font-family: 'Courier';
  font-size: 16px;
  line-height: 18px;
  width: 100%;
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

export const LineInstructionFade = styled.div<{
  change: boolean;
  onlyMobileVisible?: boolean;
  warning?: boolean;
  disabled?: boolean;
}>`
  display: ${(props) => props.onlyMobileVisible && 'none'};
  position: absolute;
  right: 0;
  top: 0;
  height: 50px;
  width: ${(props) => (props.change && !props.disabled ? '300px' : '60px')};
  background-image: linear-gradient(to left, #eff5ff 10%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
  transition: width 0.25s linear;

  @media only screen and (max-width: 1250px) {
    right: -2px;
    display: ${(props) => props.onlyMobileVisible && 'block'};
    width: 300px !important;
  }

  ${(props) =>
    props.warning &&
    `
      border-radius: 4px;
      border: 2px solid #F83420;
      border-left: 0;
  `}
`;

export const LineInstructionCopy = styled.div<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  visibility: ${(props) => (props.disabled ? 'hidden' : 'visible')};
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
    opacity: 1;
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

export const Text = styled(Typography)`
  font-family: Courier;
  overflow-x: hidden;
`;
