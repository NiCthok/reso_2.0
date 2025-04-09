import axios from "axios";
import { useEffect, useState } from "react";
import Pdf from "../Utils/Pdf"; // Adjust if your path is different

type RegisteredEvent = {
  event: {
    event: string;
    date: string;
    fee: number;
    desctiption?: string;
  };
  user: {
    email: string;
  };
  name: string;
  contact: string;
  address: string;
  transactionId: string;
  bankingName: string;
  approved: boolean;
  team?: {
    teamName: string;
    players: {
      name: string;
      gender: string;
      teamLeader?: boolean;
    }[];
  };
  individual?: boolean;
  createdAt: string;
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="mb-1">
    <span className="font-semibold text-gray-300">{label}</span>
    <span className="ml-1 text-gray-100">{value}</span>
  </div>
);

const Button = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    {label}
  </button>
);

const EventRegistered = () => {
  const [eventsRegistered, setEventsRegistered] = useState<RegisteredEvent[]>([]);
  const [selectedItem, setSelectedItem] = useState<RegisteredEvent | null>(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      const token = localStorage.getItem("Authorization");
      if (!token) {
        console.warn("No auth token found");
        return;
      }
      try {
        const response = await axios.get("http://localhost:4000/users/registered", {
          headers: {
            Authorization: token,
          },
        });
        setEventsRegistered(response.data.registeredDetails);
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchRegisteredEvents();
  }, []);

  return (
    <div className="p-4">
      {selectedItem && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/70 z-50 flex items-center justify-center overflow-auto p-4">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 right-2 text-black bg-red-500 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
            <Pdf item={selectedItem} />
          </div>
        </div>
      )}

      {eventsRegistered && eventsRegistered.length > 0 ? (
        eventsRegistered.map((item, index) => (
          <div
            key={index}
            className="mb-4 p-4 bg-zinc-800 rounded-md shadow-md shadow-red-500/30"
          >
            <h3 className="text-red-500 font-bold text-xl text-center mb-4">
              {item.event?.event.toUpperCase() || "Event Name N/A"}
            </h3>

            <InfoRow
              label="📅 Date of Registration:"
              value={
                new Date(item.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                }) || "No date"
              }
            />
            <InfoRow label="📧 Email:" value={item.user?.email || "N/A"} />
            <InfoRow
              label="🙍‍♂️ Name:"
              value={
                item.individual
                  ? item.name || "No name"
                  : item.team?.teamName || "No team name"
              }
            />
            <InfoRow
              label="💳 Transaction ID:"
              value={item.transactionId || "N/A"}
            />
            <InfoRow
              label="🧾 Banking Name:"
              value={item.bankingName || "N/A"}
            />
            <InfoRow
              label="✅ Status:"
              value={item.approved ? "Approved" : "Pending"}
            />

            <div className="flex justify-end mt-3">
              <Button label="Download" onClick={() => setSelectedItem(item)} />
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No events registered yet.</p>
      )}
    </div>
  );
};

export default EventRegistered;
