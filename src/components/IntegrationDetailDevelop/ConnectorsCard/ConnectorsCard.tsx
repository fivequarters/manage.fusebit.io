import { Box } from '@material-ui/core';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';

const connectors = ['Slack 1', 'Slack 2'];

const ConnectorsCard = () => {
  return (
    <BaseCard title="Your Application">
      <Box>
        {connectors.map((b) => (
          <BackendItem key={b} name={b} />
        ))}
      </Box>
    </BaseCard>
  );
};

export default ConnectorsCard;
