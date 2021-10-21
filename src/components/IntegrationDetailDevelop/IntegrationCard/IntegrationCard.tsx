import { Card, CardContent, CardActions, Box, CircularProgress, useMediaQuery, useTheme } from '@material-ui/core';
import styled from 'styled-components';
import fusebitLogo from '../../../assets/fusebit-logo.svg';
import { useGetIntegrationFromCache } from '../../../hooks/useGetIntegrationFromCache';
import { useModal } from '../../../hooks/useModal';
import Button from '../../common/Button/Button';
import EditGuiModal from '../EditGuiModal';
import useEditor from '../FusebitEditor/useEditor';
import MobileDrawer from '../MobileDrawer';

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

const IntegrationCard: React.FC<Props> = ({ name, className }) => {
  const [editGuiModalOpen, setEditGuiModalOpen] = useModal();
  const { handleEdit, isEditing } = useEditor({ enableListener: false, onReadyToRun: () => setEditGuiModalOpen(true) });
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const integrationData = useGetIntegrationFromCache();

  return (
    <>
      {matchesMobile ? (
        <MobileDrawer open={editGuiModalOpen} onClose={() => setEditGuiModalOpen(false)} />
      ) : (
        <EditGuiModal
          onClose={() => {
            setEditGuiModalOpen(false);
          }}
          open={editGuiModalOpen}
          integrationId={integrationData?.data.id || ''}
        />
      )}
      <StyledCard className={className}>
        <StyledContent>
          <Box display="flex" mb="32px" justifyContent="center">
            <img src={fusebitLogo} alt="fusebit" width={109} height={28} />
          </Box>
          <h3>{name}</h3>
        </StyledContent>
        <StyledActions>
          <Button
            onClick={handleEdit}
            style={{ width: '200px' }}
            variant="contained"
            color="primary"
            disabled={isEditing}
          >
            {isEditing ? <CircularProgress size={20} /> : 'Edit'}
          </Button>
        </StyledActions>
      </StyledCard>
    </>
  );
};

export default IntegrationCard;
