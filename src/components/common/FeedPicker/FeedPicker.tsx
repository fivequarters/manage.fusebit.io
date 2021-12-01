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
import FeedItemDescription from './FeedItemDescription';

const StyledCard = styled.div`
  padding: 24px;
  padding-bottom: 0;
  width: 1025px;
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

const StyledColumn = styled.div<{ border?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 390px;
  overflow-y: scroll;
  flex-shrink: 0;
  z-index: 0;

  @media only screen and (max-width: 1100px) {
    height: 100%;
  }
`;

const StyledColumnItem = styled.div<{ active: boolean; capitalize?: boolean }>`
  display: flex;
  align-items: center;
  padding: 11px 16px;
  font-size: 16px;
  line-height: 18px;
  background-color: ${(props) => props.active && 'var(--secondary-color)'};
  font-weight: ${(props) => (props.active ? 600 : 400)};
  width: 254px;
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
  padding-left: 24px;
  width: 100%;

  @media only screen and (max-width: 1100px) {
    padding-left: 0;
  }
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

const FeedPicker = React.forwardRef<HTMLDivElement, Props>(({ open, onClose, onSubmit, isIntegration }, ref) => {
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
    loading,
    feedTypeName,
    isMobile,
    orderAlpha,
  } = useFeedPicker({
    open,
    isIntegration,
    onSubmit,
    onClose,
  });
  useTrackPage(`${feedTypeName} New Modal`, `${feedTypeName}s`);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const activeRef = React.useRef<HTMLInputElement>(null);
  const activeId = activeTemplate?.id;

  React.useEffect(() => {
    if (activeId && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint complains about including activeRef.current, but it works well to cause the scroll once the item
    // has been identified.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, activeRef.current]);

  return (
    <StyledCard onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} ref={ref} tabIndex={-1}>
      <StyledTitle>{`New ${feedTypeName}`}</StyledTitle>
      <Box display="flex" flexDirection={isMobile && 'column'}>
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
        <StyledColumn border>
          <StyledColumnSearchWrapper>
            <TextField fullWidth onChange={(e) => debouncedSetSearchFilter(e.target.value)} label="Search" />
            <StyledColumnSearchIcon src={search} alt={`Search ${feedTypeName}`} height="24" width="24" />
          </StyledColumnSearchWrapper>
          {loading || !activeTemplate ? (
            <Loader />
          ) : (
            <Box>
              {orderAlpha(filteredFeed)
                .filter((feedEntry) => !feedEntry.private)
                .map((feedEntry) => (
                  <StyledColumnItem
                    key={feedEntry.id}
                    onClick={() => handleTemplateChange(feedEntry)}
                    active={feedEntry.id === activeTemplate.id}
                    ref={feedEntry.id === activeTemplate.id ? activeRef : undefined}
                  >
                    <StyledColumnItemImage
                      src={urlOrSvgToImage(feedEntry.smallIcon)}
                      alt={feedEntry.name}
                      height="18"
                      width="18"
                    />
                    {feedEntry.name}
                  </StyledColumnItem>
                ))}
            </Box>
          )}
        </StyledColumn>
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
                  description={activeTemplate.description || ''}
                  templateId={activeTemplate.id}
                  isIntegration={isIntegration}
                />
                {activeTemplate.outOfPlan || (
                  <StyledFormWrapper>
                    <BaseJsonForm
                      schema={activeTemplate.configuration.schema}
                      uischema={activeTemplate.configuration.uischema}
                      data={data}
                      onChange={handleJsonFormsChange}
                      validationMode={validationMode}
                    />
                  </StyledFormWrapper>
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
                {activeTemplate.outOfPlan ? 'Enable' : 'Create'}
              </Button>
            </>
          )}
        </StyledConnectorInfo>
      </Box>
    </StyledCard>
  );
});

export default FeedPicker;
