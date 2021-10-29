import React, { useEffect, useState } from 'react';
import { Box, Drawer, MobileStepper, Button, IconButton } from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import _startCase from 'lodash.startcase';
import cross from '@assets/cross.svg';
import useFeed from '../../../hooks/useFeed';
import { Feed } from '../../../interfaces/feed';
import ItemList from '../ItemList/ItemList';
import { urlOrSvgToImage } from '../../../utils/utils';
import { Data } from '../../../interfaces/feedPicker';
import { DefaultFilters } from '../../../hooks/useFilterFeed';
import Loader from '../Loader';
import FeedPickerMobileCreate from './FeedPickerMobileCreate';
import FeedPickerMobileChoose from './FeedPickerMobileChoose';

interface Props {
  onSubmit: (feed: Feed, data: Data) => void;
  onClose: () => void;
  open: boolean;
  isIntegration: boolean;
}

const FeedPickerMobile: React.FC<Props> = ({ isIntegration, onSubmit, open, onClose }) => {
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
    loading,
    setData,
    setActiveFilter,
    feedTypeName,
  } = useFeed({
    open,
    isIntegration,
    onSubmit,
    onClose,
  });

  useEffect(() => {
    return () => {
      if (open) {
        setStep(0);
        setData({});
        setRawActiveTemplate(undefined);
        setActiveTemplate(undefined);
        setActiveFilter(DefaultFilters.ALL);
      }
    };
  }, [open, setActiveFilter, setActiveTemplate, setData, setRawActiveTemplate]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1 || step === 2) {
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
      handleNext();
    },
  }));

  const entities = filteredFeed.map((entity) => ({
    text: entity.name,
    icon: <img src={urlOrSvgToImage(entity.smallIcon)} alt="connector" height={18} width={18} />,
    id: entity.id,
    onClick: () => {
      handleTemplateChange(entity);
      handleNext();
    },
  }));

  const steps = [
    <ItemList key="1" items={filters} activeItem={activeFilter} />,
    <FeedPickerMobileChoose
      onChange={(e) => debouncedSetSearchFilter(e.target.value)}
      key={activeTemplate?.id}
      items={entities}
      activeItem={activeTemplate?.id}
    />,
    <FeedPickerMobileCreate
      key={activeTemplate?.id}
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
          <Box width="66px" display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={onClose}>
              <img src={cross} alt="close" height={10} width={10} />
            </IconButton>
          </Box>
        </Box>
        <Box component="h4" fontWeight={600} fontSize={20} color="#333333" mt="16px" mb="48px" textAlign="center">
          New {feedTypeName}
        </Box>
        <Box height="440px" mb="15px" overflow="auto">
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
            {activeTemplate?.outOfPlan ? 'Enable' : 'Create'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FeedPickerMobile;
