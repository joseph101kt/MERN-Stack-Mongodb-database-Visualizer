import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPosts.js';
import User from '../models/Users.js';

dotenv.config();

const seedBlogs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    await BlogPost.deleteMany({});

    const users = await User.find().limit(10);
    
    const blogData = [
      {
        title: "Mastering MERN",
        slug: "mastering-mern",
        content: { excerpt: "A guide to the stack.", body: "Full body text...", tags: ["react", "node"] },
        metadata: { views: 150, seo: { metaTitle: "MERN Guide", keywords: ["mern", "web"] } }
      },
      {
        title: "Visualizer 101",
        slug: "visualizer-101",
        content: { excerpt: "How to see your data.", body: "Visualizing JSON is key.", tags: ["data", "json"] },
        metadata: { views: 300, seo: { metaTitle: "Data Vis", keywords: ["charts", "models"] } }
      },
      {
        title: "Next.js vs React",
        slug: "next-vs-react",
        content: { excerpt: "Which one to pick?", body: "It depends on your SEO needs.", tags: ["nextjs", "react"] },
        metadata: { views: 450, seo: { metaTitle: "Framework Wars", keywords: ["seo", "speed"] } }
      },
      {
        title: "Database Design",
        slug: "db-design",
        content: { excerpt: "Schema best practices.", body: "Keep your structures flat or nested?", tags: ["mongodb", "sql"] },
        metadata: { views: 220, seo: { metaTitle: "Schema Tips", keywords: ["database", "design"] } }
      },
      {
        title: "Auth Patterns",
        slug: "auth-patterns",
        content: { excerpt: "JWT vs Sessions.", body: "Security is paramount.", tags: ["security", "auth"] },
        metadata: { views: 180, seo: { metaTitle: "Security Guide", keywords: ["jwt", "login"] } }
      },
      {
        title: "Styling Components",
        slug: "styling-components",
        content: { excerpt: "Tailwind or CSS modules?", body: "Utility classes are fast.", tags: ["css", "tailwind"] },
        metadata: { views: 90, seo: { metaTitle: "Styling", keywords: ["ui", "tailwind"] } }
      },
      {
        title: "Deployment Tips",
        slug: "deployment-tips",
        content: { excerpt: "Going live on Vercel.", body: "CI/CD makes it easy.", tags: ["devops", "vercel"] },
        metadata: { views: 500, seo: { metaTitle: "DevOps", keywords: ["cloud", "deploy"] } }
      },
      {
        title: "State Management",
        slug: "state-mgmt",
        content: { excerpt: "Zustand vs Redux.", body: "Zustand is getting popular.", tags: ["javascript", "state"] },
        metadata: { views: 340, seo: { metaTitle: "State", keywords: ["zustand", "redux"] } }
      },
      {
        title: "API Optimization",
        slug: "api-opt",
        content: { excerpt: "Caching and speed.", body: "Use Redis for faster results.", tags: ["backend", "redis"] },
        metadata: { views: 120, seo: { metaTitle: "Performance", keywords: ["cache", "api"] } }
      },
      {
        title: "Testing Code",
        slug: "testing-code",
        content: { excerpt: "Jest and Vitest.", body: "Don't ship bugs.", tags: ["testing", "vitest"] },
        metadata: { views: 60, seo: { metaTitle: "QA", keywords: ["unit-test", "bugs"] } }
      }
    ];

    const posts = blogData.map((blog, i) => ({
      ...blog,
      author: users[i % users.length]?._id || new mongoose.Types.ObjectId(),
      comments: [{ user: "Admin", text: "Nice post!" }]
    }));

    await BlogPost.insertMany(posts);
    console.log('✅ 10 Blog Posts Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedBlogs();