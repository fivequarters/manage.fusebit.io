import React, { useState } from 'react';
import console from '@assets/console.svg';
import { trackEventMemoized } from '@utils/analytics';
import { Integration } from '@interfaces/integration';
import play from '@assets/play-black.svg';
import NoSampleAppModal from '../NoSampleAppModal';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

interface Props {
  integrationData: Integration | undefined;
  sampleAppUrl: string | undefined;
}

const Tools: React.FC<Props> = ({ integrationData, sampleAppUrl }) => {
  const [noSampleAppOpen, setNoSampleAppOpen] = useState(false);

  const handleEditLocallyClick = () => {
    trackEventMemoized('Docs Developing Locally Link Clicked', 'Web Editor', {
      Integration: integrationData?.tags['fusebit.feedId'],
    });

    window.open('https://developer.fusebit.io/docs/developing-locally', '_blank', 'noreferrer');
  };

  const handleSampleAppClick = () => {
    if (sampleAppUrl) {
      trackEventMemoized('Sample App Clicked', 'Web Editor', {
        Integration: integrationData?.tags['fusebit.feedId'],
      });
      window.open(sampleAppUrl, '_blank', 'noreferrer');
    } else {
      setNoSampleAppOpen(true);
    }
  };

  return (
    <CustomNavBase
      title="Tools"
      tooltipDescription="Tools to help you deploy your Fusebit Integration into your own app, much faster."
    >
      <CustomNavItem icon={console} name="Edit Locally (CLI)" onClick={handleEditLocallyClick} />
      <CustomNavItem icon={play} name="Sample App" onClick={handleSampleAppClick} />
      <NoSampleAppModal open={noSampleAppOpen} onClose={() => setNoSampleAppOpen(false)} />
    </CustomNavBase>
  );
};

export default Tools;
