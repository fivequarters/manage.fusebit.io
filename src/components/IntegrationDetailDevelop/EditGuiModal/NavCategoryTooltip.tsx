import React from 'react';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import question from '@assets/question.svg';
import { Box } from '@material-ui/core';
import * as SC from '@components/globalStyle';
import { trackEventUnmemoized } from '@utils/analytics';

const StyledIcon = styled.img`
  height: 16px;
  width: 16px;
  margin-left: 5px;
  cursor: pointer;
`;

const StyledText = styled.div<{ fontWeight?: string }>`
  ${SC.editorNavTextStyles}
  font-size: 12px;
  line-height: 16px;
  font-weight: ${(props) => props.fontWeight && props.fontWeight};
`;

const CustomTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#B5D1FF',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: '12px 16px',
    boxShadow: '0px 12px 32px rgba(52, 72, 123, 0.32)',
    borderRadius: '4px',
    width: '220px',
  },
}))(Tooltip);

interface Props {
  title: string;
  description: string;
}

let timeout: NodeJS.Timeout;
let timerRunning = false;

const NavCategoryTooltip: React.FC<Props> = ({ title, description }) => {
  const trackView = () => {
    timeout = setTimeout(() => {
      trackEventUnmemoized('Tooltips Viewed', 'Web Editor', {
        ToolTipsItem: title,
      });
    }, 1000);
  };

  const onMouseEnter = () => {
    if (!timerRunning) {
      timerRunning = true;
      trackView();
    }
  };

  const onMouseLeave = () => {
    clearTimeout(timeout);
    timerRunning = false;
  };

  return (
    <CustomTooltip
      title={
        <Box display="flex" flexDirection="column">
          <StyledText fontWeight="700">{title}</StyledText>
          <StyledText>{description}</StyledText>
        </Box>
      }
      placement="right"
    >
      <StyledIcon src={question} alt="info" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />
    </CustomTooltip>
  );
};

export default NavCategoryTooltip;
