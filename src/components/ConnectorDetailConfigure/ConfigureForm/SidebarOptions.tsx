import React, { useCallback, useEffect } from 'react';
import { Box } from '@material-ui/core';
import styled from 'styled-components';
import { ConnectorConfig } from '@interfaces/connector';

const StyledWrapper = styled(Box)`
  @media only screen and (max-width: 880px) {
    display: none;
  }
`;

const StyledSidebarOption = styled.button<{ selected?: boolean }>`
  font-family: 'Poppins';
  padding: 12px 16px;
  font-size: 14px;
  line-height: 20px;
  font-weight: ${(props) => (props.selected ? 700 : 400)};
  border-radius: 4px;
  color: var(--black);
  margin-bottom: 16px;
  width: 100%;
  outline: rgba(255, 255, 255, 0);
  border: none;
  background: ${(props) => (props.selected ? 'var(--secondary-color)' : 'none')};
  text-align: left;
  transition: all 0.25s linear, font-weight 0.1s linear;

  &:hover {
    background: var(--secondary-color);
  }
`;

interface Props {
  config: ConnectorConfig;
}

const SidebarOptions = ({ config }: Props) => {
  const [sidebarOptions, setSidebarOptions] = React.useState<string[]>([]);
  const [selectedSidebarOption, setSelectedSidebarOption] = React.useState('');

  const getSpanElements = useCallback(() => {
    const formWrapper = document.getElementById('form-wrapper');
    const spanElements = formWrapper?.getElementsByTagName('span');
    if (spanElements) {
      return Array.from(spanElements).filter((span) => sidebarOptions.includes(span.innerHTML));
    }

    return [];
  }, [sidebarOptions]);

  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.top >= 0 &&
      rect.top <= screenHeight / 1.6 &&
      rect.left >= 0 &&
      rect.bottom <= screenHeight &&
      rect.right <= screenWidth
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      getSpanElements().forEach((span) => {
        if (isInViewport(span)) {
          setSelectedSidebarOption(span.innerHTML);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [getSpanElements, selectedSidebarOption]);

  useEffect(() => {
    if (config) {
      const labels = config?.uischema.elements
        .filter((element) => element.label)
        .map((element) => element.label) as string[];
      labels.shift();
      setSidebarOptions(labels);
      setSelectedSidebarOption(labels[0]);
    }
  }, [config]);

  const handleSidebarOptionClick = (option: string) => {
    const scrollToElement = getSpanElements().find((span) => span.innerHTML === option);
    scrollToElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <StyledWrapper
      display="flex"
      flexDirection="column"
      padding="24px"
      marginTop="auto"
      marginRight="48px"
      height="calc(100% - 86px)"
      minWidth="272px"
      maxWidth="272px"
      borderRadius="16px"
      style={{ boxShadow: '0px 20px 48px rgba(52, 72, 123, 0.1)' }}
    >
      {sidebarOptions.map((option) => (
        <StyledSidebarOption
          onClick={(e) => {
            e.preventDefault();
            handleSidebarOptionClick(option);
          }}
          selected={selectedSidebarOption === option}
          key={option}
        >
          {option}
        </StyledSidebarOption>
      ))}
    </StyledWrapper>
  );
};

export default SidebarOptions;
