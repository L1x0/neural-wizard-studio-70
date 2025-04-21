import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { SendHorizonal, BrainCircuit, User, Files, FilePlus, Trash2 } from "lucide-react";
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
      content: 'Здравствуйте! Я ваш ИИ-помощник. Как я могу помочь вам сегодня?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [files, setFiles] = useState<string[]>([
    'example1.txt',
    'model_config.json',
    'training_data.csv',
  ]);

  const [showViewFiles, setShowViewFiles] = useState(false);
  const [showDeleteFiles, setShowDeleteFiles] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const viewFilesRef = useRef<HTMLUListElement | null>(null);
  const deleteFilesRef = useRef<HTMLUListElement | null>(null);
  const addFileContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showViewFiles &&
        viewFilesRef.current &&
        !viewFilesRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#btn-view-files')
      ) {
        setShowViewFiles(false);
      }
      if (
        showDeleteFiles &&
        deleteFilesRef.current &&
        !deleteFilesRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#btn-delete-files')
      ) {
        setShowDeleteFiles(false);
      }
      if (
        showAddFile &&
        addFileContainerRef.current &&
        !addFileContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#btn-add-file')
      ) {
        setShowAddFile(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showViewFiles, showDeleteFiles, showAddFile]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Это сгенерированный ответ ассистента.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Ошибка:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: 'Произошла ошибка при получении ответа',
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleViewFiles = () => {
    setShowViewFiles(prev => !prev);
    setShowDeleteFiles(false);
    setShowAddFile(false);
  };

  const toggleDeleteFiles = () => {
    setShowDeleteFiles(prev => !prev);
    setShowViewFiles(false);
    setShowAddFile(false);
  };

  const openAddFile = () => {
    setShowAddFile(true);
    setShowViewFiles(false);
    setShowDeleteFiles(false);
  };

  const cancelAddFile = () => {
    setShowAddFile(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      const newFileNames = Array.from(uploadedFiles).map(f => f.name);
      setFiles(prevFiles => {
        const combined = [...prevFiles];
        newFileNames.forEach(name => {
          if (!combined.includes(name)) combined.push(name);
        });
        return combined;
      });
      setShowAddFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (fileName: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== fileName));
    setShowDeleteFiles(false);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <BrainCircuit className="h-5 w-5 text-neural-accent" />
              <span>ИИ-ассистент</span>
            </div>
            <div className="flex flex-wrap gap-3 max-w-full sm:max-w-[70%] md:max-w-[60%] justify-start">
              <Button
                id="btn-view-files"
                variant="outline"
                size="sm"
                onClick={toggleViewFiles}
                aria-expanded={showViewFiles}
                aria-haspopup="listbox"
                className="flex items-center gap-1 border-neural-accent text-neural-accent hover:bg-neural-accent/10 focus:ring-1 focus:ring-neural-accent w-full sm:w-auto"
                type="button"
                title="Посмотреть все файлы"
              >
                <Files className="w-4 h-4" />
                Файлы
              </Button>
              {showViewFiles && (
                <ul
                  ref={viewFilesRef}
                  role="listbox"
                  tabIndex={-1}
                  className="absolute top-full mt-1 max-h-48 w-48 overflow-auto rounded-md border border-neural-accent bg-neural-primary/95 text-white shadow-lg z-50 backdrop-blur-sm"
                >
                  {files.length === 0 && (
                    <li className="p-2 text-neutral-400 select-none break-words">
                      Файлы отсутствуют
                    </li>
                  )}
                  {files.map(file => (
                    <li
                      key={file}
                      className="px-3 py-2 cursor-default hover:bg-neural-accent/30 rounded select-text break-words whitespace-normal"
                      title={file}
                      onClick={() => setShowViewFiles(false)}
                    >
                      {file}
                    </li>
                  ))}
                </ul>
              )}

              <Button
                id="btn-add-file"
                variant="outline"
                size="sm"
                onClick={openAddFile}
                className="flex items-center gap-1 border-neural-accent text-neural-accent hover:bg-neural-accent/10 focus:ring-1 focus:ring-neural-accent w-full sm:w-auto"
                type="button"
                title="Добавить файл"
              >
                <FilePlus className="w-4 h-4" />
                Добавить
              </Button>

              <Button
                id="btn-delete-files"
                variant="outline"
                size="sm"
                onClick={toggleDeleteFiles}
                aria-expanded={showDeleteFiles}
                aria-haspopup="listbox"
                disabled={files.length === 0}
                className={cn(
                  "flex items-center gap-1 border-neural-accent text-neural-accent hover:bg-neural-accent/10 focus:ring-1 focus:ring-neural-accent w-full sm:w-auto",
                  files.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                )}
                type="button"
                title="Удалить файл"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </Button>
              {showDeleteFiles && (
                <ul
                  ref={deleteFilesRef}
                  role="listbox"
                  tabIndex={-1}
                  className="absolute top-full mt-1 max-h-48 w-48 overflow-auto rounded-md border border-destructive bg-destructive/90 text-destructive-foreground shadow-lg backdrop-blur-sm z-50"
                >
                  {files.length === 0 && (
                    <li className="p-2 select-none text-destructive-foreground">
                      Нет файлов для удаления
                    </li>
                  )}
                  {files.map(file => (
                    <li
                      key={file}
                      className="px-3 py-2 cursor-pointer hover:bg-destructive-foreground hover:text-destructive rounded select-text break-words whitespace-normal"
                      onClick={() => handleDeleteFile(file)}
                      role="option"
                      tabIndex={0}
                      title={file}
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
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3 max-w-[80%]",
              message.sender === 'user' ? 'ml-auto' : ''
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
                  'rounded-lg p-3',
                  message.sender === 'user'
                    ? 'bg-neural-primary text-white'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
          <div
            ref={addFileContainerRef}
            className="mx-auto max-w-sm rounded-md border border-neural-accent bg-neural-primary/90 p-3 shadow-lg"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-white">Добавить файл</h4>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-neutral-200"
                onClick={cancelAddFile}
              >
                Отмена
              </Button>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="file-input file-input-bordered file-input-sm w-full text-sm cursor-pointer"
              style={{ colorScheme: 'dark' }}
              title="Выберите файлы для загрузки"
            />
          </div>
        )}
        <div className="flex gap-2 w-full">
          <Textarea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
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
