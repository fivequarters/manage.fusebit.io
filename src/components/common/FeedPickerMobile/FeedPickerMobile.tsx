import React, { useEffect, useState } from 'react';
import { Box, Drawer, MobileStepper, Button } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import _startCase from 'lodash.startcase';
import FeedPickerMobileChoose from './FeedPickerMobileChoose';
import FeedPickerMobileCreate from './FeedPickerMobileCreate';
import useFeed from '../../../hooks/useFeed';
import { Feed } from '../../../interfaces/feed';
import ItemList from '../ItemList/ItemList';
import { urlOrSvgToImage } from '../../../utils/utils';
import { Data } from '../../../interfaces/feedPicker';
import { DefaultFilters } from '../../../hooks/useFilterFeed';
import Loader from '../Loader';

interface Props {
  title?: string;
  type: 'integration' | 'connector';
  onSubmit: (feed: Feed, data: Data) => void;
  onClose: () => void;
  open: boolean;
}

const FeedPickerMobile: React.FC<Props> = ({ title = 'Integration', type, onSubmit, open, onClose }) => {
  const [step, setStep] = useState(0);
  const {
    activeFilter,
    allTags,
    filteredFeed,
    data,
    handleSubmit,
    handleFilterChange,
    debouncedSetSearchFilter,
    activeTemplate,
    handleTemplateChange,
    handleJsonFormsChange,
    validationMode,
    setRawActiveTemplate,
    setActiveTemplate,
    setActiveFilter,
    loading,
  } = useFeed({
    feedTypeName: title,
    isIntegration: type === 'integration',
    onSubmit,
    onClose,
  });

  useEffect(() => {
    return () => {
      if (open) {
        setStep(0);
        setRawActiveTemplate(undefined);
        setActiveTemplate(undefined);
        setActiveFilter(DefaultFilters.ALL);
      }
    };
  }, [open, setActiveFilter, setActiveTemplate, setRawActiveTemplate, setStep]);

  const validateNext = () => {
    if (loading) {
      return false;
    }
    if (step === 0) {
      return !!activeFilter;
    }

    if (step === 1) {
      return !!activeTemplate;
    }

    return true;
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      setRawActiveTemplate(undefined);
      setActiveTemplate(undefined);
    }
    setStep(step - 1);
  };

  const filters = [DefaultFilters.ALL, ...allTags].map((tag) => ({
    text: _startCase(tag),
    id: tag,
    onClick: () => {
      handleFilterChange(tag);
    },
  }));

  const entities = filteredFeed.map((entity) => ({
    text: entity.name,
    icon: <img src={urlOrSvgToImage(entity.smallIcon)} alt="connector" height={18} width={18} />,
    id: entity.id,
    onClick: () => {
      handleTemplateChange(entity);
    },
  }));

  const steps = [
    <ItemList key="1" items={filters} activeItem={activeFilter} />,
    <FeedPickerMobileChoose
      onChange={(e) => debouncedSetSearchFilter(e.target.value)}
      key="2"
      items={entities}
      activeItem={activeTemplate?.id}
    />,
    <FeedPickerMobileCreate
      key="3"
      data={data}
      onChange={handleJsonFormsChange}
      validationMode={validationMode}
      entity={activeTemplate}
    />,
  ];

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
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
          <Button size="small" onClick={handleNext} disabled={!validateNext()}>
            Next
            <KeyboardArrowRight />
          </Button>
        </Box>
        <Box component="h4" fontWeight={600} fontSize={20} color="#333333" mt="16px" mb="48px" textAlign="center">
          New {title}
        </Box>
        <Box height="440px" overflow="auto">
          {loading ? <Loader /> : steps[step]}
        </Box>
        <Box m="0 auto" maxWidth="200px">
          <Button
            color="primary"
            size="large"
            variant="contained"
            fullWidth
            disabled={step !== steps.length - 1}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FeedPickerMobile;
