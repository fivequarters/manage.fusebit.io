import { useState, useEffect, BaseSyntheticEvent } from 'react';

interface Props {
  onPressStart: () => void;
  onPressEnd: () => void;
  triggerCondition?: (e: BaseSyntheticEvent) => boolean;
  disableOnMouseLeave?: boolean;
}

const useLongPress = ({ onPressStart, onPressEnd, triggerCondition, disableOnMouseLeave }: Props) => {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    if (startLongPress) {
      onPressStart();
    } else {
      onPressEnd();
    }
  }, [startLongPress, onPressStart, onPressEnd]);

  return {
    onMouseDown: (e: BaseSyntheticEvent) => {
      if (triggerCondition) {
        const isTriggerConditionMet = triggerCondition(e);
        setStartLongPress(isTriggerConditionMet);
      } else {
        setStartLongPress(true);
      }
    },
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => {
      if (!disableOnMouseLeave) {
        setStartLongPress(false);
      }
    },
    onTouchStart: (e: BaseSyntheticEvent) => {
      if (triggerCondition) {
        const isTriggerConditionMet = triggerCondition(e);
        setStartLongPress(isTriggerConditionMet);
      } else {
        setStartLongPress(true);
      }
    },
    onTouchEnd: () => setStartLongPress(false),
  };
};

export default useLongPress;
