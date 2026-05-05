# MedSighter - Accessible Health Assistant

MedSighter is an accessibility-focused application designed to help visually impaired individuals manage their medicine safely. It uses AI to check medicine expiry dates and verify if pharmacist-dispensed medication matches a doctor's prescription.

## Features

- **Check Expiry**: Scan a medicine box to detect the expiry date and get an audio assessment.
- **Verify Match**: Scan a prescription and then a medicine package to ensure they match.
- **Voice Commands**: Hands-free operation with voice control.
  - "Start": Begin the welcome introduction.
  - "Option 1": Choose the Expiry check.
  - "Option 2": Choose the Match verification.
  - "Repeat": Hear the results again.
  - "Stop": Reset and go back to the home screen.
- **High Contrast UI**: Large buttons and bold text for easier visibility.

## Running Locally

To run this project on your own machine, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Google Gemini API Key

### Installation

1. **Clone or Download**: Export the project from AI Studio or clone the repository.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   - Create a file named `.env` in the root directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
5. **Open Browser**: Navigate to `http://localhost:3000` (or the port specified in your terminal).

### Deployment

Build the static site for production:
```bash
npm run build
```
The output will be in the `dist` directory.

## Technical Details

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 1.5 Flash (via `@google/genai`)
- **Speech**: Web Speech API (SpeechSynthesis and SpeechRecognition)
- **Icons**: Lucide React
- **Animations**: Motion
