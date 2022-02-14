import { useError } from '@hooks/useError';
import { useGetIntegrationFromCache } from '@hooks/useGetIntegrationFromCache';
import { useLoader } from '@hooks/useLoader';
import { INTEGRATION_PROCESSING_SUFFIX } from '@utils/constants';
import { useEffect, useState } from 'react';

interface Props {
  onProcessingStarted?: () => void;
  onProcessingCompleted?: () => void;
  enabled?: boolean;
}

const useProcessing = ({ onProcessingStarted, onProcessingCompleted, enabled = true }: Props) => {
  const [processing, setProcessing] = useState(false);
  const integrationData = useGetIntegrationFromCache();
  const { waitForEntityStateChange } = useLoader();
  const { createError } = useError();
  const processingKey = `${integrationData?.data.id}${INTEGRATION_PROCESSING_SUFFIX}`;

  useEffect(() => {
    if (enabled && !processing) {
      if (integrationData?.data.id) {
        const pendingProcessing = localStorage.getItem(processingKey);
        if (pendingProcessing) {
          setProcessing(true);
          onProcessingStarted?.();
          const dataToProcess = [{ entityType: 'integration', entityId: integrationData.data.id }];
          integrationData.data.data.components.forEach((component) => {
            const newComponentToProcess = {
              entityType: component.entityType,
              entityId: component.entityId,
            };
            dataToProcess.push(newComponentToProcess);
          });
          Promise.all(dataToProcess.map(({ entityType, entityId }) => waitForEntityStateChange(entityType, [entityId])))
            .then(() => {
              localStorage.removeItem(processingKey);
              setProcessing(false);
              onProcessingCompleted?.();
            })
            .catch((e) => {
              createError(e);
            });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrationData]);

  return {
    processing,
  };
};

export default useProcessing;
