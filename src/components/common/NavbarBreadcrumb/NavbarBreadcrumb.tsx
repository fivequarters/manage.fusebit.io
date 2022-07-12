import { Breadcrumbs, Button, Box } from '@material-ui/core';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { urlOrSvgToImage } from '@utils/utils';
import arrow from '@assets/right-arrow-white.svg';
import arrowDown from '@assets/down-arrow-white.svg';
import { BreadcrumbItem } from '@interfaces/entityBreadcrumb';

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

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  margin-right: 10px;
`;

const StyledIcon = styled.img`
  height: 24px;
  width: 24px;
  object-fit: contain;
`;

interface Props {
  items: BreadcrumbItem[];
  lastItemAction?: boolean;
  isArrowActive?: boolean;
}

const NavbarBreadcrumb: React.FC<Props> = ({ items, lastItemAction = true, isArrowActive }) => {
  return (
    <>
      <Breadcrumbs separator={<img src={arrow} alt="arrow" />} aria-label="breadcrumb" style={{ marginTop: '10px' }}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;

          if (item.href) {
            return (
              <Link to={item.href}>
                <StyledText active={item.active}>{item.text}</StyledText>
              </Link>
            );
          }

          return (
            <StyledButton key={item.text} onClick={(e) => item.onClick?.(e, isLastItem)}>
              {item.icon && (
                <StyledIconWrapper>
                  <StyledIcon src={urlOrSvgToImage(item.icon)} alt="icon" />
                </StyledIconWrapper>
              )}
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
