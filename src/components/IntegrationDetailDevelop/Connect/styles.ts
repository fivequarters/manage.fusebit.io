import styled from 'styled-components';
import disclaimer from '../../../assets/disclaimer.svg';
import time from '../../../assets/time.svg';
import warning from '../../../assets/black-warning.svg';

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: ${(props) => (props.open ? 1 : 0)};
  padding: 40px 96px;
  border-radius: 8px;
  width: 859px;
  height: 700px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 870px) {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 32px;
    padding-top: 200px;
    left: 0;
    top: auto;
    bottom: 0;
    border-radius: 0;
    transform: translate(0, 0);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 667px;
  padding-top: 0px;
`;

export const SmallTitleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

export const SmallTitle = styled.h4`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: var(--black);
  margin: 0;
  max-width: 600px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  strong {
    font-weight: 600;
    line-height: 18px;
  }
`;

export const Hr = styled.div`
  position: relative;
  width: 100%;
  height: 1px;
  background-color: var(--grey);
  margin: 40px 0;
`;

export const Subtitle = styled.h3`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
`;

export const Disclaimer = styled.p`
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: var(--black);
  margin-left: 14px;

  strong {
    font-weight: 500;
    line-height: 16px;
  }
`;

export const DisclaimerIcon = styled.div`
  height: 20px;
  width: 20px;
  background-image: url(${disclaimer});
  background-size: contain;
  background-repeat: no-repeat;
`;

export const TimeIcon = styled.div`
  height: 14px;
  width: 14px;
  background-image: url(${time});
  background-size: contain;
  background-repeat: no-repeat;
`;

export const TimeDescription = styled.p<{ margin?: string }>`
  font-size: 12px;
  line-height: 16px;
  font-weight: 300;
  color: var(--black);
  margin-left: 10px;
  margin: ${(props) => props.margin && props.margin};
`;

export const Or = styled.h4`
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
  color: var(--black);
  margin: 0 auto;
  transform: translateY(-27px);
`;

export const CopySuccess = styled.p<{ copy: boolean }>`
  position: absolute;
  bottom: -35px;
  font-size: 14px;
  line-height: 16px;
  color: var(--grey);
  opacity: ${(props) => (props.copy ? 1 : 0)};
  visibility: ${(props) => (props.copy ? 'visible' : 'hidden')};
  margin-left: auto;
  transition: all 0.5s linear;
`;

export const WarningWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px;
  background-color: var(--yellow);
  border-radius: 8px;
  margin-top: 18px;

  p {
    font-size: 14px;
    line-height: 20px;
    color: var(--black);
  }
`;

export const WarningIcon = styled.div`
  height: 19px;
  width: 22px;
  background-image: url(${warning});
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 17px;
`;
