import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import useMeasure from 'react-use-measure';
import styled from 'styled-components';
import arrow from '@assets/arrow-up-editor.svg';

const Frame = styled.div`
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  margin-left: 8px;
  color: #24292e;
  fill: #24292e;
  margin-bottom: 16px;

  .nested > .frame {
    margin-bottom: 0;
  }
`;

const TitleWrapper = animated(styled(Box)<{ enableCursorPointer: boolean }>`
  cursor: ${(props) => props.enableCursorPointer && 'pointer'};
`);

const Title = styled.div`
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--black);
  cursor: pointer;
`;

const StyledBorder = styled.div`
  position: absolute;
  left: 7px;
  top: 0;
  width: 1px;
  height: 100%;
  background: #dddddd;
`;

const Content = animated(styled.div`
  position: relative;
  will-change: transform, opacity, height;
  overflow: hidden;
  padding-left: 16px;
  margin-bottom: 6px;
`);

const DropdownIcon = styled.img<{ active: boolean }>`
  transform: ${(props) => (props.active ? 'rotate(0)' : 'rotate(180deg)')};
  margin-right: 10px;
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
>(({ children, name, enableDropdownArrow, onClick, style, defaultOpen = false }) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const [ref, { height: viewHeight }] = useMeasure();
  const { height, opacity, y, marginBottom } = useSpring({
    from: { height: 0, opacity: 0, y: 0, marginBottom: '0px' },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      marginBottom: isOpen ? '12px' : '0px',
      y: isOpen ? 0 : 20,
    },
  });

  return (
    <Frame onClick={() => onClick?.(isOpen)} className="frame">
      <TitleWrapper
        display="flex"
        alignItems="center"
        mb="12px"
        enableCursorPointer={!!enableDropdownArrow}
        onClick={() => setOpen(!isOpen)}
        style={{ marginBottom }}
      >
        <DropdownIcon src={arrow} alt="dropdown arrow" active={isOpen} />
        <Title style={style}>{name}</Title>
      </TitleWrapper>
      <Content
        style={{
          opacity,
          height,
        }}
      >
        <StyledBorder />
        <animated.div ref={ref} style={{ y }} className="nested">
          {children}
        </animated.div>
      </Content>
    </Frame>
  );
});

export default Tree;
