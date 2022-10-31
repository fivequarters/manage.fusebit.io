import { Connector } from '@interfaces/connector';
import { Integration } from '@interfaces/integration';
import ConnectorLink from './ConnectorLink';
import Link from './Link';

interface Props {
  links: (
    | 'connectingFusebit'
    | 'gettingStarted'
    | 'programmingModel'
    | 'systemArchitecture'
    | 'marketplaceComponent'
    | 'developingLocally'
    | 'configureConnector'
    | 'implementingCustomConnectors'
  )[];
  integration?: Integration;
  connectors?: Connector[];
}

const FooterLinks = ({ links, integration, connectors }: Props) => {
  return (
    <>
      {links.includes('connectingFusebit') && (
        <Link
          integration={integration}
          text="Connecting Fusebit with Your Application"
          href="https://developer.fusebit.io/docs/connecting-fusebit-with-your-application"
        />
      )}
      {links.includes('gettingStarted') && (
        <Link
          integration={integration}
          text="Getting Started"
          href="https://developer.fusebit.io/docs/getting-started"
        />
      )}
      {links.includes('programmingModel') && (
        <Link
          integration={integration}
          text="Integration Programming Model"
          href="https://developer.fusebit.io/docs/integration-programming-model"
        />
      )}
      {links.includes('systemArchitecture') && (
        <Link
          integration={integration}
          text="System Architecture"
          href="https://developer.fusebit.io/docs/fusebit-system-architecture"
        />
      )}
      {links.includes('marketplaceComponent') && (
        <Link
          integration={integration}
          text="Marketplace Component"
          href="https://developer.fusebit.io/docs/marketplace-component"
        />
      )}
      {links.includes('developingLocally') && (
        <Link
          integration={integration}
          text="Developing Locally"
          href="https://developer.fusebit.io/docs/developing-locally"
        />
      )}
      {links.includes('configureConnector') &&
        connectors?.map((connector) => (
          <ConnectorLink key={connector.id} integration={integration} connector={connector} />
        ))}
      {links.includes('implementingCustomConnectors') && (
        <Link
          integration={integration}
          text="Implementing Custom Connectors"
          href="https://developer.fusebit.io/docs/connector-implementation-guide"
        />
      )}
    </>
  );
};

export default FooterLinks;
