import React from "react";
import * as SC from "./styles";
import { Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { useAccountConnectorIdentityGetAll } from "../../../hooks/api/v2/account/connector/identity/useGetAll";
import { useAccountConnectorIdentityDeleteOne } from "../../../hooks/api/v2/account/connector/identity/useDeleteOne";
import { useContext } from "../../../hooks/useContext";
import { Identity } from "../../../interfaces/identities";
import { useLoader } from "../../../hooks/useLoader";
import { useError } from "../../../hooks/useError";
import { Operation } from "../../../interfaces/operation";

const Identities: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { userData } = useContext();
    const { data: identitiesData, refetch: reloadInstalls } = useAccountConnectorIdentityGetAll<Identity>({enabled: userData.token, id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
    const deleteInstance = useAccountConnectorIdentityDeleteOne<Operation>();
    const { waitForOperations, createLoader, removeLoader } = useLoader();
    const {createError} = useError();

    React.useEffect(() => {
        if (!identitiesData) {
            reloadInstalls();
        }
    }, [identitiesData, reloadInstalls]);

    const handleDelete = async () => {
        try {
            createLoader();
            const data = JSON.parse(JSON.stringify(identitiesData?.data)) as Identity;  
            let operationIds: string[] = [];      
            for (let i = 0; i < data.items?.length; i++) {
                const response = await deleteInstance.mutateAsync({data: data.items[i], id: id, accountId: userData.accountId, subscriptionId: userData.subscriptionId });
                operationIds.push(response.data.operationId);
            }
            await waitForOperations(operationIds);
            reloadInstalls();
        } catch (e) {
            createError(e.message);
        } finally {
            removeLoader();
        }
    }

    return (
        <SC.Wrapper>
            <SC.Header>Total Identities: {identitiesData ? identitiesData?.data.total : "Loading..."}</SC.Header>
            <Button onClick={handleDelete} style={{width: "200px"}} variant="contained" color="primary" size="large">Delete all Identities</Button>
        </SC.Wrapper>
    )
}

export default Identities;