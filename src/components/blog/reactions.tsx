"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReactionsProps {
    postId: string;
}

const REACTION_TYPES = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "haha", emoji: "😂", label: "Haha" },
    { type: "wow", emoji: "😮", label: "Wow" },
    { type: "sad", emoji: "😢", label: "Sad" },
];

export function Reactions({ postId }: ReactionsProps) {
    const [reactions, setReactions] = useState<Record<string, number>>({});
    const [userReaction, setUserReaction] = useState<string | null>(null);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        fetchReactions();

        // Subscribe to changes
        const channel = supabase
            .channel('reactions')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'post_reactions', filter: `post_id=eq.${postId}` },
                () => fetchReactions()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId]);

    const fetchReactions = async () => {
        const { data } = await supabase
            .from("post_reactions")
            .select("reaction_type, count")
            .eq("post_id", postId);

        if (data) {
            const counts: Record<string, number> = {};
            data.forEach((r) => {
                counts[r.reaction_type] = r.count;
            });
            setReactions(counts);
        }
    };

    const handleReaction = async (type: string) => {
        // Optimistic update
        setReactions((prev) => ({
            ...prev,
            [type]: (prev[type] || 0) + 1,
        }));
        setUserReaction(type);

        // Call RPC function to increment safely
        const { error } = await supabase.rpc("increment_reaction", {
            p_id: postId,
            r_type: type,
        });

        if (error) {
            console.error("Error adding reaction:", error);
            // Revert optimistic update if needed, but for reactions it's usually fine to just refetch later
        }
    };

    return (
        <div className="py-8 border-t border-b border-muted/30 my-12">
            <h3 className="text-center text-lg font-medium mb-6 text-muted-foreground">
                What did you think?
            </h3>
            <div className="flex justify-center gap-4 md:gap-8">
                {REACTION_TYPES.map(({ type, emoji, label }) => (
                    <motion.button
                        key={type}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleReaction(type)}
                        className={cn(
                            "flex flex-col items-center gap-2 p-3 rounded-xl transition-colors",
                            userReaction === type ? "bg-primary/10" : "hover:bg-muted/50"
                        )}
                    >
                        <span className="text-3xl md:text-4xl filter drop-shadow-sm">
                            {emoji}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                            {reactions[type] || 0}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
