import React from 'react';
import List from '@components/common/List';
import Tag from '@components/common/Tag';
import * as CSC from '@components/globalStyle';

interface Props {
  isLoading: boolean;
  tags: {
    value: string;
    onClick?: (id: string) => void;
  }[];
}

const AsyncTags: React.FC<Props> = ({ isLoading, tags }) => {
  return (
    <>
      {isLoading ? (
        <CSC.Spinner />
      ) : (
        <List>
          {tags.map((tag) => {
            return (
              <Tag key={tag.value} onClick={() => tag.onClick?.(tag.value)}>
                {' '}
                {tag.value}{' '}
              </Tag>
            );
          })}
        </List>
      )}
    </>
  );
};

export default AsyncTags;
