import styled from 'styled-components';

export const CellName = styled.p`
  color: var(--primary-color);
  font-weight: 500;
`;

export const CellImage = styled.img`
  height: 26px;
  width: 26px;
  margin-right: 16px;
  object-fit: contain;
  border-radius: 50%;
`;

export const Row = styled.tr`
  display: table-row;
  outline: 0;
  vertical-align: middle;
  color: inherit;
  text-decoration: none;
  height: 65px;

  &:hover {
    cursor: pointer;
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const CellNameDetail = styled.p`
  color: #959595;
  font-weight: 500;
  margin-left: 5px;
`;
