import { useMutation } from 'react-query';
import { STATIC_TENANT_ID } from '../../../../../../components/IntegrationDetail/Develop/Develop/EditGui/useRunner';
import { Params } from '../../../../../../interfaces/api';
import { CreateSessionPayload } from '../../../../../../interfaces/createSessionPayload';
import { useAxios } from '../../../../../useAxios';
import { useContext } from '../../../../../useContext';
import { useLoader } from '../../../../../useLoader';
import { useAccountIntegrationTestIntegration } from '../useTestOne';

interface Props {
    skipRun: boolean
}

export const useAccountIntegrationCommitSession = ({ skipRun } = {} as Props) => {
    const { axios } = useAxios();
    const { userData } = useContext();
    const { waitForEntityStateChange, createLoader, removeLoader } = useLoader();
    const { mutateAsync: testIntegration } = useAccountIntegrationTestIntegration();

    return useMutation(
        (params: Params) => {
            const { id, sessionId } = params;
            return axios<any>(
                `/v2/account/${userData.accountId}/subscription/${userData.subscriptionId}/integration/${id}/session/${sessionId}/commit`,
                'post'
            );
        },
        {
            onSuccess: async ({ data }, { id }) => {
                createLoader()

                console.log('createLoader', data)

                await waitForEntityStateChange('operation', [data.operationId]);

                if (!skipRun) {
                    await testIntegration({ id, tenantId: STATIC_TENANT_ID });
                }
                removeLoader()

            },
        }
    );
};
