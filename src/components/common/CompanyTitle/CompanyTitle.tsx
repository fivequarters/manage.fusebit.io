import { ReactNode } from 'react';
import styled from 'styled-components';
import { useAuthContext } from '../../../hooks/useAuthContext';

const StyledUserDropdownCompany = styled.h5`
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  max-width: 226px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;

  @media only screen and (max-width: 880px) {
    width: 290px;
  }
`;

interface Props {
  children?: ReactNode;
}

const CompanyTitle = ({ children }: Props) => {
  const { userData } = useAuthContext();

  return <StyledUserDropdownCompany>{children || userData.company}</StyledUserDropdownCompany>;
};

export default CompanyTitle;
