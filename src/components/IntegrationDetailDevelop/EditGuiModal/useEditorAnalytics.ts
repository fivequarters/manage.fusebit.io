import { trackEventUnmemoized } from '@utils/analytics';
import { useEffect } from 'react';

type Props = {
  isEditorRunning: boolean;
};

const useEditorAnalytics = ({ isEditorRunning }: Props) => {
  useEffect(() => {
    if (isEditorRunning) {
      const fileItems = document.querySelectorAll('.fusebit-nav-file');
      fileItems?.forEach((item) => {
        if (item.getAttribute('data-event-click') !== 'true') {
          const fileName = item.querySelector('span')?.innerText;
          item.addEventListener('click', () => {
            trackEventUnmemoized('Code Menu Item Clicked', 'Web Editor', {
              clickedOn: fileName,
            });
          });
          item.setAttribute('data-event-click', 'true');
        }
      });

      const configurationItem = document.querySelector('[data-type=configurationSettings]');
      if (configurationItem?.getAttribute('data-event-click') !== 'true') {
        configurationItem?.addEventListener('click', () => {
          trackEventUnmemoized('Settings Menu Item Clicked', 'Web Editor', {
            clickedOn: 'Settings',
          });
        });
        configurationItem?.setAttribute('data-event-click', 'true');
      }
    }
  }, [isEditorRunning]);
};

export default useEditorAnalytics;
