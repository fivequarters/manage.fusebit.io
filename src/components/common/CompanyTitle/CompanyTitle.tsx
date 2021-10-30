import styled from 'styled-components';
import { useAuthContext } from '../../../hooks/useAuthContext';

const StyledUserDropdownCompany = styled.h5`
  font-size: 14px;
  line-height: 16px;
  font-weight: 500;
  color: var(--primary-color);
  text-transform: uppercase;
  margin: 0;
`;

const CompanyTitle = () => {
  const { userData } = useAuthContext();

  return <StyledUserDropdownCompany>{userData.company}</StyledUserDropdownCompany>;
};

export default CompanyTitle;
