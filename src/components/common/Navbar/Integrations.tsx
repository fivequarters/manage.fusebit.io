import { Breadcrumbs, Button, Box } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import arrow from '../../../assets/right-arrow-white.svg';
import { useGetRedirectLink } from '../../../hooks/useGetRedirectLink';
import BreadCrumText from './BreadCrumText';
import arrowDown from '../../../assets/down-arrow-white.svg';
import EntitiesMenu from './EntitiesMenu';
import useAnchor from './useAnchor';

interface Props {
  title: string;
  titleLinkTo: string;
}

const StyledButton = styled(Button)`
  padding: 0;
`;

const Integrations: React.FC<Props> = ({ title, titleLinkTo }) => {
  const history = useHistory();
  // const { getRedirectLink } = useGetRedirectLink();
  const { anchorEl, handleClose, handleClick } = useAnchor();
  const { id } = useParams<{ id?: string }>();

  const handleClickTitle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (id) {
      history.push(titleLinkTo);
    } else {
      handleClick(event);
    }
  };

  const getArrow = () => (
    <Box ml="8px">
      <img src={arrowDown} alt="arrow" />
    </Box>
  );

  return (
    <>
      <EntitiesMenu anchorEl={anchorEl} onClose={handleClose} />
      <Breadcrumbs separator={<img src={arrow} alt="arrow" />} aria-label="breadcrumb">
        <StyledButton onClick={handleClickTitle}>
          <BreadCrumText active={!id}>{title}</BreadCrumText>
          {!id && getArrow()}
        </StyledButton>
        {id && (
          <StyledButton onClick={handleClick}>
            <BreadCrumText active>{id}</BreadCrumText>
            {getArrow()}
          </StyledButton>
        )}
      </Breadcrumbs>
    </>
  );
};

export default Integrations;
