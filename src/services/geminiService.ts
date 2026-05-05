/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ExpiryResult {
  medicineName: string;
  expiryDate: string;
  isExpired: boolean;
  message: string;
}

export interface VerificationResult {
  prescriptionMedicine: string;
  actualMedicine: string;
  isMatch: boolean;
  discrepancies?: string;
  dosageMatch: boolean;
  instructions: string;
}

export const analyzeExpiry = async (imageBase64: string): Promise<ExpiryResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64,
          },
        },
        {
          text: `Analyze this medicine packaging carefully. 
          1. Identify the medicine name from BOLD prominent text.
          2. Locate Manufacturing (MFG) date and Expiry (EXP) date.
          3. CRITICAL: Distinguish between MFG and EXP. Do not confuse them. 
          4. SHELF LIFE CALCULATION: 
             - If you see "Mfg. Date" (e.g., 06/25) AND "Use Before X months" (e.g., 24 months), you MUST calculate the expiry date.
             - Calculation: MFG Date + X months = Calculated Expiry Date.
             - Example: 06/2025 + 24 months = 06/2027.
          5. If an explicit "EXP" date is present, use that. If not, use your calculated date.
          6. DO NOT mention the Manufacturing date in your final message. Only mention the final expiry date.
          7. Today's date is ${new Date().toISOString().split('T')[0]}.
          
          EXPIRY RULES:
          - A product with expiry "05/2026" is safe until May 31st, 2026.
          - It is ONLY expired if today is past that last day.
          
          Return as JSON.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medicineName: { type: Type.STRING, description: "The prominent bold name found on the package" },
          expiryDate: { type: Type.STRING, description: "The EXPIRY date. If calculated from MFG, provide the result. Example: '05/2026'." },
          isExpired: { type: Type.BOOLEAN },
          message: { type: Type.STRING, description: "Clear audio instruction. Mention the medicine name and its expiry status. If calculated, say 'expires at the end of [month] [year]'. Do NOT mention the manufacturing date." }
        },
        required: ["medicineName", "expiryDate", "isExpired", "message"]
      },
    },
  });

  return JSON.parse(response.text);
};

export const verifyPrescription = async (
  prescriptionBase64: string,
  medicineBase64: string
): Promise<VerificationResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: prescriptionBase64,
          },
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: medicineBase64,
          },
        },
        {
          text: `Compare these two images:
          Image 1: A doctor's prescription.
          Image 2: The actual medicine packaging provided.
          
          Verify if the medicine in Image 2 matches what was prescribed in Image 1.
          Check the name, dosage (e.g. 500mg), and form (tablet/syrup).
          
          Return as JSON.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prescriptionMedicine: { type: Type.STRING },
          actualMedicine: { type: Type.STRING },
          isMatch: { type: Type.BOOLEAN },
          discrepancies: { type: Type.STRING },
          dosageMatch: { type: Type.BOOLEAN },
          instructions: { type: Type.STRING, description: "Clear audio-friendly instructions. YOU MUST MENTION THE MEDICINE NAME CLEARLY. Example: 'Success! The medicine matches your prescription for [Medicine Name]. Take one tablet twice a day as per instructions.'" }
        },
        required: ["prescriptionMedicine", "actualMedicine", "isMatch", "dosageMatch", "instructions"]
      },
    },
  });

  return JSON.parse(response.text);
};
