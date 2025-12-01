"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Loader2,
    Code,
    Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogEditorProps {
    post?: any;
}

export function BlogEditor({ post }: BlogEditorProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHtmlView, setIsHtmlView] = useState(false);
    const [formData, setFormData] = useState({
        title: post?.title || "",
        slug: post?.slug || "",
        excerpt: post?.excerpt || "",
        author: post?.author || "Eterna Team",
        image: post?.image || "",
        published: post?.published || false,
        tags: post?.tags?.join(", ") || "",
        search_description: post?.search_description || "",
    });

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: "Write your story here...",
            }),
        ],
        content: post?.content || "",
        editorProps: {
            attributes: {
                class:
                    "prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6",
            },
        },
    });

    // Auto-generate slug from title if creating new post
    useEffect(() => {
        if (!post && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    }, [formData.title, post]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("blog-images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);

            // If uploading for the main cover image
            setFormData((prev) => ({ ...prev, image: data.publicUrl }));
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image");
        }
    };

    const addImageToEditor = async () => {
        const url = window.prompt("Enter image URL");
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const previousUrl = editor?.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) return;

        if (url === "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const onSubmit = async (publishStatus: boolean) => {
        if (!formData.title || !formData.slug) {
            alert("Please fill in the title and slug");
            return;
        }

        setIsSubmitting(true);

        const content = isHtmlView
            ? (document.getElementById("html-editor") as HTMLTextAreaElement)?.value
            : editor?.getHTML();

        const tagsArray = formData.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag.length > 0);

        const dataToSave = {
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt,
            author: formData.author,
            image: formData.image,
            published: publishStatus,
            content: content,
            tags: tagsArray,
            search_description: formData.search_description,
        };

        try {
            const url = post ? `/api/blog/${post.id}` : "/api/blog";
            const method = post ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
            });

            if (!res.ok) throw new Error("Failed to save");

            router.push("/admin/blog");
            router.refresh();
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Failed to save post");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!editor) return null;

    // Sync content when switching views
    const toggleView = () => {
        if (isHtmlView) {
            // Switching from HTML to Visual
            const textArea = document.getElementById("html-editor") as HTMLTextAreaElement;
            if (textArea && editor) {
                editor.commands.setContent(textArea.value);
            }
        }
        setIsHtmlView(!isHtmlView);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor Area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                    <Input
                        placeholder="Post Title"
                        className="text-4xl font-bold border-none px-0 h-auto focus-visible:ring-0 placeholder:text-gray-300"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                </div>

                {/* Toolbar */}
                <div className="border rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1 sticky top-20 z-10 items-center">
                    <div className="flex gap-1 mr-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            disabled={isHtmlView}
                            className={cn(editor.isActive("bold") && "bg-gray-200")}
                        >
                            <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            disabled={isHtmlView}
                            className={cn(editor.isActive("italic") && "bg-gray-200")}
                        >
                            <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            disabled={isHtmlView}
                            className={cn(editor.isActive("bulletList") && "bg-gray-200")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            disabled={isHtmlView}
                            className={cn(editor.isActive("orderedList") && "bg-gray-200")}
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            disabled={isHtmlView}
                            className={cn(editor.isActive("blockquote") && "bg-gray-200")}
                        >
                            <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={setLink}
                            disabled={isHtmlView}
                            className={cn(editor.isActive("link") && "bg-gray-200")}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={addImageToEditor} disabled={isHtmlView}>
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-300 mx-2" />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={isHtmlView}
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={isHtmlView}
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="flex gap-1 border-l pl-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleView}
                            className={cn(isHtmlView && "bg-gray-200 text-primary")}
                            title={isHtmlView ? "Switch to Visual View" : "Switch to HTML View"}
                        >
                            {isHtmlView ? <Eye className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
                            {isHtmlView ? "Visual View" : "HTML View"}
                        </Button>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="border rounded-b-lg min-h-[500px] bg-white relative">
                    {isHtmlView ? (
                        <textarea
                            id="html-editor"
                            className="w-full h-[500px] p-4 font-mono text-sm focus:outline-none resize-y"
                            defaultValue={editor.getHTML()}
                            onChange={(e) => {
                                // Optional: Update editor content on change if needed, 
                                // but usually we sync back when switching views or submitting.
                                // For now, we'll sync on submit or view switch.
                            }}
                        />
                    ) : (
                        <EditorContent editor={editor} />
                    )}
                </div>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border space-y-6 sticky top-24">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Publishing</h3>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onSubmit(false)}
                                disabled={isSubmitting}
                            >
                                Draft
                            </Button>
                            <Button
                                onClick={() => onSubmit(true)}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Labels (Tags)</Label>
                            <Input
                                placeholder="Separate with commas"
                                value={formData.tags}
                                onChange={(e) =>
                                    setFormData({ ...formData, tags: e.target.value })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                E.g. Portrait, Gift Ideas, Dogs
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Search Description</Label>
                            <Textarea
                                value={formData.search_description}
                                onChange={(e) =>
                                    setFormData({ ...formData, search_description: e.target.value })
                                }
                                rows={2}
                                placeholder="Meta description for SEO..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Permalink</Label>
                            <Input
                                value={formData.slug}
                                onChange={(e) =>
                                    setFormData({ ...formData, slug: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Excerpt (Summary)</Label>
                            <Textarea
                                value={formData.excerpt}
                                onChange={(e) =>
                                    setFormData({ ...formData, excerpt: e.target.value })
                                }
                                rows={3}
                                placeholder="Short summary shown on blog list..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Author</Label>
                            <Input
                                value={formData.author}
                                onChange={(e) =>
                                    setFormData({ ...formData, author: e.target.value })
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Featured Image</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                />
                                {formData.image ? (
                                    <img
                                        src={formData.image}
                                        alt="Cover"
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        <ImageIcon className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                                        Click to upload cover
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
