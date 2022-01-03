import { Breadcrumbs, Button, Box } from '@mui/material';
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
  text-align: left;
  width: max-content;

  ${(props) => props.active && `font-weight: 600;`}
`;

const StyledArrowContainer = styled(Box)<{ $active?: boolean }>`
  transition: transform 0.25s linear;

  ${(props) =>
    props.$active &&
    `
  transform: rotate(180deg);
`}
`;

interface Props {
  items: {
    text: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, isLastItem: boolean) => void;
    active?: boolean;
  }[];
  lastItemAction?: boolean;
  isArrowActive?: boolean;
}

const NavbarBreadcrumb: React.FC<Props> = ({ items, lastItemAction = true, isArrowActive }) => {
  return (
    <>
      <Breadcrumbs separator={<img src={arrow} alt="arrow" />} aria-label="breadcrumb">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <StyledButton key={item.text} onClick={(e) => item.onClick(e, isLastItem)}>
              <StyledText active={lastItemAction ? isLastItem : item.active}>{item.text}</StyledText>
              {isLastItem && lastItemAction && (
                <StyledArrowContainer ml="8px" $active={isArrowActive}>
                  <img src={arrowDown} alt="arrow" />
                </StyledArrowContainer>
              )}
            </StyledButton>
          );
        })}
      </Breadcrumbs>
    </>
  );
};

export default NavbarBreadcrumb;
