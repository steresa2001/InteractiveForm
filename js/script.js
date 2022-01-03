// Utility functions
const setFocus = (element) => {
  element.focus();
};
const disableElement = (element, value) => {
  element.disabled = value;
};
const queryElement = (element) => document.querySelector(element);
const queryAllElements = (element) => document.querySelectorAll(element);

const toggleVisibility = (element) => {
  // If there is no offsetParent, element is hidden
  element.offsetParent === null
    ? (element.style.display = "inherit")
    : (element.style.display = "none");
};

const visible = (element, value) => {
  return (element.style.display = value);
};

const removeWhiteSpace = (value) => {
  return value.trim();
};

const eventListener = (element, event, callback) => {
  element.addEventListener(event, callback);
};

//////////////////////////////////////////////////

// Object for getting DOM elements
const element = {
  nameInput: queryElement("#name"),
  otherJobRoleInput: queryElement("#other-job-role"),
  jobRoleSelect: queryElement("#title"),
  colorSelect: queryElement("#color"),
  designSelect: queryElement("#design"),
  emailInput: queryElement("#email"),
  emailHint: queryElement("#email-hint"),
  activitiesFieldSet: queryElement("#activities"),
  activitiesBox: queryElement("#activities-box"),
  activitiesBoxCheckBoxes: queryAllElements("#activities-box input"),
  activitiesCost: queryElement("#activities-cost"),
  paymentMethod: queryElement("#payment"),
  creditCardContainer: queryElement("#credit-card"),
  creditCardInput: queryElement("#cc-num"),
  creditCardHint: queryElement("#cc-hint"),
  zipCodeInput: queryElement("#zip"),
  cvv: queryElement("#cvv"),
  payPal: queryElement("#paypal"),
  bitcoin: queryElement("#bitcoin"),
  form: queryElement("form"),
};
//////////////////////////////////////////////////

// Set focus to name input on page load
setFocus(element.nameInput);

// Job role section
toggleVisibility(element.otherJobRoleInput);
eventListener(element.jobRoleSelect, "change", (event) => {
  const value = event.target.value;
  if (value === "other") {
    visible(element.otherJobRoleInput, "inherit");
  } else {
    visible(element.otherJobRoleInput, "none");
  }
});
//////////////////////////////////////////////////

// Design section
disableElement(element.colorSelect, true);
eventListener(element.designSelect, "change", (event) => {
  const value = event.target.value;
  disableElement(element.colorSelect, false);

  const colorSelectOptionsLength = element.colorSelect.options.length;
  const colorSelectOptions = element.colorSelect.options;
  const activeOptions = [];
  colorSelectOptions[0].removeAttribute("selected");
  for (let i = 0; i < colorSelectOptionsLength; i++) {
    if (colorSelectOptions[i].dataset.theme !== value) {
      colorSelectOptions[i].hidden = true;
    } else {
      colorSelectOptions[i].hidden = false;
      activeOptions.push(colorSelectOptions[i]);
    }
  }
  activeOptions[0].selected = true;
});
//////////////////////////////////////////////////

// Activities section
const highlightActivities = () => {
  const checkboxes = element.activitiesBoxCheckBoxes;
  for (let i = 0; i < checkboxes.length; i++) {
    eventListener(checkboxes[i], "focus", (event) => {
      const label = event.target.parentElement;
      label.classList.add("focus");
    });
    eventListener(checkboxes[i], "blur", (event) => {
      const label = event.target.parentElement;
      label.classList.remove("focus");
    });
  }
};

highlightActivities();

eventListener(element.activitiesBox, "change", (event) => {
  const isCheckBox = event.target.type;
  const isChecked = event.target.checked;
  const number = /\d+/;
  const updateCost = (value, match, newValue) => {
    return value.textContent.replace(match, newValue);
  };
  if (isCheckBox === "checkbox") {
    let total = element.activitiesCost;
    let currentTotal = parseInt(total.textContent.match(number));
    let newTotal = 0;
    let activityCost = parseInt(event.target.dataset.cost);

    const setCost = () => {
      newTotal = updateCost(total, number, currentTotal);
      return (total.textContent = newTotal);
    };
    if (isChecked) {
      currentTotal += activityCost;
      return setCost();
    }
    currentTotal -= activityCost;
    setCost();
  }
});

const preventConflictingActivities = () => {
  const checkboxes = element.activitiesBoxCheckBoxes;
  for (let i = 0; i < checkboxes.length; i++) {
    eventListener(checkboxes[i], "click", (event) => {
      let currentCheckboxDayAndTime = event.currentTarget.dataset.dayAndTime;
      for (let j = 0; j < checkboxes.length; j++) {
        let currentTarget = event.currentTarget;
        let checkbox = checkboxes[j];
        let checkboxDayAndTime = checkboxes[j].dataset.dayAndTime;
        if (
          currentCheckboxDayAndTime === checkboxDayAndTime &&
          checkbox !== currentTarget &&
          currentTarget.checked
        ) {
          disableElement(checkboxes[j], true);
          checkbox.parentElement.classList.add("disabled");
        } else if (
          currentCheckboxDayAndTime === checkboxDayAndTime &&
          !currentTarget.checked
        ) {
          disableElement(checkboxes[j], false);
          checkbox.parentElement.classList.remove("disabled");
        }
      }
    });
  }
};

preventConflictingActivities();
//////////////////////////////////////////////////

// Payment Section
let paymentMethod;
const payment = () => {
  visible(element.payPal, "none");
  visible(element.bitcoin, "none");

  const creditCardOption = element.paymentMethod.options[1];
  creditCardOption.selected = true;
  // Set paymentMethod to credit by default
  paymentMethod = "credit";
  eventListener(element.paymentMethod, "change", (event) => {
    const value = event.target.value;
    const isCreditCard = value === element.creditCardContainer.id;
    const isPayPal = value === element.payPal.id;
    const isBitCoin = value === element.bitcoin.id;

    if (isCreditCard) {
      paymentMethod = "credit";
      visible(element.creditCardContainer, "inherit");
      visible(element.payPal, "none");
      visible(element.bitcoin, "none");
    }
    if (isPayPal) {
      paymentMethod = "paypal";
      visible(element.creditCardContainer, "none");
      visible(element.payPal, "inherit");
      visible(element.bitcoin, "none");
    }
    if (isBitCoin) {
      paymentMethod = "bitcoin";
      visible(element.creditCardContainer, "none");
      visible(element.payPal, "none");
      visible(element.bitcoin, "inherit");
    }
  });
};
payment();
//////////////////////////////////////////////////

// Form Validation
const notValidIndicator = (element) => {
  element.classList.add("not-valid");
  element.classList.remove("valid");
  visible(element.lastElementChild, "inherit");
};
const validIndicator = (element) => {
  element.classList.remove("not-valid");
  element.classList.add("valid");
  visible(element.lastElementChild, "none");
};

const nameValidation = () => {
  let isValid;
  const nameInput = element.nameInput;
  const value = nameInput.value;
  const name = removeWhiteSpace(value);
  if (name === "") {
    notValidIndicator(nameInput.parentElement);
    return (isValid = false);
  }
  validIndicator(nameInput.parentElement);
  return (isValid = true);
};

const emailValidation = () => {
  const emailInput = element.emailInput;
  const value = emailInput.value;
  const email = removeWhiteSpace(value);
  const validation = /.+@.+\.\D{2,3}$/;
  const isValid = validation.test(email);
  if (!isValid) {
    notValidIndicator(emailInput.parentElement);
  } else {
    validIndicator(emailInput.parentElement);
  }
  return isValid;
};

const emailNeedsProperFormatValidationHint = () => {
  const span = document.createElement("span");
  span.classList.add("email-proper-format-hint", "hint");
  span.textContent = 'Email must contain "@"';
  const emailHint = element.emailHint;
  emailHint.parentElement.insertBefore(span, emailHint);
};
emailNeedsProperFormatValidationHint();
const emailNeedsProperFormatValidation = () => {
  const emailInput = element.emailInput;
  const value = emailInput.value;
  const email = removeWhiteSpace(value);
  const validation = /.+@/;
  const isValid = validation.test(email);
  const emailProperFormatHint = document.querySelector(
    ".email-proper-format-hint"
  );
  if (!isValid) {
    visible(emailProperFormatHint, "block");
  } else {
    visible(emailProperFormatHint, "none");
  }
  return isValid;
};

const validateEmailOnKeyUp = () => {
  eventListener(element.emailInput, "keyup", () => {
    emailValidation();
    emailNeedsProperFormatValidation();
  });
};

validateEmailOnKeyUp();

const activitiesValidation = () => {
  let isValid;
  const activitiesFieldSet = element.activitiesFieldSet;
  const checkBoxes = element.activitiesBox.children;
  for (var i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].children[0].checked) {
      validIndicator(activitiesFieldSet);
      return (isValid = true);
    }
  }
  notValidIndicator(activitiesFieldSet);
  return (isValid = false);
};

const creditCardNoLettersValidationHint = () => {
  const span = document.createElement("span");
  span.classList.add("credit-card-no-letters-hint", "hint");
  span.textContent = "Credit card must ONLY contain numbers";
  const creditCardHint = element.creditCardHint;
  creditCardHint.parentElement.insertBefore(span, creditCardHint);
};
creditCardNoLettersValidationHint();
const creditCardNoLettersValidation = () => {
  const creditCardInput = element.creditCardInput;
  const value = creditCardInput.value;
  const creditCard = removeWhiteSpace(value);
  const validation = /^\d+$/g;
  const isValid = validation.test(creditCard);
  const creditCardHint = document.querySelector(".credit-card-no-letters-hint");
  if (!isValid) {
    visible(creditCardHint, "block");
  } else {
    visible(creditCardHint, "none");
  }
  return isValid;
};

const creditCardValidation = () => {
  const creditCardInput = element.creditCardInput;
  const value = creditCardInput.value;
  const creditCard = removeWhiteSpace(value);
  const validation = /^\d{13,16}$/;
  const isValid = validation.test(creditCard);
  if (!isValid) {
    notValidIndicator(creditCardInput.parentElement);
  } else {
    validIndicator(creditCardInput.parentElement);
  }
  return isValid;
};

const validateCreditCardOnKeyUp = () => {
  eventListener(element.creditCardInput, "keyup", () => {
    creditCardValidation();
    creditCardNoLettersValidation();
  });
};

validateCreditCardOnKeyUp();

const zipCodeValidation = () => {
  const zipCodeInput = element.zipCodeInput;
  const value = zipCodeInput.value;
  const zipCode = removeWhiteSpace(value);
  const validation = /^\d{5}$/;
  const isValid = validation.test(zipCode);
  if (!isValid) {
    notValidIndicator(zipCodeInput.parentElement);
  } else {
    validIndicator(zipCodeInput.parentElement);
  }
  return isValid;
};
const cvvValidation = () => {
  const cvvInput = element.cvv;
  const value = cvvInput.value;
  const cvv = removeWhiteSpace(value);
  const validation = /^\d{3}$/;
  const isValid = validation.test(cvv);
  if (!isValid) {
    notValidIndicator(cvvInput.parentElement);
  } else {
    validIndicator(cvvInput.parentElement);
  }
  return isValid;
};

const creditSectionValidation = () => {
  console.log("credit check");
  let isCreditValid = false;

  const isCardNumberValid = creditCardValidation();
  const isCardNumberOnlyNumbers = creditCardNoLettersValidation();
  const isZipCodeValid = zipCodeValidation();
  const iscvvValid = cvvValidation();
  if (!isCardNumberValid) return isCardNumberValid;
  if (!isCardNumberOnlyNumbers) return isCardNumberOnlyNumbers;
  if (!isZipCodeValid) return isZipCodeValid;
  if (!iscvvValid) return iscvvValid;
  return (isCreditValid = true);
};

const isPaymentMethodCredit = () => {
  let isValid;
  // Validate credit info only if it's the chosen payment method
  if (paymentMethod === "credit") {
    isValid = creditSectionValidation();
    return isValid;
  }
};

const allowFormSubmissiom = () => {
  let submitForm;
  let isNameValid;
  let isEmailValid;
  let isEmailProperFormatValid;
  let isActivitiesValid;
  let isCreditValid;
  isNameValid = nameValidation();
  isEmailValid = emailValidation();
  isEmailProperFormatValid = emailNeedsProperFormatValidation();
  isActivitiesValid = activitiesValidation();
  isCreditValid = isPaymentMethodCredit();

  if (
    !isNameValid ||
    !isEmailValid ||
    !isSpecificEmailValid ||
    !isActivitiesValid ||
    !isCreditValid
  ) {
    return (submitForm = false);
  }
  return (submitForm = true);
};
//////////////////////////////////////////////////

// Form Submit
eventListener(element.form, "submit", (event) => {
  const submitForm = allowFormSubmissiom();
  if (!submitForm) event.preventDefault();
});
