import styled from 'styled-components';
import arrow from '../../../assets/table-arrow.svg';

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

export const CellName = styled.p`
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
  margin-top: 56px;
  width: 100%;
`;

export const ButtonMargin = styled.div`
  margin-left: auto;
  margin-bottom: 36px;

  @media only screen and (max-width: 880px) {
    margin: 0 auto 36px;
  }
`;

export const Table = styled.div`
  @media only screen and (max-width: 880px) {
    display: none;
  }
`;

export const TableMobile = styled.div`
  display: none;
  @media only screen and (max-width: 880px) {
    display: block;
  }
`;

export const TableCellMobile = styled.div`
  position: relative;
  width: 100%;

  p {
    width: 90px;
    margin: 0;

    @media only screen and (max-width: 345px) {
      width: 70px;
    }
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
