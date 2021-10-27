import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import check from '../../../assets/check.svg';
import rightArrow from '../../../assets/arrow-right-black.svg';

const StyledContainer = styled.div<{ mobileHidden?: boolean }>`
  display: flex;
  align-items: center;

  @media only screen and (max-width: 880px) {
    display: ${(props) => props.mobileHidden && 'none'};
  }
`;

const StyledSectionDropdownTitle = styled.h4`
  font-size: 16px;
  line-height: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-right: auto;
  margin-bottom: 16px;
`;

const StyledSectionDropdownIntegration = styled.span<{ active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? 'var(--secondary-color)' : 'white')};
  font-size: 14px;
  line-height: 16px;
  font-weight: ${(props) => (props.active ? 700 : 400)};
  text-decoration: none;
  color: var(--black);
  margin-bottom: 5px;
  transition: all 0.25s linear;

  &:hover {
    background-color: var(--secondary-color);
    cursor: pointer;
  }

  & > img {
    margin-left: auto;
    display: ${(props) => (props.active ? 'block' : 'none')};
  }
`;

const StyledSectionDropdownSeeMore = styled.span`
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  text-decoration: none;
  margin-bottom: -4px;
  margin-left: auto;
  color: var(--black);

  & > img {
    margin-left: 9px;
  }

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  title: string;
  linkTitleTo: string;
  onClose: () => void;
  items?: {
    id: string;
    to: string;
  }[];
}

const EntityMenuSection = ({ title, items = [], linkTitleTo, onClose }: Props) => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <StyledContainer>
        <Link style={{ marginRight: 'auto' }} to={linkTitleTo}>
          <StyledSectionDropdownTitle>{title}</StyledSectionDropdownTitle>
        </Link>
        <Link to={linkTitleTo}>
          <StyledSectionDropdownSeeMore>
            See all
            <img src={rightArrow} alt="See all" height="8" width="8" />
          </StyledSectionDropdownSeeMore>
        </Link>
      </StyledContainer>
      {items.map((item) => (
        <Link key={item.id} to={item.to} onClick={onClose}>
          <StyledSectionDropdownIntegration active={id === item.id}>
            {item.id}
            <img src={check} alt="check" height="16" width="16" />
          </StyledSectionDropdownIntegration>
        </Link>
      ))}
    </>
  );
};

export default EntityMenuSection;
