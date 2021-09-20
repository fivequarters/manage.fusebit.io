import React from 'react';
import List from '../List';
import Tag from '../Tag';
import * as CSC from '../globalStyle';

interface Props {
  isLoading: boolean;
  tags: string[];
}

const AsyncTags: React.FC<Props> = ({ isLoading, tags }) => {
  return (
    <>
      {isLoading ? (
        <CSC.Spinner />
      ) : (
        <List>
          {tags.map((tag) => {
            return <Tag> {tag} </Tag>;
          })}
        </List>
      )}
    </>
  );
};

export default AsyncTags;
