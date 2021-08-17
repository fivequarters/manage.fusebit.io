import styled from 'styled-components';

export const Row = styled.tr`
  display: table-row;
  outline: 0;
  vertical-align: middle;
  color: inherit;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

export const CellName = styled.p`
  color: var(--primary-color);
  font-weight: 500;
`;
