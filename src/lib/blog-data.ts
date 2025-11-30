export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    image: string;
    author: string;
    readTime: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: "5-reasons-pet-portrait-perfect-gift",
        title: "5 Reasons Why a Custom Pet Portrait is the Perfect Gift",
        excerpt: "Struggling to find a unique gift for a dog or cat lover? Discover why a hand-crafted pet portrait is a timeless choice that brings tears of joy.",
        content: `
      <p>Finding the perfect gift for a pet lover can be challenging. You want something meaningful, personal, and lasting. A custom pet portrait checks all these boxes and more.</p>
      
      <h2>1. It's deeply personal</h2>
      <p>Unlike mass-produced items, a custom portrait celebrates the unique bond between a pet and their owner. It shows you put thought and effort into choosing something special.</p>

      <h2>2. It captures a moment in time</h2>
      <p>Pets grow up fast. A portrait freezes a moment of their life, preserving their personality and charm forever.</p>

      <h2>3. It fits any decor</h2>
      <p>Whether it's a classic oil painting style or a modern digital illustration, pet portraits can be tailored to match any home aesthetic.</p>

      <h2>4. It's a conversation starter</h2>
      <p>Guests will always ask about the artwork. It gives the owner a chance to talk about their favorite subject—their pet!</p>

      <h2>5. It honors their memory</h2>
      <p>For pets that have passed, a memorial portrait is a beautiful way to keep their spirit alive in the home.</p>
    `,
        date: "November 28, 2025",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=2069&auto=format&fit=crop",
        author: "Eterna Team",
        readTime: "3 min read"
    },
    {
        slug: "how-to-choose-best-photo-pet-portrait",
        title: "How to Choose the Best Photo for Your Pet Portrait",
        excerpt: "The secret to a great painting is a great reference photo. Learn our top tips for capturing your pet's best angle.",
        content: `
      <p>The quality of your custom portrait depends heavily on the reference photo you provide. Here are our top tips for getting the perfect shot.</p>

      <h2>1. Lighting is Key</h2>
      <p>Natural light is best. Try to take photos outside on an overcast day or near a bright window. Avoid flash, as it can cause red-eye and harsh shadows.</p>

      <h2>2. Get on Their Level</h2>
      <p>Don't shoot from above. Crouch down so you are eye-level with your pet. This creates a more intimate and engaging portrait.</p>

      <h2>3. Focus on the Eyes</h2>
      <p>The eyes are the window to the soul. Make sure they are sharp and in focus. A catchlight (reflection of light) in the eyes brings them to life.</p>

      <h2>4. Capture Their Personality</h2>
      <p>Does your dog have a goofy smile? Does your cat look regal? Try to capture an expression that is "so them".</p>
    `,
        date: "November 15, 2025",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop",
        author: "Eterna Team",
        readTime: "4 min read"
    }
];
