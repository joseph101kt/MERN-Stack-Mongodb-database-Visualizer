import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
dotenv.config();

const users = [
  {
    username: "dev_joe",
    email: "joe@example.com",
    password: "hashed_password_here",
    role: "admin",
    profile: {
      firstName: "Joseph",
      lastName: "Miller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joe",
      bio: "Full-stack dev and MERN enthusiast.",
      socials: { twitter: "@joe_dev", github: "joe-codes" }
    },
    settings: { theme: "dark", notifications: true, twoFactorEnabled: true }
  },
  {
    username: "alice_graph",
    email: "alice@example.com",
    password: "hashed_password_here",
    role: "editor",
    profile: {
      firstName: "Alice",
      lastName: "Smith",
      bio: "UI/UX Designer and Blogger.",
      socials: { twitter: "@alice_ui" }
    },
    settings: { theme: "light", notifications: false, twoFactorEnabled: false }
  },
  {
    username: "bob_builds",
    email: "bob@example.com",
    password: "hashed_password_here",
    role: "user",
    profile: {
      firstName: "Robert",
      lastName: "Brown",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      socials: { github: "bob-builder" }
    },
    settings: { theme: "system", notifications: true, twoFactorEnabled: false }
  },
  {
    username: "charlie_codes",
    email: "charlie@example.com",
    password: "hashed_password_here",
    role: "user",
    profile: {
      firstName: "Charlie",
      lastName: "Davis",
      bio: "Learning documentation models.",
      socials: { github: "charlie-dev" }
    },
    settings: { theme: "dark", notifications: true, twoFactorEnabled: true }
  },
  {
    username: "dana_data",
    email: "dana@example.com",
    password: "hashed_password_here",
    role: "editor",
    profile: {
      firstName: "Dana",
      lastName: "Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dana",
      socials: { twitter: "@dana_data" }
    },
    settings: { theme: "light", notifications: true, twoFactorEnabled: false }
  },
  {
    username: "evan_js",
    email: "evan@example.com",
    password: "hashed_password_here",
    role: "user",
    profile: {
      firstName: "Evan",
      lastName: "Wright",
      bio: "Backend specialist.",
      socials: { github: "evan-js" }
    },
    settings: { theme: "dark", notifications: false, twoFactorEnabled: false }
  },
  {
    username: "fiona_flow",
    email: "fiona@example.com",
    password: "hashed_password_here",
    role: "user",
    profile: {
      firstName: "Fiona",
      lastName: "Lee",
      socials: { twitter: "@fiona_flow", github: "fiona-l" }
    },
    settings: { theme: "system", notifications: true, twoFactorEnabled: true }
  },
  {
    username: "george_dev",
    email: "george@example.com",
    password: "hashed_password_here",
    role: "admin",
    profile: {
      firstName: "George",
      lastName: "King",
      bio: "Tech Lead.",
      socials: { github: "gking-dev" }
    },
    settings: { theme: "dark", notifications: true, twoFactorEnabled: true }
  },
  {
    username: "hannah_code",
    email: "hannah@example.com",
    password: "hashed_password_here",
    role: "user",
    profile: {
      firstName: "Hannah",
      lastName: "Scott",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah"
    },
    settings: { theme: "light", notifications: true, twoFactorEnabled: false }
  },
  {
    username: "ian_node",
    email: "ian@example.com",
    password: "hashed_password_here",
    role: "editor",
    profile: {
      firstName: "Ian",
      lastName: "Vance",
      bio: "Node.js enthusiast.",
      socials: { twitter: "@ian_node" }
    },
    settings: { theme: "dark", notifications: true, twoFactorEnabled: false }
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("password123", salt);

    // Update the plain text placeholder with the actual hash
    const usersWithHashes = users.map(u => ({ ...u, password: hash }));

    await User.insertMany(usersWithHashes);
    console.log('✅ 10 Users Seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();