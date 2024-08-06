import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInterest, user_interests } from "./api";
import Chip from "../components/Chips"; // Import the Chip component

// Define types for the fetched interests
type Interest = {
  interest_id: string;
  interest_name: string;
};

// Define the type for API response if needed
type ApiResponse = {
  data: Interest[]; // Array of Interest objects
  success?: boolean;
};

type ApiUserInterestsResponse = {
  success: boolean;
  message: string;
};

// Asynchronous function to fetch interests
const fetchInterests = async (): Promise<Interest[]> => {
  try {
    const response: ApiResponse = await getInterest();
    if (response.success) {
      return response.data;
    }
    throw new Error("Failed to fetch interests");
  } catch (error) {
    console.error("Error fetching interests:", error);
    return [];
  }
};

const Preferences: React.FC = () => {
  const [interests, setInterests] = useState<string[]>([]);
  const [allInterests, setAllInterests] = useState<Interest[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [step, setStep] = useState<number>(2); // Track the current step
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndSetInterests = async () => {
      const interestsData = await fetchInterests();
      console.log("Fetched interests:", interestsData); // Debugging output
      setAllInterests(interestsData);
    };

    fetchAndSetInterests();
  }, []);

  const handleInterestToggle = (interestId: string) => {
    setInterests((prev) => {
      if (prev.includes(interestId)) {
        return prev.filter((i) => i !== interestId);
      } else {
        return [...prev, interestId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError("User ID is missing");
      return;
    }

    if (interests.length < 2) {
      // Ensure at least two interests are selected
      setError("Please select at least two interests.");
      return;
    }

    try {
      const response: ApiUserInterestsResponse = await user_interests(
        userId,
        interests
      );
      if (response.success) {
        setSuccess(true);
        setStep(3); // Move to step 3 only on successful submission
      } else {
        setError(response.message || "Failed to save preferences");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-6 px-4">
      <div className="w-full max-w-md">
        <div className="border border-gray-200  shadow-sm mb-8  bg-white rounded-lg">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex-1 text-center border-r border-gray-200 py-4">
              <div className="flex items-center justify-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${step > 1 ? 'bg-purple-600 text-white' : 'border-2 border-gray-300 text-gray-300'}`}>
                  {step > 1 ? '✓' : '01'}
                </div>
              </div>
              <div className="mt-2">
                <p className={`text-sm font-medium ${step > 1 ? 'text-gray-900' : 'text-gray-500'}`}>Sign Up</p>
                
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex-1 text-center border-r border-gray-200 py-4">
              <div className="flex items-center justify-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${step > 2 ? 'bg-purple-600 text-white' : step === 2 ? 'border-2 border-purple-600 text-purple-600' : 'border-2 border-gray-300 text-gray-300'}`}>
                  {step > 2 ? '✓' : '02'}
                </div>
              </div>
              <div className="mt-2">
                <p className={`text-sm font-medium ${step === 2 ? 'text-purple-600' : step > 2 ? 'text-gray-900' : 'text-gray-500'}`}>Select Interests</p>
                
              </div>
              {step === 2 && <div className="w-full h-1 bg-purple-600 mt-2"></div>}
            </div>

            {/* Step 3 */}
            <div className="flex-1 text-center py-4">
              <div className="flex items-center justify-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${step === 3 ? 'border-2 border-purple-600 text-purple-600' : 'border-2 border-gray-300 text-gray-300'}`}>
                  03
                </div>
              </div>
              <div className="mt-2">
                <p className={`text-sm font-medium ${step === 3 ? 'text-purple-600' : 'text-gray-500'}`}>Finish</p>
                
              </div>
              {step === 3 && <div className="w-full h-1 bg-purple-600 mt-2"></div>}
            </div>
          </div>
        </div>
      </div>

      {step === 2 && (
        <div className="w-full max-w-md">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              Tell us about your interests
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium leading-6 text-gray-900">
                  Select your interests
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allInterests.map((interest) => (
                    <Chip
                      key={interest.interest_id}
                      label={interest.interest_name}
                      selected={interests.includes(interest.interest_id)}
                      onClick={() => handleInterestToggle(interest.interest_id)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Next
                </button>
              </div>
            </div>
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          </div>
        </div>
      )}

      {step === 3 && success && (
        <div className="w-full max-w-md">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Interest Saved!</h2>
            <p className="text-lg mb-6">
              Thank you for providing your interests. You are all set!
            </p>
            <button
              onClick={handleFinish}
              className="w-full rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Finish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preferences;
