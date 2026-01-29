import { useState } from "react";
import "./App.css";

export default function RamadanCalendar() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [timing, setTiming] = useState(null);
  const [error, setError] = useState("");

  const RAMADAN_START = new Date("2026-02-18");
  const RAMADAN_END = new Date("2026-03-19");

  const getTimings = async () => {
    setError("");
    setTiming(null);

    if (!city || !country || !date) {
      setError("Please fill all fields");
      return;
    }

    const selectedDate = new Date(date);

    // Ramadan ke bahar error show kare
    if (selectedDate < RAMADAN_START || selectedDate > RAMADAN_END) {
      setError("⚠️ Ramadan timings are only available between 18 Feb – 19 Mar 2026");
      return;
    }

    const formattedDate = date.split("-").reverse().join("-");

    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=${country}&method=2`
      );

      const data = await res.json();

      setTiming({
        sehri: data.data.timings.Fajr,
        iftari: data.data.timings.Maghrib,
      });
    } catch {
      setError("Failed to fetch timings");
    }
  };

  return (
    <div className="ramadan-container">
      <h1 className="ramadan-title">
        🌙 Ramadan Timings
        <span>Sehri & Iftari • 2026</span>
      </h1>

      <input
        type="text"
        placeholder="City (e.g. Karachi)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="text"
        placeholder="Country (e.g. Pakistan)"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      {/* Free date picker */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={getTimings}>Get Timings</button>

      {timing && (
        <div className="timing-card">
          <p>🌅 Sehri: <span>{timing.sehri}</span></p>
          <p>🌇 Iftari: <span>{timing.iftari}</span></p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
