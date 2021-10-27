import React, { useState } from 'react';
import { Box, Drawer, MobileStepper, Button } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import FeedPickerMobileChoose from './FeedPickerMobileChoose';
import FeedPickerMobileCreate from './FeedPickerMobileCreate';
import FeedPickerMobileFilter from './FeedPickerMobileFilter';

const steps = [
  <FeedPickerMobileFilter key="1" />,
  <FeedPickerMobileChoose key="2" />,
  <FeedPickerMobileCreate key="3" />,
];

interface Props {
  title?: string;
}

const FeedPickerMobile: React.FC<Props> = ({ title = 'Integration' }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <Drawer anchor="bottom" open>
      <Box p="24px">
        <Box display="flex" justifyContent="space-between">
          <Button size="small" onClick={handleBack} disabled={step === 0}>
            <KeyboardArrowLeft />
            Back
          </Button>
          <MobileStepper
            steps={steps.length}
            position="static"
            variant="text"
            activeStep={step}
            nextButton={null}
            backButton={null}
          />
          <Button size="small" onClick={handleNext} disabled={step === steps.length - 1}>
            Next
            <KeyboardArrowRight />
          </Button>
        </Box>
        <Box component="h4" fontWeight={600} fontSize={20} color="#333333" mt="16px" mb="48px" textAlign="center">
          New {title}
        </Box>
        <Box height="440px" overflow="auto">
          {steps[step]}
        </Box>
        <Box m="0 auto" maxWidth="200px">
          <Button color="primary" size="large" variant="contained" fullWidth disabled={step !== steps.length - 1}>
            Create
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FeedPickerMobile;
