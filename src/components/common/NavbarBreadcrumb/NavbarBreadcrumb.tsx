import { Breadcrumbs, Button, Box } from '@material-ui/core';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { urlOrSvgToImage } from '@utils/utils';
import arrow from '@assets/right-arrow-white.svg';
import arrowDown from '@assets/down-arrow-white.svg';
import { BreadcrumbItem } from '@interfaces/entityBreadcrumb';
import * as CSC from '@components/globalStyle';

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
  padding: 5px;
  background: white;
  border-radius: 8px;
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
  isLoadingIcon?: boolean;
}

const NavbarBreadcrumb: React.FC<Props> = ({ items, lastItemAction = true, isArrowActive, isLoadingIcon }) => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Breadcrumbs
        separator={<img src={arrow} alt="arrow" />}
        aria-label="breadcrumb"
        style={{ marginTop: '8px', height: '40px' }}
      >
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
              {item.icon && !isLoadingIcon ? (
                <StyledIconWrapper>
                  <StyledIcon src={urlOrSvgToImage(item.icon)} alt="icon" />
                </StyledIconWrapper>
              ) : (
                isLoadingIcon &&
                id && (
                  <Box mr="10px" padding="10px">
                    <CSC.Spinner />
                  </Box>
                )
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
