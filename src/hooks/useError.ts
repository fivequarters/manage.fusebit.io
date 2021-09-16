import { useEffect } from 'react';
import warning from '../assets/warning.svg';
import cross from '../assets/cross-warning.svg';
import { useLocation } from 'react-router-dom';

const errorCss = `
    display: flex;
    align-items: center;
    width: max-content;
    max-width: 750px;
    padding: 10px 24px;
    border-radius: 8px;
    background-color: #F83420;
    box-shadow: 0px 6px 23px rgba(224, 70, 4, 0.3);
    position: absolute;
    top: 285px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99;
    color: white;
    `;

const errorWarningImage = `
    height: 24px;
    width: 24px;
    background-image: url(${warning});
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 20px;
`;

const errorTitleCss = `
    font-size: 14px;
    line-height: 16px;
    color: white;
    font-weight: 700;
    `;

const errorTextCss = `
    font-size: 14px;
    line-height: 16px;
    margin-left: 10px;
    margin-right: 15px;
    `;

const errorCross = `
    height: 10px;
    width: 10px;
    background-image: url(${cross});
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: auto;
    cursor: pointer;
    `;

const errorMessageContainer = `
 display: flex;
 align-items: flex-start;
`;

export const useError = () => {
  const location = useLocation();

  useEffect(() => {
    removeError();
  }, [location]);

  const removeError = () => {
    const error = document.getElementById('error');
    if (error) error.remove();
  };

  const createError = (err: any, errorContainer?: string) => {
    removeError(); // we dont want 2 errors at the same time
    const error = document.createElement('div');
    error.setAttribute('id', 'error');
    error.setAttribute('style', errorCss);

    const warning = document.createElement('div');
    warning.setAttribute('style', errorWarningImage);
    error.appendChild(warning);

    const messageContainer = document.createElement('div');
    messageContainer.setAttribute('style', errorMessageContainer);
    error.appendChild(messageContainer);

    const title = document.createElement('p');
    title.setAttribute('style', errorTitleCss);
    title.innerHTML = 'Error:';
    messageContainer.appendChild(title);

    const text = document.createElement('p');
    text.setAttribute('style', errorTextCss);
    text.innerHTML = err?.response?.data?.message?.split(':')?.[1] || 'There was an error'; // the element 0 shows the key, the 1 show the value, i only want the value so i get the element 1
    messageContainer.appendChild(text);

    const cross = document.createElement('div');
    cross.setAttribute('id', 'errorCross');
    cross.setAttribute('style', errorCross);
    error.appendChild(cross);

    cross.addEventListener('click', removeError);

    if (errorContainer) {
      error.style.position = 'static';
      error.style.transform = 'none';
      error.style.margin = '0 auto 20px auto';
      document.getElementById(errorContainer)?.prepend(error);
      return
    }

    document.body.appendChild(error);
  };

  return {
    createError,
  };
};
