import { Card, CardContent, CardActions, Box, CircularProgress, useMediaQuery, useTheme } from '@material-ui/core';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import fusebitLogo from '../../../assets/fusebit-logo.svg';
import { ACCOUNT_INTEGRATIONS_GET_ONE } from '../../../hooks/api/v2/account/integration/useGetOne';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { ApiResponse } from '../../../hooks/useAxios';
import { useModal } from '../../../hooks/useModal';
import { Integration } from '../../../interfaces/integration';
import Button from '../../common/Button/Button';
import EditGuiModal from '../EditGuiModal';
import useEditor from '../FusebitEditor/useEditor';
import MobileDrawer from '../MobileDrawer';

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
  const [editGuiModalOpen, setEditGuiModalOpen] = useModal();
  const { handleEdit, isEditing } = useEditor({ enableListener: false, onReadyToRun: () => setEditGuiModalOpen(true) });
  const queryClient = useQueryClient();
  const { userData } = useAuthContext();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const matchesMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // TODO: Move to a custom hook
  const integrationData = queryClient.getQueryData<ApiResponse<Integration>>([
    ACCOUNT_INTEGRATIONS_GET_ONE,
    { id, accountId: userData.accountId, subscriptionId: userData.subscriptionId },
  ]);

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
          {name}
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

export default EditorCard;
