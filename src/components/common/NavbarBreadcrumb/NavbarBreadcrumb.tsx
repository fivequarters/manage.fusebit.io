import { Breadcrumbs, Button, Box } from '@material-ui/core';
import styled from 'styled-components';
import arrow from '../../../assets/right-arrow-white.svg';
import arrowDown from '../../../assets/down-arrow-white.svg';

const StyledButton = styled(Button)`
  padding: 0;
`;

const StyledText = styled.span<{ active?: boolean }>`
  font-size: 20px;
  font-weight: 300;
  margin: 0;
  color: white;

  ${(props) => props.active && `font-weight: 600;`}
`;

interface Props {
  items: {
    text: string;
    onClick: (event: any, isLastItem: boolean) => void;
    active?: boolean;
  }[];
  lastItemAction?: boolean;
}

const NavbarBreadcrumb: React.FC<Props> = ({ items, lastItemAction = true }) => {
  return (
    <>
      <Breadcrumbs separator={<img src={arrow} alt="arrow" />} aria-label="breadcrumb">
        {items.map((i, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <StyledButton key={i.text} onClick={(e) => i.onClick(e, isLastItem)}>
              <StyledText active={lastItemAction ? isLastItem : i.active}>{i.text}</StyledText>
              {isLastItem && lastItemAction && (
                <Box ml="8px">
                  <img src={arrowDown} alt="arrow" />
                </Box>
              )}
            </StyledButton>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default NavbarBreadcrumb;
