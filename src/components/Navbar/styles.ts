import styled from "styled-components";
import navbarBg from '../../assets/navbar.svg';

export const Background = styled.div`
    width: 100vw;
    height: 216px;
    display: flex;
    background-image: url(${navbarBg});
    background-repeat: no-repeat;
    background-size: cover;
`;