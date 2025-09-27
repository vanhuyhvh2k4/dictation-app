import { useEffect, useState } from "react";
import API from "../api/api";

export default function WordList() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    API.get("/words").then((res) => setWords(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Words</h1>
      <ul className="space-y-2">
        {words.map((w) => (
          <li key={w.id} className="p-3 bg-white shadow rounded">
            <b>{w.word}</b>: {w.meaning}
            <p className="text-sm italic">{w.example}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
