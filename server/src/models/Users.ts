import mongoose, { Schema, Document } from 'mongoose';

// Level 2: Nested Account Settings
interface ISettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  twoFactorEnabled: boolean;
}

// Level 2: Nested Personal Profile
interface IProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  socials: {
    twitter?: string;
    github?: string;
  };
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string; // Will store hashed password
  role: 'admin' | 'user' | 'editor';
  profile: IProfile;
  settings: ISettings;
  lastLogin?: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user', 'editor'], default: 'user' },

  // Depth Level 2: Personal Profile
  profile: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    socials: {
      twitter: { type: String },
      github: { type: String }
    }
  },

  // Depth Level 2: UI/App Settings
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
    notifications: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false }
  },

  lastLogin: { type: Date }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);