import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const VoiceSearchButton = ({ onTranscript }) => {
  const { showToast } = useToast();
  const [listening, setListening] = useState(false);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice search is not supported in this browser. Please type your query.', 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
        showToast('Listening... Speak your shopping request', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setListening(false);
        if (transcript && onTranscript) {
          showToast(`Heard: "${transcript}"`, 'success');
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event) => {
        setListening(false);
        showToast(`Voice input error: ${event.error}`, 'error');
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (err) {
      setListening(false);
      showToast('Could not access microphone', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={startVoiceRecognition}
      className={`p-2.5 rounded-xl border font-bold flex items-center justify-center transition-all cursor-pointer ${
        listening
          ? 'bg-rose-50 border-rose-300 text-[#D32F2F] animate-pulse'
          : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
      }`}
      title="Search by Voice"
    >
      {listening ? <MicOff className="w-4 h-4 text-[#D32F2F]" /> : <Mic className="w-4 h-4 text-[#2874F0]" />}
    </button>
  );
};

export default VoiceSearchButton;
