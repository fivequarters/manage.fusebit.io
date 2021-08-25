import warning from '../assets/warning.svg';
import cross from '../assets/cross-warning.svg';

const errorCss = `
    display: flex;
    align-items: center;
    width: 86%;
    padding: 10px 24px;
    border-radius: 8px;
    background-color: #F83420;
    box-shadow: 0px 6px 23px rgba(224, 70, 4, 0.3);
    position: absolute;
    top: 240px;
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
    margin-left: 5px;
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

export const useError = () => {
  const removeError = () => {
    const error = document.getElementById('error');
    if (error) error.remove();
  };

  const createError = (errorMessage: string) => {
    removeError(); // we dont want 2 errors at the same time
    const error = document.createElement('div');
    error.setAttribute('id', 'error');
    error.setAttribute('style', errorCss);

    const warning = document.createElement('div');
    warning.setAttribute('style', errorWarningImage);
    error.appendChild(warning);

    const title = document.createElement('div');
    title.setAttribute('style', errorTitleCss);
    title.innerHTML = 'Error:';
    error.appendChild(title);

    const text = document.createElement('p');
    text.setAttribute('style', errorTextCss);
    text.innerHTML = errorMessage;
    error.appendChild(text);

    const cross = document.createElement('div');
    cross.setAttribute('id', 'errorCross');
    cross.setAttribute('style', errorCross);
    error.appendChild(cross);

    cross.addEventListener('click', removeError);

    document.body.appendChild(error);
  };

  return {
    createError,
  };
};
