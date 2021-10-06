import { TableCell, TableHead, TableRow, Checkbox } from '@material-ui/core';
import arrowRight from '../../assets/arrow-right.svg';
import arrowLeft from '../../assets/arrow-left.svg';
import { BaseTableProps } from './types';
import * as SC from './styles';

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
        <TableCell>{headers[0].value}</TableCell>
        <TableCell align="left">
          <SC.TableCellMobile>
            <p>{mobileArrowColumns[mobileColumnIndex].value}</p>
            {mobileArrowColumns.length > 1 && (
              <>
                {!!mobileArrowColumns[mobileColumnIndex - 1] && (
                  <SC.LeftArrow
                    onClick={onPreviousCellSelect}
                    src={arrowLeft}
                    alt="previous-cell"
                    height="16"
                    width="16"
                  />
                )}

                {!!mobileArrowColumns[mobileColumnIndex + 1] && (
                  <SC.RightArrow onClick={onNextCellSelect} src={arrowRight} alt="next-cell" height="16" width="16" />
                )}
              </>
            )}
          </SC.TableCellMobile>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default MobileBaseTableHeader;
