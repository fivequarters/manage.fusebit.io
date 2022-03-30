import React from 'react';
import console from '@assets/console.svg';
import play from '@assets/play-black.svg';
import { trackEventMemoized } from '@utils/analytics';
import { Integration } from '@interfaces/integration';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

interface Props {
  integrationData: Integration | undefined;
}

const Tools: React.FC<Props> = ({ integrationData }) => {
  const handleEditLocallyClick = () => {
    trackEventMemoized('Docs Developing Locally Link Clicked', 'Web Editor', {
      Integration: integrationData?.tags['fusebit.feedId'],
    });

    window.open('https://developer.fusebit.io/docs/developing-locally', '_blank');
  };

  return (
    <CustomNavBase title="Tools">
      <CustomNavItem icon={console} name="Edit Locally (CLI)" onClick={handleEditLocallyClick} />
      <CustomNavItem icon={play} name="Sample App" />
    </CustomNavBase>
  );
};

export default Tools;
