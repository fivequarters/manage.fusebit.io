import React from "react";
import { useContext } from './useContext';
import Mustache from "mustache";
import { Data } from "../interfaces/feedPicker";
import { Feed } from "../interfaces/feed";

export const  useReplaceMustache = () => {
    const { userData } = useContext();

    const replaceMustache = React.useCallback(async (data: Data, feed: Feed) => {
        const customTags: any = [ '<%', '%>' ];
        const keys = Object.keys(data);
        let connectorId: string;
        let integrationId: string;
        keys.forEach((key: any) => {
            if (key.match("Connector")) {
                connectorId = data[key].replace(/\s/g, '');
            } else if (key.match("Integration")) {
                integrationId = data[key].replace(/\s/g, '');
            }
        });
        const randomIntegrationId = Math.floor(Math.random() * (999999 - 111111) + 111111);
        const randomConnectorId = Math.floor(Math.random() * (999999 - 111111) + 111111);
        const view = {
            this: {
                integrationId: function () {
                    if  (integrationId) {
                        return integrationId
                    } else {
                        return randomIntegrationId;
                    }
                },
                connectorId: function () {
                    if  (connectorId) {
                        return connectorId
                    } else {
                        return randomConnectorId;
                    }
                }
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
        const newfeed = Mustache.render(JSON.stringify(feed), view, {}, customTags);
        const parsedfeed: Feed = JSON.parse(newfeed);
        return parsedfeed;
    }, [userData]);

    return {
        replaceMustache
    };
};