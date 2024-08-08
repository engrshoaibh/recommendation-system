import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Replace with your Flask backend URL

// Function to register a user
export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Function to login a user
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};


export const getInterest = async () => {
  try {
    const response = await axios.get(`${API_URL}/interests`);
    return response.data;
  } catch (error) {
    console.error('Error get the interests:', error);
    throw error;
  }
};

export const user_interests = async (userId: string, interests: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/user_interests`, {
      user_id: userId,
      interests: interests,
    });
    return response.data;
  } catch (error) {
    console.error('Error in saving the interests', error);
    return {
      success: false,
      message: 'An error occurred while saving interests',
    };
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error get the Products:', error);
    throw error;
  }
};
export const getRecommendedProducts = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/recommendations/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error get the Recommendations:', error);
    throw error;
  }
};
