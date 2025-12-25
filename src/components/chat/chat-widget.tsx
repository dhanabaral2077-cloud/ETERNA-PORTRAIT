"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your Eterna Concierge. 🎨 Looking for the perfect portrait style or a gift idea?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "assistant", content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-primary/20 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary/5 p-4 border-b border-primary/10 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary/20 p-2 rounded-full">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-headline font-bold text-foreground">Eterna Concierge</h3>
                                    <p className="text-xs text-secondary">Always here to help ✨</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={toggleChat} className="hover:bg-primary/10 rounded-full h-8 w-8">
                                <X size={18} />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "flex w-full mb-2",
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                                        )}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start w-full mb-2">
                                    <div className="bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-xs text-gray-500">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t bg-white">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask about styles, pricing..."
                                    className="rounded-full bg-gray-50 border-gray-200 focus:ring-primary/20"
                                />
                                <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon" className="rounded-full aspect-square shrink-0">
                                    <Send size={18} />
                                </Button>
                            </div>
                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                AI can make mistakes. Please verify critical details.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Launcher Button */}
            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors relative group"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                </AnimatePresence>

                {/* Tooltip on hover */}
                {!isOpen && (
                    <span className="absolute right-full mr-4 bg-white text-foreground px-3 py-1.5 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Chat with us
                    </span>
                )}
            </motion.button>
        </div>
    );
}
