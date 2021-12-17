export const sendIntercomMessage = () => {
  setTimeout(() => {
    const intercomFrame = document.querySelector<HTMLIFrameElement>("iframe[name='intercom-messenger-frame']");
    if (!intercomFrame || !intercomFrame.contentDocument) {
      return sendIntercomMessage();
    }
    const sendButton = intercomFrame.contentDocument.querySelector<HTMLButtonElement>('.intercom-composer-send-button');
    if (!sendButton) {
      return sendIntercomMessage();
    }
    sendButton.click();
  }, 200);
};
