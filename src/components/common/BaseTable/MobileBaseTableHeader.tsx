import { TableCell, TableHead, TableRow, Checkbox } from '@material-ui/core';
import arrowRight from '@assets/arrow-right.svg';
import arrowLeft from '@assets/arrow-left.svg';
import styled from 'styled-components';
import { BaseTableProps } from './types';

const StyledTableCellMobile = styled.div`
  position: relative;
  width: 100%;

  p {
    width: max-content;
    margin: 0;
  }
`;

const StyledRightArrow = styled.img`
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 16px;
  object-fit: contain;
  background-repeat: no-repeat;
`;

const StyledLeftArrow = styled(StyledRightArrow)`
  left: -25px;
`;

const MobileBaseTableHeader = ({
  rows,
  selected,
  onSelectAll,
  headers,
  mobileArrowColumns,
  mobileColumnIndex,
  onNextCellSelect,
  onPreviousCellSelect,
  isAllChecked,
  hideCheckAll,
}: Pick<BaseTableProps, 'rows' | 'selected' | 'onSelectAll' | 'headers' | 'isAllChecked' | 'hideCheckAll'> & {
  mobileArrowColumns: BaseTableProps['headers'];
  mobileColumnIndex: number;
  onPreviousCellSelect: () => void;
  onNextCellSelect: () => void;
}) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {!hideCheckAll && (
            <Checkbox
              color="primary"
              checked={isAllChecked || (rows.length > 0 && selected.length === rows.length)}
              onChange={onSelectAll}
            />
          )}
        </TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>{headers[0].value}</TableCell>
        <TableCell align="left">
          <StyledTableCellMobile>
            <p>{mobileArrowColumns[mobileColumnIndex].value}</p>
            {mobileArrowColumns.length > 1 && (
              <>
                {!!mobileArrowColumns[mobileColumnIndex - 1] && (
                  <StyledLeftArrow
                    onClick={onPreviousCellSelect}
                    src={arrowLeft}
                    alt="previous-cell"
                    height="16"
                    width="16"
                  />
                )}

                {!!mobileArrowColumns[mobileColumnIndex + 1] && (
                  <StyledRightArrow
                    onClick={onNextCellSelect}
                    src={arrowRight}
                    alt="next-cell"
                    height="16"
                    width="16"
                  />
                )}
              </>
            )}
          </StyledTableCellMobile>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default MobileBaseTableHeader;
