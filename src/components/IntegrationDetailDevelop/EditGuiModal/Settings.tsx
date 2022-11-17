import React from 'react';
import settingsIconBlack from '@assets/settingsBlack.svg';
import CustomNavBase from './CustomNavBase';
import CustomNavItem from './CustomNavItem';

interface Props {
  activeFile: string;
  setActiveFile: (file: string) => void;
}

export const CONFIGURATION_FILE_ID = 'Configuration';

const Settings = ({ setActiveFile, activeFile }: Props) => {
  return (
    <CustomNavBase
      id="settings"
      title="Settings"
      tooltipDescription="Configuration logic, such as CRON scheduling, for your Integration."
    >
      <CustomNavItem
        id={CONFIGURATION_FILE_ID}
        icon={settingsIconBlack}
        name="Configuration"
        active={activeFile === CONFIGURATION_FILE_ID}
        onClick={() => {
          window.editor.selectSettingsConfiguration();
          setActiveFile(CONFIGURATION_FILE_ID);
        }}
      />
    </CustomNavBase>
  );
};

export default Settings;
