
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { SendHorizonal, BrainCircuit, User } from "lucide-react";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Здравствуйте! Я ваш ИИ-помощник по разработке нейронных сетей. Как я могу помочь вам сегодня?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAssistantResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const getAssistantResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('привет') || lowerInput.includes('здравствуйте')) {
      return 'Здравствуйте! Чем я могу вам помочь с разработкой нейронной сети?';
    } else if (lowerInput.includes('созда') || lowerInput.includes('генер')) {
      return 'Для создания нейронной сети вам нужно перейти в раздел "Конструктор ИНС" и описать задачу, которую вы хотите решить. Система автоматически предложит оптимальную архитектуру.';
    } else if (lowerInput.includes('сравн')) {
      return 'В разделе "Сравнение моделей" вы можете выбрать несколько моделей и сравнить их производительность на различных метриках.';
    } else if (lowerInput.includes('библиотек') || lowerInput.includes('готов')) {
      return 'В нашей библиотеке есть множество предобученных моделей для различных задач: классификации изображений, обработки текста, прогнозирования временных рядов. Перейдите в раздел "Библиотека моделей", чтобы увидеть доступные варианты.';
    } else {
      return 'Я могу помочь вам создать нейронную сеть, объяснить различные архитектуры и подходы, а также предложить оптимальные параметры для вашей задачи. Уточните, пожалуйста, что именно вас интересует?';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-neural-accent" />
          ИИ-ассистент
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex items-start gap-3 max-w-[80%]", 
              message.sender === 'user' ? "ml-auto" : ""
            )}
          >
            {message.sender === 'assistant' && (
              <Avatar className="w-8 h-8 border bg-neural-accent/20">
                <BrainCircuit className="h-4 w-4 text-neural-primary" />
              </Avatar>
            )}
            <div>
              <div 
                className={cn(
                  "rounded-lg p-3", 
                  message.sender === 'user' ? 
                    "bg-neural-primary text-white" : 
                    "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
            {message.sender === 'user' && (
              <Avatar className="w-8 h-8 border">
                <User className="h-4 w-4" />
              </Avatar>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 border bg-neural-accent/20">
              <BrainCircuit className="h-4 w-4 text-neural-primary" />
            </Avatar>
            <div className="rounded-lg p-3 bg-muted">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-neural-accent animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-neural-accent animate-pulse delay-150"></div>
                <div className="h-2 w-2 rounded-full bg-neural-accent animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex gap-2 w-full">
          <Textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 min-h-[40px] resize-none"
            rows={1}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Отправить</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
