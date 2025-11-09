class PTCAutofill {
  constructor() {
    this.userData = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "415-555-2671",
      street: "123 Main Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94101",
      country: "United States",
      expectedSalary: "150000",
    };
  }

  async fillAllFields() {
    console.log("Filling all PTC Eightfold AI form fields...");

    // Contact Information Section
    await this.fillFieldWithValidation(
      '[data-test-id="Contact_Information_firstname"]',
      this.userData.firstName,
      "First Name"
    );
    await this.fillFieldWithValidation(
      '[data-test-id="Contact_Information_lastname"]',
      this.userData.lastName,
      "Last Name"
    );
    await this.fillFieldWithValidation(
      '[data-test-id="Contact_Information_email"]',
      this.userData.email,
      "Email"
    );
    await this.fillDropdown(
      "#input-4",
      "🇺🇸 (+1) United States of America",
      "Phone Country Code"
    );
    await this.fillFieldWithValidation(
      '[data-test-id="Contact_Information_phone"]',
      this.userData.phone,
      "Phone"
    );

    // Source Section
    await this.fillDropdown("#input-7", "LinkedIn", "Source");
    await this.fillFieldWithValidation(
      "#Source_Former_Employee_Last_Date",
      "20 Dec 2025",
      "If former employee what was your last date of employment?"
    );

    // Voluntary Self-Identification of Disability Section
    await this.fillFieldWithValidation(
      '[data-test-id="Voluntary_Self_Identification_of_Disability_CC305_Name"]',
      this.userData.firstName + " " + this.userData.lastName,
      "Name"
    );
    await this.fillFieldWithValidation(
      "#Voluntary_Self_Identification_of_Disability_CC305_Date",
      "20 Dec 2025",
      "If former employee what was your last date of employment?"
    );

    // Disability Status
    await this.fillDropdown(
      "#input-10",
      "No, I Don't Have A Disability, Or A History/Record Of Having A Disability",
      "Disability Status"
    );

    // Relocation Section
    await this.fillDropdown("#input-16", "Yes", "Are you open to relocation?");

    // Address Section
    await this.fillFieldWithValidation(
      '[data-test-id="Address_Address_Line_1"]',
      this.userData.street,
      "Street Address"
    );
    await this.fillFieldWithValidation(
      '[data-test-id="Address_City"]',
      this.userData.city,
      "City"
    );
    await this.fillFieldWithValidation(
      '[data-test-id="Address_State"]',
      this.userData.state,
      "State"
    );
    await this.fillFieldWithValidation(
      '[data-test-id="Address_Postal_Code"]',
      this.userData.zipCode,
      "ZIP Code"
    );

    //(VEVRAA) Veteran's Self-Identification Form (Pre-offer)
    await this.fillDropdown(
      "#input-13",
      "I do not wish to self-identify",
      "(VEVRAA) Veteran's Self-Identification Form (Pre-offer)"
    );
    await this.fillDropdown("#input-19", "United States", "Country");

    // Application questions Section
    await this.fillFieldWithValidation(
      '[data-test-id="Application_questions_us_annual_salary"]',
      this.userData.expectedSalary,
      "What are your annual salary expectations?"
    );
    await this.fillDropdown(
      "#input-22",
      "Fully Remote",
      "Would you prefer to work on-site, hybrid (2-3 days in office) and/or remote only?"
    );

    // Position Specific Questions
    await this.fillFieldWithValidation(
      "#Position_Specific_Questions_Question_Setup_1",
      "01 Jan 2026",
      "When is your preferred start date?"
    );
    await this.fillDropdown(
      "#input-25",
      "Yes",
      "Are you legally permitted to work in the country where this job is located?"
    );
    await this.fillDropdown(
      "#input-28",
      "No",
      "Will you now or in the future require sponsorship for employment?"
    );

    await this.triggerFinalValidation();
  }

  async fillFieldWithValidation(selector, value, description) {
    const element = document.querySelector(selector);
    if (!element) {
      console.log(`❌ Not found: ${description}`);
      return false;
    }

    console.log(`Filling ${description}...`);

    // Focus first
    element.focus();

    // Clear first
    element.value = "";
    this.triggerAllEvents(element);

    // Set value
    element.value = value;
    this.triggerAllEvents(element);

    // Blur to trigger validation
    element.blur();
    this.triggerAllEvents(element);

    // Check if field is still showing as required
    await this.checkFieldValidation(element, description);
    return true;
  }

  async fillDropdown(dropdownId, targetValue, description) {
    console.log(`🔄 Filling dropdown ${description} with: ${targetValue}`);

    const dropdown = document.querySelector(dropdownId);
    if (!dropdown) {
      console.log(`❌ Dropdown not found: ${dropdownId}`);
      return false;
    }

    try {
      dropdown.value = targetValue;
      this.triggerBasicEvents(dropdown);
      await this.delay(300);

      return true;
    } catch (error) {
      return false;
    }
  }

  triggerAllEvents(element) {
    const events = [
      "input",
      "change",
      "blur",
      "focus",
      "keydown",
      "keyup",
      "click",
      "mousedown",
      "mouseup",
    ];

    events.forEach((eventType) => {
      element.dispatchEvent(
        new Event(eventType, {
          bubbles: true,
          cancelable: true,
        })
      );
    });

    // React-specific
    if (element.value !== undefined) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, element.value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }
  }

  triggerBasicEvents(element) {
    const events = ["input", "change", "blur"];
    events.forEach((eventType) => {
      element.dispatchEvent(
        new Event(eventType, {
          bubbles: true,
          cancelable: true,
        })
      );
    });
  }

  async checkFieldValidation(element, description) {
    await this.delay(300);

    // Check for various validation indicators
    const isInvalid = element.getAttribute("aria-invalid") === "true";
    const hasErrorClass =
      element.classList.contains("error") ||
      element.classList.contains("invalid");
    const errorMessage =
      document.querySelector(`#${element.id}_error`) ||
      element.parentElement.querySelector(".error-message");

    if (isInvalid || hasErrorClass || errorMessage) {
      element.focus();
      element.value = element.value; // Re-set the same value
      this.triggerAllEvents(element);
      element.blur();
      await this.delay(200);
    }
  }

  async triggerFinalValidation() {
    console.log("Triggering final validation...");

    const allInputs = document.querySelectorAll("input, select, textarea");
    allInputs.forEach((input) => {
      input.blur();
      this.triggerBasicEvents(input); // Use basic events for final validation
    });

    await this.delay(500);
    console.log("✅ Final validation triggered");
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const ptcAutofill = new PTCAutofill();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    ptcAutofill.fillAllFields().then(() => {
      sendResponse({ status: "success", message: "Form filling completed!" });
    });
    return true;
  }
});
