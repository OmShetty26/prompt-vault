# PromptVault Client
A React-based frontend client for organizing, categorizing, and retrieving LLM prompts. This UI serves as the presentation layer for the PromptVault full-stack architecture.


*The FastAPI backend repository for this project is located [here](https://github.com/OmShetty26/prompt-vault-backend).*

## Tech Stack
* **Framework:** React + Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router DOM

## Architecture & Features
* **Master-Detail Interface:** Implements a dual-pane layout with independent sidebar scrolling to ensure the main workspace remains static during navigation.
* **Complex State Management:** Groups related input fields (Title, Category, Content) into single React state objects to ensure predictable data payloads.
* **Asynchronous Hydration:** Utilizes `useEffect` hooks to fetch and populate the interface with data from the REST API immediately upon mounting.
* **Decoupled Architecture:** Built as a standalone client to allow for independent deployment (e.g., Vercel) from the backend API.

## Local Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/OmShetty26/prompt-vault.git](https://github.com/OmShetty26/prompt-vault.git)
   cd prompt-vault

2. Install dependencies:
    ```bash
    npm install

3. Start the development server:
    ```bash
    npm run dev

4. Open [http://localhost:5173](http://localhost:5173) in your browser. (Note: Ensure the backend API is running concurrently to fetch saved prompts).