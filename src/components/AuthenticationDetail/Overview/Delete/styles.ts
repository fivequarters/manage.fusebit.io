import styled from 'styled-components';

export const Card = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  opacity: ${props => (props.open ? 1 : 0)};
  padding: 64px 100px;
  width: 449px;
  border-radius: 8px;
  box-shadow: 0px 20px 48px rgba(52, 72, 123, 0.1);
  transition: all 1s linear;

  @media only screen and (max-width: 550px) {
    width: 100%;
    left: 0;
    top: auto;
    bottom: 0;
    transform: translate(0, 0);
  }
`;

export const Close = styled.img`
  height: 12px;
  width: 12px;
  object-fit: contain;
  position: absolute;
  top: 32px;
  right: 32px;
  transition: all 0.25s linear;

  &:hover {
    cursor: pointer;
    transform: rotate(90deg);
  }
`;

export const Title = styled.h3`
  font-size: 20px;
  line-height: 26px;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
  text-align: center;
  max-width: 249px;
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: var(--black);
  text-align: center;
  margin-bottom: 40px;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
