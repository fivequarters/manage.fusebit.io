import { Card, CardContent, CardHeader, CardActions } from '@material-ui/core';
import styled from 'styled-components';
import Loader from '../../common/Loader';

const StyledCardHeader = styled(CardHeader)`
  padding: 32px 32px 0;

  span {
    font-size: 16px;
    line-height: 18px;
    font-weight: 600;
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
`;

const StyledCardActions = styled(CardActions)`
  margin: auto auto 0;
  padding: 32px;

  & button {
    white-space: nowrap;
  }
`;

interface Props {
  title: string;
  actions: React.ReactNode;
  className?: string;
  onClickCard?: () => void;
  isLoading?: boolean;
}

const BaseCard: React.FC<Props> = ({ title, children, className, actions, onClickCard, isLoading }) => {
  return (
    <StyledCard className={className} onClick={onClickCard}>
      <StyledCardHeader title={title} />
      <StyledContent>{isLoading ? <Loader /> : children}</StyledContent>
      <StyledCardActions>{actions}</StyledCardActions>
    </StyledCard>
  );
};

export default BaseCard;