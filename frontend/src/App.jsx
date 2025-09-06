import { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    diet: "",
    allergies: "",
    calories: "",
    goals: "",
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlan(null);

    try {
      const response = await fetch("http://localhost:5000/api/mealplan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unknown server error");
      }

      setPlan(data.plan);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      alert("⚠️ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6e8ff] to-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center text-primary mb-4">
          🍴 AI Meal Planner
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Generate your personalized 7-day meal plan & shopping list
        </p>

        {/* Form */}
        <form className="grid gap-4 mb-8" onSubmit={handleSubmit}>
          {["diet", "allergies", "calories", "goals"].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={
                field === "diet"
                  ? "Diet type (e.g., vegetarian, keto)"
                  : field === "allergies"
                  ? "Allergies (comma separated)"
                  : field === "calories"
                  ? "Daily calorie goal"
                  : "Health goals (e.g., muscle gain)"
              }
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none shadow-sm"
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#080f4d] text-white py-3 rounded-xl font-semibold shadow-lg hover:opacity-90 transition border-2 border-[#dddee5]"
          >
            {loading ? "Generating..." : "Generate Meal Plan"}
          </button>
        </form>

        {/* Meal Plan Results */}
        {plan && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary">📅 Weekly Plan</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {plan.days.map((day, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl shadow-lg hover:shadow-2xl transition border-l-4 border-primary bg-gray-50"
                >
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {day.day}
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>
                      <span className="font-semibold">Breakfast:</span>{" "}
                      {day.breakfast}
                    </li>
                    <li>
                      <span className="font-semibold">Lunch:</span> {day.lunch}
                    </li>
                    <li>
                      <span className="font-semibold">Dinner:</span> {day.dinner}
                    </li>
                    <li>
                      <span className="font-semibold">Snack:</span> {day.snack}
                    </li>
                  </ul>
                </div>
              ))}
            </div>

            {/* Shopping List */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-3">
                🛒 Shopping List
              </h2>
              <ul className="grid md:grid-cols-2 gap-2 bg-gray-50 p-6 rounded-2xl shadow-inner">
                {plan.shopping_list.map((item, idx) => (
                  <li
                    key={idx}
                    className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
