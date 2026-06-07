import { Send } from "lucide-react";

export default function WhatsAppButton() {
  const username = "AlphaWaveSupport"; // Replace with your Telegram username or bot
  const message = "Hello, I need assistance with my AlphaWave Markets account.";
  const url = `https://t.me/${username}?text=${encodeURIComponent(message)}`;

  return (
    
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-20 z-50 bg-[#229ED9] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group"
      aria-label="Contact Support on Telegram"
    >
      <Send className="w-6 h-6 fill-white" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
        Support
      </span>
    </a>
  );
}
