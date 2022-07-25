import { Box } from '@material-ui/core';
import styled from 'styled-components';

const StyledMissingEntity = styled.div`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);

  span {
    color: var(--black);
    text-decoration: underline;
    cursor: pointer;
  }

  @media only screen and (max-width: 880px) {
    margin-left: 16px;
  }
`;

interface Props {
  entityName: 'Integration' | 'Connector' | string;
  onClick: () => void;
}

const MissingEntity = ({ entityName, onClick }: Props) => {
  return (
    <Box mt="auto" mb="auto">
      <StyledMissingEntity>
        Missing {entityName === 'Integration' ? 'an' : 'a'} {entityName}?
      </StyledMissingEntity>
      <StyledMissingEntity
        onClick={() => {
          window?.Intercom?.('showNewMessage', '');
          onClick();
        }}
      >
        <span>Reach out to us!</span>
      </StyledMissingEntity>
    </Box>
  );
};

export default MissingEntity;
