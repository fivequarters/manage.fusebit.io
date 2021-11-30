import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@hooks/useAuthContext';
import { createSampleAppClientUrl } from '@utils/backendClients';
import styled from 'styled-components';

interface IProps {
  componentMap: Record<string, string>;
}

const StyledSampleApp = styled.a`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  text-decoration: underline;
  margin-right: 10px;
`;

// TODO: Remove duplication with LinkSampleApp
export const EditGuiSampleApp: React.FC<IProps> = ({ componentMap }) => {
  const { userData: user } = useAuthContext();
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const getSampleAppUrl = async () => {
      setUrl(await createSampleAppClientUrl(user, componentMap));
    };
    getSampleAppUrl();
  }, [user, componentMap]);

  return url ? (
    <StyledSampleApp target="_blank" rel="noreferrer" href={url}>
      Run a Sample App
    </StyledSampleApp>
  ) : (
    <></>
  );
};
