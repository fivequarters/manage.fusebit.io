import styled from 'styled-components';
import { MenuItem, Select } from '@material-ui/core';
import Textarea from '@components/common/FormFields/Textarea';

export const Card = styled.div<{ open: boolean }>`
  padding: 0 32px;
  width: 795px;
  border-radius: 8px;

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
