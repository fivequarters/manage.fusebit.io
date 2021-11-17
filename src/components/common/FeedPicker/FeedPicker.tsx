import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { Props } from '@interfaces/feedPicker';
import search from '@assets/search.svg';
import Loader from '@components/common/Loader';
import { useTrackPage } from '@hooks/useTrackPage';
import { urlOrSvgToImage } from '@utils/utils';
import BaseJsonForm from '@components/common/BaseJsonForm';
import { DefaultFilters } from '@hooks/useFilterFeed';
import useFeed from '@hooks/useFeed';
import * as SC from './styles';

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
  } = useFeed({
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

  return (
    <SC.Card onKeyDown={(e: React.KeyboardEvent) => handleKeyDown(e)} ref={ref} tabIndex={-1}>
      <SC.Title>{`New ${feedTypeName}`}</SC.Title>
      <Box display="flex" flexDirection={isMobile && 'column'}>
        <SC.Column>
          {loading ? (
            <Box minWidth="254px">
              <Loader />
            </Box>
          ) : (
            <>
              <SC.ColumnItem
                onClick={() => handleFilterChange(DefaultFilters.ALL)}
                active={activeFilter === DefaultFilters.ALL}
                capitalize
              >
                {DefaultFilters.ALL}
              </SC.ColumnItem>
              {allTags.map((tag) => (
                <SC.ColumnItem
                  active={tag === activeFilter}
                  key={tag}
                  onClick={() => handleFilterChange(tag)}
                  capitalize
                >
                  {tag}
                </SC.ColumnItem>
              ))}
            </>
          )}
        </SC.Column>
        <SC.ColumnBr />
        <SC.Column border>
          <SC.ColumnSearchWrapper>
            <TextField fullWidth onChange={(e) => debouncedSetSearchFilter(e.target.value)} label="Search" />
            <SC.ColumnSearchIcon src={search} alt={`Search ${feedTypeName}`} height="24" width="24" />
          </SC.ColumnSearchWrapper>
          {loading || !activeTemplate ? (
            <Loader />
          ) : (
            <Box>
              {filteredFeed.sort().map((feedEntry) => {
                return (
                  <SC.ColumnItem
                    key={feedEntry.id}
                    onClick={() => handleTemplateChange(feedEntry)}
                    active={feedEntry.id === activeTemplate.id}
                  >
                    <SC.ColumnItemImage
                      src={urlOrSvgToImage(feedEntry.smallIcon)}
                      alt={feedEntry.name}
                      height="18"
                      width="18"
                    />
                    {feedEntry.name}
                  </SC.ColumnItem>
                );
              })}
            </Box>
          )}
        </SC.Column>
        <SC.ColumnBr />
        <SC.ConnectorInfo>
          {loading || !activeTemplate ? (
            <Loader />
          ) : (
            <>
              <SC.ConnectorTitleWrapper>
                <SC.ConnectorImage
                  src={urlOrSvgToImage(activeTemplate.smallIcon)}
                  alt={activeTemplate.name || 'slack'}
                  height="28"
                  width="28"
                />
                <SC.ConnectorTitle>{activeTemplate.name}</SC.ConnectorTitle>
                <SC.ConnectorVersion>{activeTemplate.version}</SC.ConnectorVersion>
              </SC.ConnectorTitleWrapper>
              <SC.GeneralInfoWrapper>
                <SC.ConnectorDescription linkTarget="_blank">
                  {activeTemplate.description || ''}
                </SC.ConnectorDescription>
                {activeTemplate.outOfPlan || (
                  <SC.FormWrapper>
                    <BaseJsonForm
                      schema={activeTemplate.configuration.schema}
                      uischema={activeTemplate.configuration.uischema}
                      data={data}
                      onChange={handleJsonFormsChange}
                      validationMode={validationMode}
                    />
                  </SC.FormWrapper>
                )}
              </SC.GeneralInfoWrapper>
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
        </SC.ConnectorInfo>
      </Box>
    </SC.Card>
  );
});

export default FeedPicker;
