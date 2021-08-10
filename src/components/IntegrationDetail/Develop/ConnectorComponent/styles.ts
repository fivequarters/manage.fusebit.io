import styled from 'styled-components';

export const CardConnector = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: var(--secondary-color);

  &:hover {
    cursor: pointer;
  }
`;

export const CardConnectorImage = styled.img`
  height: 20px;
  width: 20px;
  object-fit: contain;
  margin-right: 16px;
`;

export const CardConnectorText = styled.h4`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--black);
  margin-right: auto;
`;

export const CardConnectorCrossContainer = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s linear;

  &:hover {
    transform: rotate(90deg);
  }
`;

export const CardConnectorCross = styled.img`
  height: 8px;
  width: 8px;
  object-fit: contain;

  &:hover {
    cursor: pointer;
  }
`;

export const CardConnectorButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  width: 100%;

  @media only screen and (max-width: 450px) {
    display: none;
  }
`;

export const CardConnectorButtonsWrapperMobile = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  width: 100%;

  @media only screen and (max-width: 450px) {
    display: flex;
  }
`;

export const CardConnectorSeeMore = styled.a`
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 14px;
  font-weight: 300;
  color: var(--black);
  margin-left: auto;
  margin-top: 8px;
  text-decoration: none;

  > img {
    margin-left: 7.25px;
    transition: all 0.25s linear;
  }

  &:hover {
    cursor: pointer;
  }
`;
