"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentsProps {
    postId: string;
}

interface Comment {
    id: string;
    user_name: string;
    content: string;
    created_at: string;
}

export function Comments({ postId }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [userName, setUserName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        const { data } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", postId)
            .order("created_at", { ascending: false });

        if (data) setComments(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase.from("comments").insert({
                post_id: postId,
                user_name: userName,
                content: newComment,
            });

            if (error) throw error;

            setNewComment("");
            // Refresh comments
            fetchComments();
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12">
            <h3 className="text-2xl font-headline font-bold mb-8">
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="bg-card border rounded-2xl p-6 mb-10 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Your Name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="bg-background border-muted/40 focus-visible:ring-primary/20"
                        />
                    </div>
                    <div className="relative">
                        <Textarea
                            placeholder="Share your thoughts..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[100px] bg-background border-muted/40 focus-visible:ring-primary/20 resize-none pr-12"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isSubmitting || !newComment.trim() || !userName.trim()}
                            className="absolute bottom-3 right-3 h-8 w-8 rounded-full transition-all hover:scale-105"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                <AnimatePresence initial={false}>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex gap-4 group"
                        >
                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {comment.user_name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-muted/30 rounded-2xl rounded-tl-none p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm">
                                            {comment.user_name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(comment.created_at), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                                {/* <div className="flex gap-4 mt-1 ml-2">
                  <button className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                    Reply
                  </button>
                  <button className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                    Like
                  </button>
                </div> */}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {comments.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
