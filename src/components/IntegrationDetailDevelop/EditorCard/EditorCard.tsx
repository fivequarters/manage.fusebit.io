import { Card, CardContent, CardActions, Box } from '@material-ui/core';
import styled from 'styled-components';
import fusebitLogo from '../../../assets/fusebit-logo.svg';
import Button from '../../common/Button/Button';

export const FusebitCard = styled(Box)`
  position: relative;
  height: 260px;
  width: 285px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  border: 2px solid #f83420;
`;

export const FusebitLogo = styled(Box)`
  width: 109px;
  height: 28px;
  background-image: url(${fusebitLogo});
  background-size: contain;
  background-repeat: no-repeat;
`;

export const FusebitIntegration = styled.h3`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  text-align: center;
  color: var(--black);
`;

const StyledCard = styled(Card)`
  height: 260px;
  width: 285px;
  margin: 0 auto;
  border: 2px solid #f83420;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(CardContent)`
  padding: 32px;
`;

const StyledActions = styled(CardActions)`
  padding: 32px;
  margin-top: 0;
`;

interface Props {
  name: string;
  className?: string;
}

const EditorCard: React.FC<Props> = ({ name, className }) => {
  return (
    <StyledCard className={className}>
      <StyledContent>
        <Box display="flex" mb="32px" justifyContent="center">
          <img src={fusebitLogo} alt="fusebit" width={109} height={28} />
        </Box>
        {name}
      </StyledContent>
      <StyledActions>
        <Button
          // onClick={() => editOptions[editOption].handle(true)}
          style={{ width: '200px' }}
          variant="contained"
          color="primary"
          // disabled={!!editOptions[editOption]?.disabled}
        >
          Edit
        </Button>
      </StyledActions>
    </StyledCard>
  );
};

export default EditorCard;
