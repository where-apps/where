export type User = {
  id: string;
  username: string | null;
  isAnonymous: boolean;
  points: number;
  authProvider?: 'email' | 'google' | 'farcaster' | 'guest';
  profileImage?: string | null;
};

export type Rating = {
  security: number;
  violence: number;
  welcoming: number;
  streetFood: number;
  restaurants: number;
  pickpocketing: number;
  qualityOfLife: number;
  hookers: number;
};

export type Comment = {
  id: string;
  userId: string;
  username: string | null;
  isAnonymous: boolean;
  text: string;
  createdAt: number;
};

export type Contributor = {
  userId: string;
  username: string | null;
  isAnonymous: boolean;
  contribution: 'image' | 'verification' | 'rating' | 'comment';
  createdAt: number;
};

export type Location = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  images: string[];
  ratings: Rating;
  ratingCount: number;
  comments: Comment[];
  createdBy: string;
  createdAt: number;
  verified: boolean;
  verificationCount: number;
  contributors: Contributor[];
  allImages: string[];
};

export type PointActivity = {
  id: string;
  userId: string;
  locationId: string;
  activityType: 'create_location' | 'add_image' | 'verify_location' | 'rate_location' | 'comment' | 'receive_engagement' | 'like_image' | 'referral';
  points: number;
  createdAt: number;
  metadata?: {
    imageUrl?: string;
    referralCode?: string;
  };
};
