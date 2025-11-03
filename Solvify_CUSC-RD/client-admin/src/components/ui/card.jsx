// src/components/ui/card.jsx
export function Card({ children }) {
  return <div className="rounded-lg shadow bg-white p-4">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
