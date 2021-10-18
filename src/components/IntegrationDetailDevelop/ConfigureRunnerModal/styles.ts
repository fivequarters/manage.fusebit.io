import styled from 'styled-components';
import { MenuItem, Select } from '@material-ui/core';
import Textarea from '../../FormFields/Textarea';

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

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
`;

export const ErrorMessage = styled.p`
  line-height: 20px;
  margin: 5px 0 0 0;
  color: var(--primary-color);
`;

export const PayloadTextarea = styled(Textarea)`
  height: 250px !important;
`;

export const VerbSelect = styled(Select)`
  width: 110px;
  margin-top: 19px;
  font-size: 14px;
`;

export const VerbItem = styled(MenuItem)`
  font-size: 14px;
`;
