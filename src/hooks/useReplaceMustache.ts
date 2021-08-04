import React from "react";
import { useContext } from './useContext';
import Mustache from "mustache";
import { Data } from "../interfaces/feedPicker";
import { Entity } from "../interfaces/feed";

export const  useReplaceMustache = () => {
    const { userData } = useContext();

    const replaceMustache = React.useCallback(async (data: Data, entity: Entity) => {
        const customTags: any = [ '<%', '%>' ];
        const keys = Object.keys(data);
        let connectorId;
        let integrationId;
        keys.forEach((key: any) => {
            if (key.match("Connector")) {
                connectorId = data[key].replace(/\s/g, '');
            } else if (key.match("Integration")) {
                integrationId = data[key].replace(/\s/g, '');
            }
        });
        const view = {
            this: {
                connectorId,
                integrationId
            },
            global: {
                userId: {
                    id: userData.userId,
                },
                accountId: {
                    id: userData.accountId,
                },
                subscriptionId: {
                    id: userData.subscriptionId,
                }
            }
        }
        const newEntity = Mustache.render(JSON.stringify(entity), view, {}, customTags);
        const parsedEntity: Entity = JSON.parse(newEntity);
        return parsedEntity;
    }, [userData]);

    return {
        replaceMustache
    };
};