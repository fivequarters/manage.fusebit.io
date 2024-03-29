import { Card, CardContent, CardHeader, CardActions } from '@material-ui/core';
import styled from 'styled-components';
import Loader from '@components/common/Loader';

const StyledCardHeader = styled(CardHeader)`
  padding: 32px 32px 0;

  span {
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
  }

  @media only screen and (max-width: 1200px) {
    padding: 24px 24px 0;
  }
`;

const StyledCard = styled(Card)`
  min-height: 358px;
  max-width: 389px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(CardContent)`
  padding: 32px;

  @media only screen and (max-width: 1200px) {
    padding: 24px;
  }
`;

const StyledCardActions = styled(CardActions)`
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding: 0 32px 32px;

  & button {
    white-space: nowrap;
  }

  @media only screen and (max-width: 1200px) {
    padding: 0 24px 24px;
  }

  @media only screen and (max-width: 450px) {
    padding: 0 10px 24px;
  }
`;

interface Props {
  title: string;
  actions: React.ReactNode;
  className?: string;
  onClickCard?: () => void;
  isLoading?: boolean;
  id?: string;
}

const BaseCard: React.FC<Props> = ({ title, id, children, className, actions, onClickCard, isLoading }) => {
  return (
    <StyledCard className={className} onClick={onClickCard} id={id}>
      <StyledCardHeader title={title} />
      <StyledContent>{isLoading ? <Loader /> : children}</StyledContent>
      <StyledCardActions>{actions}</StyledCardActions>
    </StyledCard>
  );
};

export default BaseCard;
