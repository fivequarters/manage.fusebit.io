import React from 'react';
import * as SC from './styles';
import warning from '../../assets/warning-red.svg';

const FatalError: React.FC<{}> = () => {
  return (
    <SC.Wrapper>
      <SC.Warning src={warning} alt='warning' height='40' width='40' />
      <SC.Title>Error</SC.Title>
      <SC.Subtitle>Lorem ipsum dolor sit amet</SC.Subtitle>
      <SC.Description>
        Aenean et pretium felis, et porttitor quam. Nam mi mauris, lacinia ut orci non, placerat maximus quam. Morbi at
        purus tellus. Mauris cursus porta est, vel elementum tellus interdum vitae. Sed in pellentesque mi. Nunc et enim
        odio. Phasellus vestibulum enim ut tortor commodo, eu mattis risus dictum. Integer dictum blandit justo, vel
        feugiat mi eleifend id. Suspendisse potenti. Suspendisse eu odio vel lorem commodo egestas. Ut in libero
        fringilla, fringilla ante sodales, maximus lacus. Integer eget fringilla elit. Mauris eu nisl libero.
      </SC.Description>
      <SC.Hr />
    </SC.Wrapper>
  );
};

export default FatalError;
