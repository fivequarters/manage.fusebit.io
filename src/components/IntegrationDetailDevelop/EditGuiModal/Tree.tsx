import { Box } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import styled from 'styled-components';
import arrow from '@assets/arrow-up-editor.svg';

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const Frame = styled.div`
  position: relative;
  padding: 4px 0px 0px 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  vertical-align: middle;
  margin-left: 8px;
  color: #24292e;
  fill: #24292e;
`;

const TitleWrapper = styled(Box)<{ enableCursorPointer: boolean }>`
  cursor: ${(props) => props.enableCursorPointer && 'pointer'};
`;

const Title = styled.div`
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--black);
  cursor: pointer;
`;

const Content = animated(styled.div`
  will-change: transform, opacity, height;
  overflow: hidden;
  margin-top: 16px;
`);

const StyledIcon = styled.img`
  margin-right: 10px;
`;

const DropdownIcon = styled.img<{ active: boolean }>`
  transform: ${(props) => (props.active ? 'rotate(0)' : 'rotate(180deg)')};
  margin-left: auto;
  transition: all 0.25s linear;
`;

const Tree = React.memo<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    name: string | JSX.Element;
    icon?: string;
    enableDropdownArrow?: boolean;
    onClick?: (isOpen: boolean) => void;
  }
>(({ children, name, icon, enableDropdownArrow, onClick, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const previous = usePrevious(isOpen);
  const [ref, { height: viewHeight }] = useMeasure();
  const { height, opacity, y } = useSpring({
    from: { height: 0, opacity: 0, y: 0 },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      y: isOpen ? 0 : 20,
    },
  });

  return (
    <Frame onClick={() => onClick?.(isOpen)}>
      <TitleWrapper
        display="flex"
        alignItems="center"
        enableCursorPointer={!!enableDropdownArrow}
        onClick={() => setOpen(!isOpen)}
      >
        {icon && <StyledIcon src={icon} alt="icon" />}
        <Title style={style}>{name}</Title>
        {enableDropdownArrow && <DropdownIcon src={arrow} alt="dropdown arrow" active={isOpen} />}
      </TitleWrapper>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? 'auto' : height,
        }}
      >
        <animated.div ref={ref} style={{ y }}>
          {children}
        </animated.div>
      </Content>
    </Frame>
  );
});

export default Tree;
