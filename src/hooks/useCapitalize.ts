export const useCapitalize = () => {
  const capitalize = (str: string) => {
    const lower = str.toLowerCase();
    const splittedString = lower.split(' ');
    let formattedString: string | undefined = undefined;
    splittedString.forEach((str) => {
      if (formattedString) {
        formattedString = formattedString + ' ' + str.charAt(0).toUpperCase() + str.slice(1);
      } else {
        formattedString = str.charAt(0).toUpperCase() + str.slice(1);
      }
    });
    return formattedString;
  };

  return {
    capitalize,
  };
};
