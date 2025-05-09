// components/common/ErrorAlert.tsx
"use client";
export default function ErrorAlert({ message }: { message: string }) {
  if (!message) return null;

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong className="font-bold">Lỗi: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
}
