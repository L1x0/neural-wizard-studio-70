
import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { SendHorizonal, BrainCircuit, User, FileText, PlusCircle, Trash2 } from "lucide-react";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  // Messages and input states as before
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

  // New state: files list (strings as filenames)
  const [files, setFiles] = useState<string[]>([
    'example1.txt',
    'model_config.json',
    'training_data.csv'
  ]);

  // State for dropdown visibility
  const [showViewFiles, setShowViewFiles] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  // State for showing add file dialog
  const [showAddFile, setShowAddFile] = useState(false);

  // Ref for file input to reset
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle sending message
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

  // Handlers for file management
  const toggleViewFiles = () => {
    setShowViewFiles(!showViewFiles);
    setShowDeleteFiles(false);
    setShowAddFile(false);
  };

  const toggleDeleteFiles = () => {
    setShowDeleteFiles(!showDeleteFiles);
    setShowViewFiles(false);
    setShowAddFile(false);
  };

  const handleAddFileClick = () => {
    setShowAddFile(true);
    setShowViewFiles(false);
    setShowDeleteFiles(false);
  };

  const handleAddFileCancel = () => {
    setShowAddFile(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      const newFileNames = Array.from(uploadedFiles).map(f => f.name);
      // Avoid duplicates
      setFiles(prevFiles => {
        const combined = [...prevFiles];
        for (const name of newFileNames) {
          if (!combined.includes(name)) {
            combined.push(name);
          }
        }
        return combined;
      });
      setShowAddFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== fileName));
  };

  return (
    <Card className="flex flex-col h-full relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-neural-accent" />
            ИИ-ассистент
          </div>
          <div className="flex gap-2">
            {/* Button: View all files */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleViewFiles} 
                aria-expanded={showViewFiles} 
                aria-haspopup="listbox"
                className="flex items-center gap-1"
                title="Посмотреть все файлы"
              >
                <FileText className="w-4 h-4" />
                Файлы
              </Button>
              {showViewFiles && (
                <ul 
                  role="listbox" 
                  className="absolute right-0 mt-1 max-h-64 w-48 overflow-auto rounded-md border border-border bg-card p-1 text-sm shadow-lg z-50"
                  tabIndex={-1}
                >
                  {files.length === 0 && (
                    <li className="px-2 py-1 text-muted-foreground">Файлы отсутствуют</li>
                  )}
                  {files.map(file => (
                    <li key={file} className="px-2 py-1 hover:bg-muted cursor-default">
                      {file}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Button: Add file */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddFileClick}
              title="Добавить файл"
              className="flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              Добавить
            </Button>
            {/* Button: Delete file */}
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleDeleteFiles} 
                aria-expanded={showDeleteFiles} 
                aria-haspopup="listbox"
                className="flex items-center gap-1"
                title="Удалить файл"
                disabled={files.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </Button>
              {showDeleteFiles && (
                <ul 
                  role="listbox" 
                  className="absolute right-0 mt-1 max-h-64 w-48 overflow-auto rounded-md border border-border bg-card p-1 text-sm shadow-lg z-50"
                  tabIndex={-1}
                >
                  {files.length === 0 && (
                    <li className="px-2 py-1 text-muted-foreground">Нет файлов для удаления</li>
                  )}
                  {files.map(file => (
                    <li 
                      key={file} 
                      className="px-2 py-1 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                      onClick={() => {
                        handleDeleteFile(file);
                      }}
                      role="option"
                      tabIndex={0}
                    >
                      {file}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
      <CardFooter className="border-t p-4 flex flex-col gap-2">
        {showAddFile && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Добавить файл</h4>
              <Button size="sm" variant="ghost" onClick={handleAddFileCancel}>Отмена</Button>
            </div>
            <input 
              type="file" 
              multiple 
              onChange={handleFileUpload} 
              ref={fileInputRef} 
              className="file-input-bordered file-input file-input-sm w-full"
            />
          </div>
        )}
        <div className="flex gap-2 w-full">
          <Textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 min-h-[40px] resize-none"
            rows={1}
            disabled={showAddFile} 
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || showAddFile}
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
