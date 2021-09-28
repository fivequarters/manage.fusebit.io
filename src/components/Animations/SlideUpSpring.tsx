import React from 'react';
import { useSpring, animated } from 'react-spring';

interface SlideUpProps {
  children?: React.ReactElement;
  in: boolean;
  mounted: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}

const SlideUpSpring = React.forwardRef<HTMLDivElement, SlideUpProps>((props, ref) => {
  const { in: open, mounted, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    transform: mounted ? 'translateY(0vh)' : 'translateY(100vh)',
    config: { mass: 3, tension: 500, friction: 70 },

    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div
      ref={ref}
      style={{
        transform: style.transform.to((transform) => transform),
      }}
      {...other}
    >
      {children}
    </animated.div>
  );
});

export default SlideUpSpring;
