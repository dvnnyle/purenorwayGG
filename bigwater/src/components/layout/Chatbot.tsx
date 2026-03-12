'use client';

import { useState, useEffect, useRef } from 'react';
import { IoClose, IoChatbubble, IoPaperPlane } from 'react-icons/io5';
import Fuse from 'fuse.js';
import './Chatbot.css';
import {
  CASUAL_SHORTCUT_RESPONSES,
  CONTACT_FILTER_TERMS,
  GREETINGS,
  HQ_KEYWORDS,
  KEYWORDS,
  PARTNERSHIP_FILTER_TERMS,
  REGIONAL_KEYWORDS,
  NORWAY_FILTER_TERMS,
  CONTACT_FORM_TERMS,
  CREDITS_FILTER_TERMS,
  DIRECT_CREDITS_KEYWORDS,
  SOCIAL_FILTER_TERMS,
  TEXT_NORMALIZATION_RULES,
  CONTENT_FILTER_PATTERNS,
  matchesTermWithBoundary,
  containsOffensiveLanguage,
} from './chatbotConfig';

interface QA {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  suggestions?: Array<{ text: string; id: number }>;
}

interface ChatbotData {
  brand: string;
  qa: QA[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ChatbotData | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'bot',
      text: 'Hi I\'m the PURENorway Assistant! I will answer frequently asked questions. Ask me anything! If I can\'t answer your question, navigate to our contact page 📧',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fuse = useRef<Fuse<QA> | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/purenorway_chatbot_qa.json');
        const jsonData: ChatbotData = await response.json();
        setData(jsonData);

        // Initialize Fuse for fuzzy search
        const fuseInstance = new Fuse(jsonData.qa, {
          keys: ['question', 'answer'],
          threshold: 0.4,
          minMatchCharLength: 2,
        });
        fuse.current = fuseInstance;
      } catch (error) {
        console.error('Failed to load chatbot data:', error);
      }
    };

    loadData();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderTextWithLinks = (text: string) => {
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(linkRegex);

    return parts.map((part, index) => {
      const isLink = /^(https?:\/\/|www\.)/i.test(part);
      if (!isLink) {
        return <span key={`text-${index}`}>{part}</span>;
      }

      const href = part.startsWith('www.') ? `https://${part}` : part;
      return (
        <a
          key={`link-${index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {part}
        </a>
      );
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !fuse.current || !data) return;

    // Check for offensive language
    const lowerInput = inputValue.toLowerCase();
    if (containsOffensiveLanguage(lowerInput)) {
      // Show error message instead of sending
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: '⚠️ Your message contains offensive language and cannot be sent. Please keep the conversation respectful. 😊',
      };
      setMessages((prev) => [...prev, botMessage]);
      setInputValue('');
      setIsLoading(false);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot thinking
    setTimeout(() => {
      const normalizedInput = TEXT_NORMALIZATION_RULES.reduce(
        (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
        lowerInput
      );
      
      // Sanitize offensive language by replacing with asterisks
      let sanitizedInput = normalizedInput;
      for (const pattern of CONTENT_FILTER_PATTERNS) {
        sanitizedInput = sanitizedInput.replace(pattern, (match) => '*'.repeat(match.length));
      }
      
      let botResponse = '';

      const sendFilterButtons = (text: string, suggestions: Array<{ text: string; id: number }>) => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text,
          suggestions,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      };

      // If user types '@', offer quick contact intent buttons.
      if (sanitizedInput.includes('@')) {
        sendFilterButtons('I can help with that. Choose one option:', [
          { text: 'Email Contact', id: 34 },
          { text: 'Socials', id: 71 },
        ]);
        return;
      }

      // Fast path for casual short acronyms and chat slang.
      const compactInput = sanitizedInput.trim();
      if (CASUAL_SHORTCUT_RESPONSES[compactInput]) {
        botResponse = CASUAL_SHORTCUT_RESPONSES[compactInput];
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: botResponse,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // Quick contact filter for short, single-word queries.
      if (CONTACT_FILTER_TERMS.some((term) => matchesTermWithBoundary(sanitizedInput, term))) {
        sendFilterButtons('Contact support selected. What do you need?', [
          { text: 'Email & Phone Contact', id: 34 },
          { text: 'Headquarters Address', id: 4 },
          { text: 'Socials', id: 71 },
        ]);
        return;
      }

      // Social filter for short platform-related queries.
      if (SOCIAL_FILTER_TERMS.some((term) => matchesTermWithBoundary(sanitizedInput, term))) {
        sendFilterButtons('Social selected. Pick a platform:', [
          { text: 'All Social Links', id: 71 },
          { text: 'Main Handle', id: 78 },
          { text: 'Instagram', id: 75 },
          { text: 'TikTok', id: 76 },
          { text: 'Snapchat', id: 72 },
          { text: 'LinkedIn', id: 73 },
          { text: 'Facebook', id: 74 },
          { text: 'X (Twitter)', id: 77 },
        ]);
        return;
      }

      // Partnership filter for business intent.
      if (PARTNERSHIP_FILTER_TERMS.some((term) => matchesTermWithBoundary(sanitizedInput, term))) {
        sendFilterButtons('Partnership selected. Choose an option:', [
          { text: 'Affiliate / Ambassador', id: 63 },
          { text: 'Collaborations', id: 64 },
          { text: 'Licensing Program', id: 65 },
          { text: 'All Partnership Opportunities', id: 69 },
        ]);
        return;
      }

      // Norway filter to pinpoint specific information.
      if (NORWAY_FILTER_TERMS.some((term) => matchesTermWithBoundary(sanitizedInput, term))) {
        sendFilterButtons('Norway query. What would you like to know?', [
          { text: 'PURENorway HQ & Location', id: 4 },
          { text: 'Norwegian Traditions', id: 62 },
          { text: 'About PURENorway', id: 1 },
          { text: 'Company Leadership', id: 5 },
        ]);
        return;
      }

      // Contact form query - direct them to contact page.
      if (CONTACT_FORM_TERMS.some((term) => matchesTermWithBoundary(sanitizedInput, term))) {
        botResponse = 'You can fill out a contact form on our Contact Page! 📝\n\nNavigate to the contact page to send us a message or inquiry. We respond quickly to all inquiries.';
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: botResponse,
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // Credits filter for websites/designer/marketing queries.
      if (CREDITS_FILTER_TERMS.some((term) => matchesTermWithBoundary(sanitizedInput, term))) {
        // Check if it's a direct keyword that needs instant answer
        let directCreditsId: number | null = null;
        for (const [keyword, qaId] of Object.entries(DIRECT_CREDITS_KEYWORDS)) {
          if (matchesTermWithBoundary(sanitizedInput, keyword)) {
            directCreditsId = qaId;
            break;
          }
        }

        if (directCreditsId) {
          // Direct answer for marketing or design
          const qa = data?.qa.find((item) => item.id === directCreditsId);
          if (qa) {
            botResponse = qa.answer;
          }
        } else {
          // Show button options for other credits queries
          sendFilterButtons('Credits & Support. Choose what you\'d like to know:', [
            { text: 'Website Designer & Developer', id: 84 },
            { text: 'Marketing & Social Media', id: 85 },
            { text: 'Website & Design Help', id: 86 },
          ]);
          return;
        }
      }

      // Handle HQ contact queries (overrides regional distributor search)
      const hasHQKeyword = HQ_KEYWORDS.some(keyword => matchesTermWithBoundary(sanitizedInput, keyword));
      
      // If asking for HQ/contact, show headquarters
      if (hasHQKeyword) {
        const qa = data.qa.find((item) => item.id === 4); // HQ location info - "Where is PureNorway based?"
        if (qa) {
          botResponse = `**${qa.category}**\n\n${qa.answer}`;
        }
      } else if (true) {
        // Handle greetings
        // Check for greeting
        let greetingFound = false;
        for (const [greeting, response] of Object.entries(GREETINGS)) {
          if (matchesTermWithBoundary(sanitizedInput, greeting)) {
            botResponse = response;
            greetingFound = true;
            break;
          }
        }

        if (greetingFound) {
          // Greeting handled
        } else {
          // Check if it's a regional query
          let regionalMatchId: number | null = null;
          for (const [region, qaId] of Object.entries(REGIONAL_KEYWORDS)) {
            if (matchesTermWithBoundary(sanitizedInput, region)) {
              regionalMatchId = typeof qaId === 'number' ? qaId : null;
              break;
            }
          }

          if (regionalMatchId) {
            // Fetch specific regional distributor info
            const qa = data?.qa.find((item) => item.id === regionalMatchId);
            if (qa) {
              botResponse = qa.answer;
            } else {
              botResponse =
                'Let me find the latest distributor information for you...';
            }
          } else {
            let matchedQAId: number | null = null;

            for (const [keyword, qaId] of Object.entries(KEYWORDS)) {
              if (matchesTermWithBoundary(sanitizedInput, keyword)) {
                matchedQAId = qaId;
                break;
              }
            }

            if (matchedQAId) {
              // Direct keyword match
              const qa = data.qa.find((item) => item.id === matchedQAId);
              if (qa) {
                botResponse = `**${qa.category}**\n\n${qa.answer}`;
              }
            } else {
              // Fuzzy search for matching Q&As
              const results = fuse.current!.search(inputValue);

              if (results.length > 0) {
                const bestMatch = results[0].item;
                const score = 1 - (results[0].score || 0);
                
                // If best match score is high, show it directly
                if (score > 0.6) {
                  botResponse = `**${bestMatch.category}**\n\n${bestMatch.answer}`;
                } else {
                  // Show top 3 suggestions as buttons
                  botResponse = "I found several possible answers. Which one interests you?";
                  const suggestions = results.slice(0, 3).map((result) => ({
                    text: result.item.question,
                    id: result.item.id,
                  }));
                  
                  const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'bot',
                    text: botResponse,
                    suggestions: suggestions,
                  };

                  setMessages((prev) => [...prev, botMessage]);
                  setIsLoading(false);
                  return;
                }
              } else {
                botResponse =
                  "Sorry, I couldn't find an answer to that question. Try asking in a different way, or navigate to our contact page to speak with the team directly 📧";
              }
            }
          }
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  if (!data) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-button"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <IoClose size={24} />
        ) : (
          <IoChatbubble size={24} />
        )}
      </button>

      {/* Chat Panel - Left Side */}
      {isOpen && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <h3 className="chatbot-title">PURENorway Assistant</h3>
              <p className="chatbot-subtitle">Ask anything!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close-btn"
              aria-label="Close chatbot"
              title="Close chat"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message message-${message.type}`}>
                <div className="message-content">
                  {message.text.split('\n').map((line, idx) => (
                    <p key={idx}>
                      {line
                        .split(/\*\*(.*?)\*\*/g)
                        .map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i}>{part}</strong>
                          ) : (
                            <span key={i}>{renderTextWithLinks(part)}</span>
                          )
                        )}
                    </p>
                  ))}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="suggestion-btn"
                          onClick={() => {
                            setInputValue(suggestion.text);
                            const tempInput = suggestion.text;
                            setInputValue('');
                            setMessages((prev) => [...prev, {
                              id: Date.now().toString(),
                              type: 'user',
                              text: tempInput,
                            }]);
                            setIsLoading(true);
                            
                            // Simulate bot thinking and respond
                            setTimeout(() => {
                              const qa = data?.qa.find((item) => item.id === suggestion.id);
                              if (qa) {
                                const response = `**${qa.category}**\n\n${qa.answer}`;
                                setMessages((prev) => [...prev, {
                                  id: (Date.now() + 1).toString(),
                                  type: 'bot',
                                  text: response,
                                }]);
                              }
                              setIsLoading(false);
                            }, 500);
                          }}
                        >
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message message-bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type your question..."
              className="chatbot-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
            >
              <IoPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

