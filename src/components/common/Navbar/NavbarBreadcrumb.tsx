import { Breadcrumbs, Button, Box } from '@material-ui/core';
import styled from 'styled-components';
import arrow from '../../../assets/right-arrow-white.svg';
import BreadCrumText from './BreadCrumText';
import arrowDown from '../../../assets/down-arrow-white.svg';

const StyledButton = styled(Button)`
  padding: 0;
`;

interface Props {
  items: {
    text: string;
    onClick: (event: any, isLastItem: boolean) => void;
  }[];
}

const NavbarBreadcrumb: React.FC<Props> = ({ items }) => {
  return (
    <>
      <Breadcrumbs separator={<img src={arrow} alt="arrow" />} aria-label="breadcrumb">
        {items.map((i, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <StyledButton key={i.text} onClick={(e) => i.onClick(e, isLastItem)}>
              <BreadCrumText active={isLastItem}>{i.text}</BreadCrumText>
              {isLastItem && (
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
