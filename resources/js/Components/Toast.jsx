import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", duration = 3000 }) {
  const [show, setShow] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  if (!show || !message) return null;

  const colors =
    type === "success"
      ? "bg-green-600 text-white"
      : "bg-red-600 text-white";

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`px-4 py-3 rounded-xl shadow-lg ${colors}`}>
        {message}
      </div>
    </div>
  );
}
