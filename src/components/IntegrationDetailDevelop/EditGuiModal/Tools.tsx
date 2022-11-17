import React from 'react';
import console from '@assets/console.svg';
import { trackEventUnmemoized } from '@utils/analytics';
import play from '@assets/play-black.svg';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

interface Props {
  sampleAppUrl: string | undefined;
}

const Tools: React.FC<Props> = ({ sampleAppUrl }) => {
  const handleEditLocallyClick = () => {
    trackEventUnmemoized('Tools Menu Item Clicked', 'Web Editor', {
      clickedOn: 'Run Locally',
    });

    window.open('https://developer.fusebit.io/docs/developing-locally', '_blank', 'noreferrer');
  };

  const handleSampleAppClick = () => {
    trackEventUnmemoized('Tools Menu Item Clicked', 'Web Editor', {
      clickedOn: 'Sample App',
    });

    window.open(sampleAppUrl, '_blank', 'noreferrer');
  };

  return (
    <CustomNavBase
      id="tools"
      title="Tools"
      tooltipDescription="Tools to help you deploy your Fusebit Integration into your own app, much faster."
    >
      <CustomNavItem id="editLocally" icon={console} name="Edit Locally (CLI)" onClick={handleEditLocallyClick} />
      {sampleAppUrl && <CustomNavItem id="sampleApp" icon={play} name="Sample App" onClick={handleSampleAppClick} />}
    </CustomNavBase>
  );
};

export default Tools;
