import styled, { css } from 'styled-components';
import arrow from '../../../../../../assets/arrow-down-thin.svg';

const withError = css<{ hasError?: boolean }>`
  margin-bottom: 25px;

  ${(props) =>
    props.hasError &&
    `
  margin-bottom: 0px;
`}
`;

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 64px;
  width: 795px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  outline: transparent;
  transition: all 1s linear;

  @media only screen and (max-width: 550px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

export const GeneralWrapper = styled.div`
  display: flex;
`;

export const Subtitle = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
`;

export const VerbSelector = styled.div<{ hasError?: boolean }>`
  display: flex;
  position: relative;
  font-size: 14px;
  line-height: 20px;
  color: var(--grey);
  border-bottom: 1px solid var(--black);
  padding-bottom: 7px;
  width: 110px;
  margin-top: auto;
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
  }

  ${withError}
`;

export const VerbArrow = styled.div<{ active: boolean }>`
  height: 16px;
  width: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${arrow});
  margin-left: auto;
  margin-top: 3px;
  transform: ${(props) => props.active && 'rotate(180deg)'};
  transition: all 0.25s linear;
`;

export const VerbOptionsWrapper = styled.div<{ active: boolean }>`
  position: absolute;
  top: 35px;
  left: 0;
  opacity: ${(props) => (props.active ? 1 : 0)};
  visibility: ${(props) => (props.active ? 'visible' : 'hidden')};
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
  width: 110px;
  transition: all 0.25s linear;
`;

export const VerbOption = styled.div<{ selected: boolean }>`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => (props.selected ? 'var(--black)' : 'var(--grey)')};
  background-color: ${(props) => props.selected && 'var(--secondary-color)'};
  padding: 8px;
  transition: all 0.25s linear;
  text-transform: uppercase;

  &:hover {
    cursor: pointer;
    color: var(--black);
    background-color: var(--secondary-color);
  }
`;

export const Textarea = styled.textarea<{ height?: string; hasError?: boolean }>`
  font-family: courier;
  font-size: 16px;
  line-height: 18.5px;
  color: var(--black);
  padding: 16px;
  background-color: var(--secondary-color);
  width: 100%;
  border: none;
  resize: none;
  border-radius: 4px;
  height: ${(props) => (props.height ? props.height : '50px')};
  outline: rgba(255, 255, 255, 0);

  ${withError}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;

export const ErrorMessage = styled.p`
  line-height: 20px;
  margin: 5px 0 0 0;
  color: var(--primary-color);
`;
