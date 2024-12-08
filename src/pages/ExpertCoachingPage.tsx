import React, { useState, useEffect } from 'react';
import { PhoneCall, MessageCircle, Crown, ArrowRight, Bot, Mic, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../store/subscriptionStore';

declare global {
  interface Window {
    PlayAI?: {
      open: (id: string) => void;
    };
  }
}

export function ExpertCoachingPage() {
  const navigate = useNavigate();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan !== 'hobby';
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isSubscribed) {
      navigate('/pricing');
      return;
    }

    // Add the PlayAI script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@play-ai/web-embed';
    script.async = true;
    document.head.appendChild(script);

    // Add the initialization script
    const initScript = document.createElement('script');
    initScript.textContent = `
      addEventListener("load", () => { 
        PlayAI.open('AVRe8N5e2Qj-EgOD8NeaC');
      });
    `;
    document.head.appendChild(initScript);

    // Cleanup
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(initScript);
    };
  }, [isSubscribed, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // TODO: Implement chat functionality
    setMessage('');
  };

  if (!isSubscribed) {
    return null; // Navigation will handle redirect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="w-8 h-8 text-bonsai-green" />
            <h1 className="text-3xl font-bold text-bonsai-bark dark:text-white">AI Expert Coaching</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Get instant guidance powered by Ken Nakamura's expert knowledge through voice or chat.
          </p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4 flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-bonsai-green" />
              <span>Chat Assistant</span>
            </h2>
            <div className="bg-stone-50 dark:bg-stone-800 rounded-lg p-4 h-96 mb-4 overflow-y-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex items-start space-x-2">
                  <Bot className="w-6 h-6 text-bonsai-green flex-shrink-0 mt-1" />
                  <div className="bg-white dark:bg-stone-700 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Hello! I'm your AI bonsai assistant, trained on Ken Nakamura's expertise. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-600 focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green bg-white dark:bg-stone-800"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-bonsai-green text-white rounded-lg hover:bg-bonsai-moss transition-colors flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-semibold text-bonsai-bark dark:text-white mb-4">Features</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Bot className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-bonsai-bark dark:text-white">AI-Powered Expertise</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get instant answers from an AI trained on Ken Nakamura's extensive bonsai knowledge.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mic className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-bonsai-bark dark:text-white">Voice Interaction</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Have natural conversations about your bonsai care questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-bonsai-green flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-bonsai-bark dark:text-white">24/7 Chat Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get answers to your questions anytime through our chat interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
