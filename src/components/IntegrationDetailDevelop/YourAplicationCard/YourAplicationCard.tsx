import { Box } from '@material-ui/core';
import Button from '../../common/Button/Button';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';

const backends = ['Stage', 'Stage 2', 'Stage 2', 'Stage 2', 'Stage 2'];

interface Props {
  className?: string;
}

const YourAplication: React.FC<Props> = ({ className }) => {
  return (
    <BaseCard
      className={className}
      title="Your Application"
      actions={
        <Button
          mode="add"
          style={{
            width: 200,
          }}
          // onClick={handleConnectOpen}
          // disabled={backendClients.length >= 5}
        >
          Connect
        </Button>
      }
    >
      <Box>
        {backends.map((b) => (
          <BackendItem key={b} name={b} />
        ))}
      </Box>
    </BaseCard>
  );
};

export default YourAplication;
