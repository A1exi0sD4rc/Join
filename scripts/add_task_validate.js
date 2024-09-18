function validateTitle() {
  const titleInput = document.getElementById("aT_title");
  const titleError = document.getElementById("titleError");

  titleInput.addEventListener("input", () => {
    titleInput.classList.remove("invalid");
    titleError.classList.remove("error-show");
  });
  if (titleInput.value.trim() === "") {
    titleInput.classList.add("invalid");
    titleError.classList.add("error-show");
    return false;
  }
  return true;
}

function validateDate() {
  const dateInput = document.getElementById("aT_date");
  const dateError = document.getElementById("dateError");

  dateInput.addEventListener("input", () => {
    dateInput.classList.remove("invalid");
    dateError.classList.remove("error-show");
  });
  if (dateInput.value === "") {
    dateInput.classList.add("invalid");
    dateError.classList.add("error-show");
    return false;
  }
  return true;
}

// Funktion zum Überprüfen der Kategorie
function validateCategory() {
  const categoryDiv = document.getElementById("aT_select_category");
  const categoryError = document.getElementById("categoryError");

  if (categoryDiv.innerText.trim() === "Select task category") {
    categoryDiv.classList.add("invalid");
    categoryError.classList.add("error-show");
    return false;
  } else {
    categoryDiv.classList.remove("invalid");
    categoryError.classList.remove("error-show");
    return true;
  }
}

function validateForm() {
  const isTitleValid = validateTitle();
  const isDateValid = validateDate();
  const isCategoryValid = validateCategory();

  // Clear the red border and error message for category when it is valid
  const categoryDiv = document.getElementById("aT_select_category");
  const categoryError = document.getElementById("categoryError");

  if (isCategoryValid) {
    categoryDiv.classList.remove("invalid");
    categoryError.classList.remove("error-show");
  }

  // If all fields are valid, execute addTaskToDatabase()
  if (isTitleValid && isDateValid && isCategoryValid) {
    addTaskToDatabase();
  }
}
