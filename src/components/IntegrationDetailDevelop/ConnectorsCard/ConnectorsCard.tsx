import { Box } from '@material-ui/core';
import Button from '../../common/Button/Button';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';

const connectors = ['Slack 1', 'Slack 2'];

interface Props {
  className?: string;
}

const ConnectorsCard: React.FC<Props> = ({ className }) => {
  return (
    <BaseCard
      className={className}
      title="Your Application"
      actions={
        <>
          <Button
            mode="add"
            style={{
              width: 160,
            }}
            // onClick={handleConnectOpen}
            // disabled={backendClients.length >= 5}
          >
            Add new
          </Button>
          <Button
            mode="add"
            style={{
              width: 160,
            }}
            // onClick={handleConnectOpen}
            // disabled={backendClients.length >= 5}
          >
            Link existing
          </Button>
        </>
      }
    >
      <Box>
        {connectors.map((b) => (
          <BackendItem key={b} name={b} />
        ))}
      </Box>
    </BaseCard>
  );
};

export default ConnectorsCard;
