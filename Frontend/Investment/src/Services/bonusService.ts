// src/services/bonusService.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/bonus";
const token = "9b1f5e5a7d2e3d5e6b7a2c9d4a7b8e1c8f6d5e2c3f8e7a6c9b4f3a2c1d9e4f5";

export const generateBonusCode = (
  discountPercentage: number,
  expirationDate: string,
  tokenPrice: number,
  tokenCount: number // Include token count in the request
) => {
  return axios.post(`${API_URL}/generate`, {
    discountPercentage,
    expirationDate,
    tokenPrice,
    tokenCount, // Send token count along with the request
  },
  {
    headers: {
      Authorization: `Bearer ${token}`, // Add token to Authorization header
    },
  }
);
};

export const getAllBonusCodes = () => {

  return axios.get(`${API_URL}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const toggleBonusCodeStatus = async (
  codeId: string,
  active: boolean
) => {

  return axios.post(
    `${API_URL}/toggle`,
    { codeId, active },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getBonusHistory = (codeId: string) => {

  return axios.get(`${API_URL}/history/${codeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
