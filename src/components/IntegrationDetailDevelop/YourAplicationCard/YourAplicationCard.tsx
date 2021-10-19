import { Box } from '@material-ui/core';
import BackendItem from '../BackendItem';
import BaseCard from '../BaseCard';

const backends = ['Stage', 'Stage 2'];

const YourAplication = () => {
  return (
    <BaseCard title="Your Application">
      <Box>
        {backends.map((b) => (
          <BackendItem key={b} name={b} />
        ))}
      </Box>
    </BaseCard>
  );
};

export default YourAplication;
