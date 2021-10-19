import { Card, CardContent, CardHeader } from '@material-ui/core';
import styled from 'styled-components';

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
  max-width: 379px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  border-radius: 8px;
`;

const StyledContent = styled(CardContent)`
  padding: 32px;
`;

interface Props {
  title: string;
}

const BaseCard: React.FC<Props> = ({ title, children }) => {
  return (
    <StyledCard>
      <StyledCardHeader title={title} />
      <StyledContent>{children}</StyledContent>
    </StyledCard>
  );
};

export default BaseCard;
