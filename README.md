# Physiotherapist Profession Notification Dialog System

Web-based dialog system for the Greek public service "Αναγγελία Άσκησης Επαγγέλματος Φυσικοθεραπευτή". The system includes a questionnaire and FAQs in Greek and English. It informs citizens whether the selected answers satisfy the basic flow requirements and lists the documents and fees that follow from their answers.

## Requirements

To use and modify this project, you need the following:

- A modern web browser (Chrome, Firefox, Safari, etc.)
- Visual Studio Code (VSCode) or another code editor
- Live Server extension for VSCode \*\* (or an equivalent development server like Apache)
- Basic knowledge of HTML, CSS, and JavaScript

\*\* [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer): Go to the Extensions view by clicking on the Extensions icon in the Sidebar or pressing Ctrl+Shift+X. Search for "Live Server" and install the extension by Ritwick Dey (OR search with id = ritwickdey.LiveServer).

## Setup Instructions

### 1. Download the Repository

First, download this repository to your local machine.

### 2. Open the project folder in VSCode:

Open the project folder in VSCode and start the Live Server (click 'Go Live' at the bottom-right). You will see a port number, e.g., "Port:XXXX". Open the HTML file you want to preview in the browser using this port (e.g., http://localhost:5500/).

## Navigating the Project

The project structure is as follows:

```sh
project
│
├── index.html # Main HTML file
├── styles.css # Custom CSS styles
├── js/
│ ├── jquery-functions.js # Custom jQuery functions to fetch Questions, Evidences, FAQs and to handle answers in the questionnaire
│ └── change-language-functions.js # Language switch functions
├── question-utils/
│ ├── all-questions-en.json # runtime dialog flow in English
│ ├── all-questions.json # runtime dialog flow in Greek
│ ├── cpsv-en.json # evidences and fees in English
│ ├── cpsv.json # evidences and fees in Greek
│ ├── faq-en.json # FAQs in English
│ ├── faq.json # FAQs in Greek
├── data/
│ ├── llm-generated-dialog.json # Dialog that the LLM generated based on the api_data.json that was taken from Mitos API.
│ └── api-data.json # Mitos API data
├── bpmn/
│ ├── llm-generated-diagram.png # BPMN diagram that the LLM generated based on the ./data/llm-generated-dialog.json.
│ └── manual-diagram.png # BPMN diagram created manually after analyzing the Mitos Public Service.
└── README.md # Project documentation
```
