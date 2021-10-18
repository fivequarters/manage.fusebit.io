import styled, { css } from 'styled-components';
import { TableRow as MUITableRow, TableCell as MUICellRow, Box } from '@material-ui/core';
import arrow from '../../../assets/table-arrow.svg';
import upArrowPrimary from '../../../assets/up-arrow-primary.svg';

export const Wrapper = styled.div`
  padding-bottom: 80px;
`;

export const DeleteWrapper = styled.div<{ active: boolean }>`
  display: ${(props) => (props.active ? 'flex' : 'none')};
  align-items: center;
  opacity: ${(props) => (props.active ? 1 : 0)};
  font-size: 18px;
  line-height: 22px;
  font-weight: 400;
  padding: 0 18px;
  min-height: 57px;
  width: 100%;
  color: ${(props) => (props.active ? 'var(--primary-color)' : 'var(--black)')};
  background-color: ${(props) => props.active && 'rgba(248, 52, 32, .1)'};
  margin-bottom: 12px;
  transition: all 0.25s linear;
`;

export const DeleteIconWrapper = styled.div`
  margin-left: auto;
`;

export const ArrowUp = styled.div`
  height: 10px;
  width: 10px;
  margin-right: 12px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url(${arrow});
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export const CellName = styled.p<{ regularColor?: boolean }>`
  color: var(--primary-color);
  font-weight: 500;
`;

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

export const ButtonContainer = styled.div`
  display: flex;
  margin: 56px 0 36px;
  width: 100%;
`;

export const ButtonMargin = styled.div`
  margin-left: auto;
  margin-bottom: 36px;

  @media only screen and (max-width: 880px) {
    margin: 0 auto 36px;
  }
`;

export const Table = styled.div``;

export const TableMobile = styled.div``;

export const TableCellMobile = styled.div`
  position: relative;
  width: 100%;

  p {
    width: max-content;
    margin: 0;
  }
`;

export const RightArrow = styled.img`
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 16px;
  object-fit: contain;
  background-repeat: no-repeat;
`;

export const LeftArrow = styled(RightArrow)`
  left: -25px;
`;

export const LoaderContainer = styled.tr`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 24px;
`;

export const NoData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const noBorderMixin = css`
  ${(props: { $noBorder?: boolean }) =>
    props.$noBorder &&
    css`
      & > td {
        border-bottom: 0;
      }
    `}
`;

export const ExpandableRow = styled(MUITableRow)<{ $noBorder?: boolean }>`
  ${noBorderMixin}
`;

export const TableRow = styled(MUITableRow)<{ $noBorder?: boolean }>`
  display: table-row;
  outline: 0;
  vertical-align: middle;
  color: inherit;
  text-decoration: none;
  height: 65px;

  ${noBorderMixin}
`;

export const TableCell = styled(MUICellRow)<{ $isMain?: boolean; $isClickable?: boolean }>`
  position: relative;

  ${(props) =>
    props.$isMain &&
    css`
      & > div {
        color: var(--primary-color);
        font-weight: 500;
      }
    `}

  ${(props) =>
    props.$isClickable &&
    css`
      cursor: pointer;
    `}
`;

export const CellContent = styled.div<{ $isClickable?: boolean }>`
  ${(props) =>
    props.$isClickable &&
    css`
      display: flex;
      align-items: center;
    `}
`;

export const TriggerArrow = styled.div<{ $active: boolean; $isMain?: boolean }>`
  width: 14px;
  margin-left: 10px;
  height: 10px;
  background-image: url(${upArrowPrimary});
  background-size: contain;
  background-repeat: no-repeat;
  transform: ${(props) => props.$active && 'rotate(180deg)'};
  transition: all 0.25s linear;
  flex-shrink: 0;
  filter: ${(props) =>
    !props.$isMain &&
    'invert(0%) sepia(0%) saturate(0%) hue-rotate(279deg) brightness(95%) contrast(101%);'}; // this is #333333 converted to a filter

  @media only screen and (max-width: 880px) {
    margin-left: 5px;
  }
`;

export const TableContainer = styled.div`
  overflow: auto;
`;

export const ButtonsContainer = styled(Box)`
  margin-left: -20px;

  & > button {
    margin-left: 20px;
  }
`;
