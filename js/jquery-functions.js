$("document").ready(function () {
  var currentQuestionId = 1;
  var answerHistory = [];
  var selectedEvidenceIds = [];
  var all_questions;
  var all_questions_en;
  var all_evidences;
  var all_evidences_en;
  var faq;
  var faq_en;

  function hideFormBtns() {
    $("#nextQuestion").hide();
    $("#backButton").hide();
  }

  function getQuestions() {
    return fetch("question-utils/all-questions.json")
      .then((response) => response.json())
      .then((data) => {
        all_questions = data;

        return fetch("question-utils/all-questions-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_questions_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch all-questions-en.json:", error);
            $(".question-container").html(
              "Error: Failed to fetch all-questions-en.json."
            );
            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch all-questions.json:", error);
        $(".question-container").html(
          "Error: Failed to fetch all-questions.json."
        );
        hideFormBtns();
      });
  }

  function getEvidences() {
    return fetch("question-utils/cpsv.json")
      .then((response) => response.json())
      .then((data) => {
        all_evidences = data;

        return fetch("question-utils/cpsv-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            all_evidences_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch cpsv-en.json:", error);
            $(".question-container").html("Error: Failed to fetch cpsv-en.json.");
            hideFormBtns();
          });
      })
      .catch((error) => {
        console.error("Failed to fetch cpsv.json:", error);
        $(".question-container").html("Error: Failed to fetch cpsv.json.");
        hideFormBtns();
      });
  }

  function getFaq() {
    return fetch("question-utils/faq.json")
      .then((response) => response.json())
      .then((data) => {
        faq = data;

        return fetch("question-utils/faq-en.json")
          .then((response) => response.json())
          .then((dataEn) => {
            faq_en = dataEn;
          })
          .catch((error) => {
            console.error("Failed to fetch faq-en.json:", error);
            $(".question-container").html("Error: Failed to fetch faq-en.json.");
          });
      })
      .catch((error) => {
        console.error("Failed to fetch faq.json:", error);
        $(".question-container").html("Error: Failed to fetch faq.json.");
      });
  }

  function getActiveQuestions() {
    return currentLanguage === "greek" ? all_questions : all_questions_en;
  }

  function getActiveEvidences() {
    return currentLanguage === "greek" ? all_evidences : all_evidences_en;
  }

  function getQuestionById(questionId) {
    return getActiveQuestions().find((question) => question.id === questionId);
  }

  function getEvidenceById(evidenceId) {
    return getActiveEvidences().PublicService.evidence.find(
      (evidence) => evidence.id === evidenceId
    );
  }

  function setNextButtonLabel(isSubmit) {
    var label = isSubmit
      ? currentLanguage === "greek"
        ? "Υποβολή"
        : "Submit"
      : languageContent[currentLanguage].nextQuestion;
    $("#nextQuestion span").text(label);
  }

  function addEvidenceIds(evidenceIds) {
    if (!evidenceIds) return;

    evidenceIds.forEach((evidenceId) => {
      if (!selectedEvidenceIds.includes(evidenceId)) {
        selectedEvidenceIds.push(evidenceId);
      }
    });
  }

  function removeEvidenceIds(evidenceIds) {
    if (!evidenceIds) return;

    evidenceIds.forEach((evidenceId) => {
      selectedEvidenceIds = selectedEvidenceIds.filter((id) => id !== evidenceId);
    });
  }

  function loadFaqs() {
    var faqData = currentLanguage === "greek" ? faq : faq_en;
    var faqTitle =
      currentLanguage === "greek"
        ? "Συχνές Ερωτήσεις"
        : "Frequently Asked Questions";

    var faqElement = document.createElement("div");

    faqElement.innerHTML = `
      <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
        ${faqTitle}
      </div>
    `;

    var ft = 16;
    faqData.forEach((faqItem) => {
      var faqSection = document.createElement("details");
      faqSection.className = "govgr-accordion__section";
      faqSection.tabIndex = ft;

      faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
            ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

      faqElement.appendChild(faqSection);
      ft++;
    });

    $(".faqContainer").html(faqElement);
  }

  function convertURLsToLinks(text) {
    return text.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$&" target="_blank" rel="noreferrer noopener">$&</a>'
    );
  }

  function renderOptions(question, selectedOptionId) {
    return question.options
      .map(
        (option) => `
          <div class='govgr-radios__item'>
            <label class='govgr-label govgr-radios__label'>
              ${option.option_text}
              <input class='govgr-radios__input' type='radio' name='question-option' value='${option.id}' ${
          selectedOptionId === option.id ? "checked" : ""
        } />
            </label>
          </div>
        `
      )
      .join("");
  }

  function loadQuestion(questionId, noError, selectedOptionId) {
    var question = getQuestionById(questionId);

    if (!question) {
      $(".question-container").html(
        currentLanguage === "greek"
          ? "Δεν βρέθηκε η ερώτηση."
          : "Question not found."
      );
      hideFormBtns();
      return;
    }

    currentQuestionId = questionId;
    $("#nextQuestion").show();
    answerHistory.length > 0 ? $("#backButton").show() : $("#backButton").hide();
    setNextButtonLabel(question.options.some((option) => option.eligible));

    var questionElement = document.createElement("div");
    var errorHtml = "";

    if (!noError) {
      errorHtml = `
        <legend class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
          ${languageContent[currentLanguage].chooseAnswer}
        </legend>
        <p class='govgr-hint language-component' data-component='oneAnswer'>
          ${languageContent[currentLanguage].oneAnswer}
        </p>
        <p class='govgr-error-message'>
          <span class='govgr-visually-hidden language-component' data-component='errorAn'>
            ${languageContent[currentLanguage].errorAn}
          </span>
          <span class='language-component' data-component='choose'>
            ${languageContent[currentLanguage].choose}
          </span>
        </p>
      `;
    }

    questionElement.innerHTML = `
      <div class='govgr-field ${noError ? "" : "govgr-field__error"}'>
        <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
          <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
            ${question.question}
          </legend>
          ${errorHtml}
          <div class='govgr-radios' id='radios-${questionId}'>
            ${renderOptions(question, selectedOptionId)}
          </div>
        </fieldset>
      </div>
    `;

    $(".question-container").html(questionElement);
  }

  function getSelectedOption() {
    var selectedOptionId = Number($('input[name="question-option"]:checked').val());
    var question = getQuestionById(currentQuestionId);
    return question.options.find((option) => option.id === selectedOptionId);
  }

  function showIneligible(message) {
    const errorEnd = document.createElement("div");
    const title =
      currentLanguage === "greek"
        ? "Δεν είστε επιλέξιμος/η για την υπηρεσία."
        : "You are not eligible for this service.";
    errorEnd.className = "govgr-error-summary";
    errorEnd.innerHTML = `<h1 class='govgr-heading-m'>${title}</h1><p>${message}</p>`;
    $(".question-container").html(errorEnd);
    hideFormBtns();
  }

  function appendEvidenceList() {
    const evidenceListElement = document.createElement("ol");
    evidenceListElement.setAttribute("id", "evidences");
    $(".question-container").append(evidenceListElement);

    selectedEvidenceIds.forEach((evidenceId) => {
      const evidence = getEvidenceById(evidenceId);
      if (!evidence) return;

      evidence.evs.forEach((evsItem) => {
        const listItem = document.createElement("li");
        listItem.textContent = evsItem.name;
        evidenceListElement.appendChild(listItem);
      });
    });
  }

  function submitForm(message) {
    const resultWrapper = document.createElement("div");
    const titleText =
      currentLanguage === "greek"
        ? "Είστε επιλέξιμος/η!"
        : "You are eligible!";
    const resultText =
      message ||
      (currentLanguage === "greek"
        ? "Πληρούνται οι βασικές προϋποθέσεις της ροής."
        : "The basic requirements of this flow are met.");
    resultWrapper.innerHTML = `<h1 class='answer'>${titleText}</h1><h5>${resultText}</h5>`;
    resultWrapper.setAttribute("id", "resultWrapper");
    $(".question-container").html(resultWrapper);

    currentLanguage === "greek"
      ? $(".question-container").append(
          "<br /><br /><h5 class='answer'>Τα δικαιολογητικά και τέλη που προκύπτουν από τις απαντήσεις σας είναι τα εξής:</h5><br />"
        )
      : $(".question-container").append(
          "<br /><br /><h5 class='answer'>The documents and fees resulting from your answers are the following:</h5><br />"
        );

    appendEvidenceList();
    hideFormBtns();
  }

  $("#startBtn").click(function () {
    sessionStorage.clear();
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  $("#nextQuestion").click(function () {
    if (!$(".govgr-radios__input").is(":checked")) {
      loadQuestion(currentQuestionId, false);
      return;
    }

    var selectedOption = getSelectedOption();
    addEvidenceIds(selectedOption.evidence_ids);

    answerHistory.push({
      questionId: currentQuestionId,
      optionId: selectedOption.id,
      evidenceIds: selectedOption.evidence_ids || [],
    });

    sessionStorage.setItem(
      "answer_" + currentQuestionId,
      JSON.stringify(selectedOption)
    );

    if (selectedOption.terminate) {
      selectedOption.eligible
        ? submitForm(selectedOption.termination_reason)
        : showIneligible(selectedOption.termination_reason);
      return;
    }

    loadQuestion(selectedOption.next_step, true);
  });

  $("#backButton").click(function () {
    if (answerHistory.length === 0) return;

    var previousAnswer = answerHistory.pop();
    removeEvidenceIds(previousAnswer.evidenceIds);
    sessionStorage.removeItem("answer_" + previousAnswer.questionId);
    loadQuestion(previousAnswer.questionId, true, previousAnswer.optionId);
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    loadQuestion(currentQuestionId, true);
  });

  $("#questions-btns").hide();

  getQuestions().then(() => {
    getEvidences().then(() => {
      getFaq().then(() => {
        loadFaqs();
        $("#faqContainer").show();
        loadQuestion(currentQuestionId, true);
      });
    });
  });
});
