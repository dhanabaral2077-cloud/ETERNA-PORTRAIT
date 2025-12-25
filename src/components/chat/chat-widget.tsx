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
        { role: "assistant", content: "Woof! I'm Picasso 🐶 Your personal art assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [teaserMessage, setTeaserMessage] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    // Proactive Triggers
    useEffect(() => {
        if (hasInteracted || isOpen) return;

        // 1. Idle Timer (30s)
        const idleTimer = setTimeout(() => {
            setTeaserMessage("Need help picking a style? 🎨");
        }, 30000);

        // 2. Exit Intent
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasInteracted && !isOpen) {
                setTeaserMessage("Wait! I have a treat for you! 🦴");
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            clearTimeout(idleTimer);
            document.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [hasInteracted, isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setTeaserMessage(null);
        if (!isOpen) setHasInteracted(true);
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);
        setHasInteracted(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Chat API Error Details:", errorData);
                throw new Error(errorData.error || "Failed to get response");
            }

            const data = await response.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Woof! I'm having trouble fetching that bone. Please try again! 🐾" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Pointer events wrapper to allow clicking through the empty space */}
            <div className="pointer-events-auto flex flex-col items-end gap-4">

                {/* Teaser Bubble */}
                <AnimatePresence>
                    {teaserMessage && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-primary/20 max-w-[200px] relative mb-2"
                        >
                            <p className="text-sm font-medium text-foreground">{teaserMessage}</p>
                            <button
                                onClick={() => setTeaserMessage(null)}
                                className="absolute -top-2 -left-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="mb-2 w-[350px] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-primary/20 flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-primary/5 p-4 border-b border-primary/10 flex justify-between items-center bg-gradient-to-r from-amber-50 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-1 rounded-full shadow-sm border border-amber-100">
                                        <img src="/mascot/picasso.png" alt="Picasso" className="w-10 h-10 object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline font-bold text-foreground">Picasso</h3>
                                        <p className="text-xs text-primary font-medium">Painter Pup 🎨</p>
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
                                            <span className="text-xs text-gray-500">Sniffing around...</span>
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

                {/* Launcher Button - Mascot Head */}
                <motion.button
                    onClick={toggleChat}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative group"
                >
                    <div className={cn(
                        "transition-all duration-300 rounded-full border-4 border-white shadow-xl overflow-hidden",
                        isOpen ? "w-14 h-14" : "w-12 h-12" // Reduced to smaller initial size
                    )}>
                        <img
                            src="/mascot/picasso.png"
                            alt="Chat with Picasso"
                            className="w-full h-full object-cover bg-[#FDF8F3]"
                        />
                    </div>
                </motion.button>
            </div>
        </div>
    );
}
