import React from 'react';
import styled from 'styled-components';
import { Box, Button } from '@material-ui/core';
import { Props } from '@interfaces/feedPicker';
import Loader from '@components/common/Loader';
import { useTrackPage } from '@hooks/useTrackPage';
import { urlOrSvgToImage } from '@utils/utils';
import BaseJsonForm from '@components/common/BaseJsonForm';
import useFeedPicker from '@hooks/useFeedPicker';
import ForkItemDescription, { StyledConnectorDescription } from './ForkItemDescription';

const StyledCard = styled.div`
  padding: 24px;
  padding-bottom: 0;
  width: 500px;
  height: 590px;

  @media only screen and (max-width: 1145px) {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  @media only screen and (max-width: 1100px) {
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
    border-radius: 0;
    padding: 32px;
  }
`;

const StyledTitle = styled.h2`
  font-size: 24px;
  line-height: 26px;
  color: var(--black);
  font-weight: 600;
  margin: 0;
  margin-bottom: 49px;
`;

const StyledIntegrationInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  width: 100%;
  flex: 1;
  align-items: center;

  @media only screen and (max-width: 1100px) {
    padding-left: 0;
  }
`;

const StyledIntegrationImage = styled.img`
  height: 28px;
  width: 28px;
  object-fit: contain;
  margin-right: 16px;
`;

const StyledIntegrationTitle = styled.h3`
  font-size: 20px;
  line-height: 26px;
  color: var(--black);
  margin: 0;
`;

const StyledIntegrationTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 12px;
  flex: 1;
  align-self: flex-start;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 316px;
  margin-top: 15px;

  @media only screen and (max-width: 1100px) {
    width: 100%;
  }
`;

const StyledGeneralInfoWrapper = styled.div`
  position: relative;
  height: 350px;
  overflow-y: auto;
  align-items: center;
`;

const FeedPicker = React.forwardRef<HTMLDivElement, Props>(
  ({ open, onClose, onSubmit, hasConnectorDependency }, ref) => {
    const {
      rawActiveTemplate,
      handleSubmit,
      activeTemplate,
      loading,
      feedTypeName,
      isMobile,
      data,
      handleJsonFormsChange,
      validationMode,
    } = useFeedPicker({
      open,
      onSubmit,
      onClose,
      isFork: true,
    });

    const pageName = 'Fork New Modal';
    useTrackPage(pageName, 'Fork');

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    const needsConnector = hasConnectorDependency && rawActiveTemplate && !hasConnectorDependency(rawActiveTemplate);

    return (
      <StyledCard onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} ref={ref} tabIndex={-1}>
        <StyledTitle>{`New ${feedTypeName}`}</StyledTitle>
        <Box display="flex" flexDirection={isMobile && 'column'}>
          <StyledIntegrationInfo>
            {loading || !activeTemplate ? (
              <Loader />
            ) : (
              <>
                <StyledIntegrationTitleWrapper>
                  {activeTemplate.smallIcon && (
                    <StyledIntegrationImage
                      src={urlOrSvgToImage(activeTemplate.smallIcon)}
                      alt={activeTemplate.name || 'slack'}
                      height="28"
                      width="28"
                    />
                  )}
                  <StyledIntegrationTitle>{activeTemplate.name}</StyledIntegrationTitle>
                </StyledIntegrationTitleWrapper>
                <StyledGeneralInfoWrapper>
                  <ForkItemDescription description={activeTemplate.description || ''} templateId={activeTemplate.id} />
                  {!activeTemplate.outOfPlan && (
                    <>
                      {needsConnector && (
                        <StyledConnectorDescription linkTarget="_blank">{`Using this snippet requires adding the ${activeTemplate.name} connector to your integration.`}</StyledConnectorDescription>
                      )}
                      <StyledFormWrapper>
                        <BaseJsonForm
                          schema={activeTemplate.configuration.schema}
                          uischema={activeTemplate.configuration.uischema}
                          data={data}
                          onChange={handleJsonFormsChange}
                          validationMode={validationMode}
                        />
                      </StyledFormWrapper>
                    </>
                  )}
                </StyledGeneralInfoWrapper>
                <Button
                  onClick={handleSubmit}
                  style={{ width: '200px', margin: isMobile ? 'auto' : 'auto 0 0 auto' }}
                  fullWidth={false}
                  size="large"
                  color="primary"
                  variant="contained"
                >
                  {activeTemplate.outOfPlan && 'Talk to Sales'}
                  {!activeTemplate.outOfPlan && 'Create'}
                </Button>
              </>
            )}
          </StyledIntegrationInfo>
        </Box>
      </StyledCard>
    );
  }
);

export default FeedPicker;
