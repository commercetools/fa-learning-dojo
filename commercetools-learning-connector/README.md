commercetools Learning Connector – Merchant Center Custom App

Overview
The Learning Connector is a custom Merchant Center application that guides participants through a series of hands-on training sessions. It tracks each learner’s progress (key decisions, quizzes, case studies, notes), and provides a Trainer Dashboard to monitor and reset progress.

Pre-requisites
Before installing and using the app, you’ll need:

- A Commercetools Project
- Node.js ≥ 16 and Yarn (or npm) installed locally

Installation Steps
  - Clone the repository
    git clone https://github.com/your-org/learning-dojo.git
  
  - cd learning-dojo
  - Install dependencies
  - yarn install
  - Configure environment variables
  - Create a file named .env in the project root with at least:
      MC_API_URL=https://mc-api.europe-west1.gcp.commercetools.com
      CT_PROJECT_KEY=<your-project-key>
  - Build and deploy

Local development:
  - yarn start
  - Exposes http://localhost:3000

Production build & deploy:

  - yarn build

