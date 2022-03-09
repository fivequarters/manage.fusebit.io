import React from 'react';
import styled from 'styled-components';
import { Box, Button, TextField } from '@material-ui/core';
import { Props } from '@interfaces/feedPicker';
import search from '@assets/search.svg';
import Loader from '@components/common/Loader';
import { useTrackPage } from '@hooks/useTrackPage';
import { urlOrSvgToImage } from '@utils/utils';
import BaseJsonForm from '@components/common/BaseJsonForm';
import { DefaultFilters } from '@hooks/useFilterFeed';
import useFeedPicker from '@hooks/useFeedPicker';
import FeedItemDescription, { StyledConnectorDescription } from './FeedItemDescription';

const StyledCard = styled.div`
  padding: 24px;
  padding-bottom: 0;
  width: 1025px;

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

const StyledColumn = styled.div<{ border?: boolean; maxHeight?: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: ${(props) => props.maxHeight || '390px'};
  overflow-y: scroll;
  flex-shrink: 0;
  z-index: 0;

  @media only screen and (max-width: 1100px) {
    height: 100%;
  }
`;

const StyledColumnItem = styled.div<{ active: boolean; capitalize?: boolean; width?: number }>`
  display: flex;
  align-items: center;
  padding: 11px 16px;
  font-size: 16px;
  line-height: 18px;
  background-color: ${(props) => props.active && 'var(--secondary-color)'};
  font-weight: ${(props) => (props.active ? 600 : 400)};
  width: ${(props) => (props.width && `${254 * props.width + 64 * (props.width - 1)}px`) || `254px`};
  transition: background-color 0.2s linear;
  margin-bottom: 8px;
  border-radius: 4px;
  ${(props) => props.capitalize && 'text-transform: capitalize;'}

  &:hover {
    cursor: pointer;
    background-color: var(--secondary-color);
  }

  @media only screen and (max-width: 1100px) {
    width: 100%;
  }
`;

const StyledColumnItemImage = styled.img`
  height: 18px;
  width: 18px;
  object-fit: contain;
  margin-right: 16px;
`;

const StyledColumnBr = styled.div`
  width: 1px;
  height: 321px;
  background-color: #959595;
  opacity: 0.3;
  margin: 0 32px;

  @media only screen and (max-width: 1100px) {
    width: 100%;
    height: 1px;
    margin: 32px 0;
  }
`;

const StyledColumnSearchWrapper = styled.div`
  position: relative;
  margin-bottom: 32px;
  min-width: 254px;
`;

const StyledColumnSearchIcon = styled.img`
  position: absolute;
  right: 0;
  top: 40%;
  transform: translateY(-50%);
  height: 24px;
  width: 24px;
  object-fit: contain;
`;

const StyledConnectorInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledConnectorImage = styled.img`
  height: 28px;
  width: 28px;
  object-fit: contain;
  margin-right: 16px;
`;

const StyledConnectorTitle = styled.h3`
  font-size: 20px;
  line-height: 26px;
  color: var(--black);
  margin: 0;
`;

const StyledConnectorTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const StyledConnectorVersion = styled.div`
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  color: var(--black);
  margin-left: auto;
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
`;

const FeedPicker = React.forwardRef<HTMLDivElement, Props>(
  ({ open, onClose, onSubmit, isIntegration, isSnippet, hasConnectorDependency }, ref) => {
    const {
      rawActiveTemplate,
      getFullTemplateId,
      getFullTemplateName,
      activeFilter,
      allTags,
      filteredFeed,
      data,
      handleSubmit,
      handleFilterChange,
      debouncedSetSearchFilter,
      activeTemplate,
      activeSnippet,
      handleTemplateChange,
      handleJsonFormsChange,
      validationMode,
      loading,
      feedTypeName,
      isMobile,
      orderAlpha,
      key,
      setCampaingIntegrationRef,
      searchFocused,
      setSearchFocused,
    } = useFeedPicker({
      open,
      isIntegration,
      isSnippet,
      onSubmit,
      onClose,
    });

    let pageName = `${feedTypeName} New Modal`;
    let objectLocation = `${feedTypeName}s`;
    if (isSnippet) {
      pageName = `Web Editor Add Snippet Modal`;
      objectLocation = `Web Editor`;
    }
    useTrackPage(pageName, objectLocation);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !searchFocused) {
        handleSubmit();
      }
    };

    const needsConnector = hasConnectorDependency && rawActiveTemplate && !hasConnectorDependency(rawActiveTemplate);

    return (
      <StyledCard onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} ref={ref} tabIndex={-1}>
        <StyledTitle>{isSnippet ? `Add Snippet` : `New ${feedTypeName}`}</StyledTitle>
        <Box display="flex" flexDirection={isMobile && 'column'}>
          {!isSnippet && (
            <>
              <StyledColumn>
                {loading ? (
                  <Box minWidth="254px">
                    <Loader />
                  </Box>
                ) : (
                  <>
                    <StyledColumnItem
                      onClick={() => handleFilterChange(DefaultFilters.ALL)}
                      active={activeFilter === DefaultFilters.ALL}
                      capitalize
                    >
                      {DefaultFilters.ALL}
                    </StyledColumnItem>
                    {allTags.map((tag) => (
                      <StyledColumnItem
                        active={tag === activeFilter}
                        key={tag}
                        onClick={() => handleFilterChange(tag)}
                        capitalize
                      >
                        {tag}
                      </StyledColumnItem>
                    ))}
                  </>
                )}
              </StyledColumn>
              <StyledColumnBr />
            </>
          )}
          <Box display="flex" flexDirection="column">
            <StyledColumnSearchWrapper>
              <TextField
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                fullWidth
                onChange={(e) => debouncedSetSearchFilter(e.target.value)}
                label="Search"
              />
              <StyledColumnSearchIcon src={search} alt={`Search ${feedTypeName}s`} height="24" width="24" />
            </StyledColumnSearchWrapper>
            <Box>
              {loading || !activeTemplate ? (
                <Loader />
              ) : (
                <StyledColumn border maxHeight="290px">
                  {orderAlpha(filteredFeed)
                    .filter((feedEntry) => !feedEntry.private)
                    .map((feedEntry) =>
                      isSnippet ? (
                        <>
                          {feedEntry.snippets?.map((snippet) => (
                            <StyledColumnItem
                              width={isSnippet ? 2 : 1}
                              key={getFullTemplateId(feedEntry, snippet)}
                              onClick={() => handleTemplateChange(feedEntry, snippet)}
                              active={feedEntry.id === activeTemplate.id && snippet.id === activeSnippet?.id}
                            >
                              <StyledColumnItemImage
                                src={urlOrSvgToImage(feedEntry.smallIcon)}
                                alt={getFullTemplateName(feedEntry, snippet)}
                                height="18"
                                width="18"
                              />
                              {getFullTemplateName(feedEntry, snippet)}
                            </StyledColumnItem>
                          ))}
                        </>
                      ) : (
                        <StyledColumnItem
                          key={getFullTemplateId(feedEntry)}
                          onClick={() => handleTemplateChange(feedEntry)}
                          active={feedEntry.id === activeTemplate.id}
                          ref={(itemRef) => (feedEntry.id === key ? setCampaingIntegrationRef(itemRef) : null)}
                        >
                          <StyledColumnItemImage
                            src={urlOrSvgToImage(feedEntry.smallIcon)}
                            alt={getFullTemplateName(feedEntry)}
                            height="18"
                            width="18"
                          />
                          {getFullTemplateName(feedEntry)}
                        </StyledColumnItem>
                      )
                    )}
                </StyledColumn>
              )}
            </Box>
          </Box>
          <StyledColumnBr />
          <StyledConnectorInfo>
            {loading || !activeTemplate ? (
              <Loader />
            ) : (
              <>
                <StyledConnectorTitleWrapper>
                  <StyledConnectorImage
                    src={urlOrSvgToImage(activeTemplate.smallIcon)}
                    alt={activeTemplate.name || 'slack'}
                    height="28"
                    width="28"
                  />
                  <StyledConnectorTitle>{activeTemplate.name}</StyledConnectorTitle>
                  <StyledConnectorVersion>{activeTemplate.version}</StyledConnectorVersion>
                </StyledConnectorTitleWrapper>
                <StyledGeneralInfoWrapper>
                  <FeedItemDescription
                    description={(isSnippet ? activeSnippet?.description : activeTemplate.description) || ''}
                    templateId={isSnippet ? `${activeTemplate.id}-${activeSnippet?.id}` : activeTemplate.id}
                    isIntegration={isIntegration}
                    isSnippet={isSnippet}
                  />
                  {!activeTemplate.outOfPlan && (!isSnippet || needsConnector) && (
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
                  {isSnippet && !activeTemplate.outOfPlan && 'Add'}
                  {!isSnippet && activeTemplate.outOfPlan && 'Enable'}
                  {!isSnippet && !activeTemplate.outOfPlan && 'Create'}
                </Button>
              </>
            )}
          </StyledConnectorInfo>
        </Box>
      </StyledCard>
    );
  }
);

export default FeedPicker;
