import React from 'react';
import List from '../List';
import Tag from '../Tag';
import * as CSC from '../../globalStyle';

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
