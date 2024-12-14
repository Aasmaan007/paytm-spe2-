import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const SendMoney = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    // Check if token exists in local storage
    if (!userToken) {
      navigate("/signin"); // Redirect to sign-in page if token doesn't exist
    }
  }, []);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState(""); // Add state for the note
  // const [sentiment, setSentiment] = useState(null); // To store sentiment result

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name && name.length > 0 && name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  id="amount"
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Note</label>
              <textarea
                onChange={(e) => setNote(e.target.value)}
                value={note}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                id="note"
                placeholder="Add a note with your transaction"
              />
            </div>

              <button
                onClick={async () => {
                  try {
                    const backendurl = import.meta.env.REACT_APP_BACKEND_URL || "http://192.168.49.2:31720"; 
                    const res = await axios.post(
                      backendurl + "/api/v1/account/transfer",
                      {
                        to: id,
                        amount,
                        note
                      },
                      {
                        headers: {
                          Authorization: "Bearer " + localStorage.getItem("token"),
                        },
                      }
                    );

                    // Navigate on success
                    // navigate("/paymentstatus?message=" + res?.data.message);
                    navigate("/paymentstatus?message=" + res?.data.message + "&sentiment=" + res?.data.sentiment + "&feedback=" + res?.data.feedback);

                  } catch (error) {
                    // Handle error response
                    if (error.response) {
                      // Server responded with a status other than 2xx
                      console.error("Error Response:", error.response.data);
                      alert(error.response.data.message); // Display the error message to the user
                    } else if (error.request) {
                      // Request was made but no response received
                      console.error("Error Request:", error.request);
                      alert("No response from the server. Please try again later.");
                    } else {
                      // Something else caused the error
                      console.error("Error Message:", error.message);
                      alert("An unexpected error occurred. Please try again.");
                    }
                  }
                }}
                 className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Transfer
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-red-500 text-white"
              >
                Cancel & Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
