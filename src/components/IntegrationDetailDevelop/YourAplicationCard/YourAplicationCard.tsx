import { Box } from '@material-ui/core';
import Button from '../../common/Button/Button';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';

const backends = ['Stage', 'Stage 2'];

const YourAplication = () => {
  return (
    <BaseCard
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
