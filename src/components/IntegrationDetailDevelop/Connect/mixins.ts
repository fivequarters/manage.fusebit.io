import styled from 'styled-components';
import time from '@assets/time.svg';

export const StyledTimeIcon = styled.div`
  height: 14px;
  width: 14px;
  background-image: url(${time});
  background-size: contain;
  background-repeat: no-repeat;
`;

export const StyledTimeDescription = styled.p<{ margin?: string }>`
  font-size: 12px;
  line-height: 16px;
  font-weight: 300;
  color: var(--black);
  margin-left: 10px;
  margin: ${(props) => props.margin && props.margin};
`;
