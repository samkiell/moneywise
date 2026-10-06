import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if not permitted
}

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { TeamMember } from "../models/TeamMember";
import { Category } from "../models/Category";
import { Publication } from "../models/Publication";

const INITIAL_TEAM_MEMBERS = [
  {
    name: "Bello Oluwaferanmi Enoch",
    role: "Chief Editor",
    displayOrder: 1,
    active: true,
  },
  {
    name: "Odedele, Rereloluwa Oluwasegun",
    role: "Articles Copy Editor",
    displayOrder: 2,
    active: true,
  },
  {
    name: "Fagbewesa Adeola Ayomide",
    role: "Stories Copy Editor",
    displayOrder: 3,
    active: true,
  },
  {
    name: "John Kolade Akande",
    role: "Stories Line Editor",
    displayOrder: 4,
    active: true,
  },
  {
    name: "Adeshola, Faridah Eniola",
    role: "Articles Line Editor",
    displayOrder: 5,
    active: true,
  },
];

const INITIAL_CATEGORIES = [
  {
    name: "Financial Literacy",
    slug: "financial-literacy",
    description: "Demystifying savings, budgeting, investments, and personal financial decisions.",
    type: "all",
  },
  {
    name: "Career Development",
    slug: "career-development",
    description: "Navigating early professional career paths, internships, and growth.",
    type: "all",
  },
  {
    name: "Digital Literacy",
    slug: "digital-literacy",
    description: "Harnessing technology, tools, and the digital knowledge economy.",
    type: "all",
  },
  {
    name: "Entrepreneurial Development",
    slug: "entrepreneurial-development",
    description: "Lessons on building sustainable ventures and student enterprises.",
    type: "all",
  },
  {
    name: "Quality Connections",
    slug: "quality-connections",
    description: "Cultivating purposeful community, collaboration, and mentorship networks.",
    type: "all",
  },
];

const SAMPLE_PUBLICATIONS = [
  {
    title: "The Art of Intentional Campus Budgeting",
    slug: "the-art-of-intentional-campus-budgeting",
    type: "tabloid",
    excerpt: "A practical framework for students balancing academic expenses, food, and emergency savings.",
    content: "<h2>Building Financial Clarity on Campus</h2><p>Managing money in a university environment requires more than willpower; it demands a clear, sustainable system. By separating non-negotiable living costs from discretionary spending, students can avoid mid-semester financial distress.</p><blockquote>Budgeting is not about deprivation; it is about allocating resources toward what genuinely matters.</blockquote><p>Start with a simple tracking habit: note every expense for seven days to understand where capital actually flows.</p>",
    author: "Bello Oluwaferanmi Enoch",
    category: "Financial Literacy",
    tags: ["budgeting", "student-finance", "savings"],
    status: "published",
    featured: true,
    readingTime: 4,
    publishedAt: new Date(),
  },
  {
    title: "Echoes of the Quad: Stories of Growth and Resilience",
    slug: "echoes-of-the-quad",
    type: "story",
    excerpt: "A reflective narrative on student aspirations, community connections, and finding purpose at OAU.",
    content: "<h2>Between Lecture Halls and Long Walks</h2><p>The afternoon sun cuts through the trees lining the academic quad. Here, conversations shift seamlessly from upcoming examinations to dreams of building ventures that outlast campus gates.</p><p>Every story shared among community members reveals a shared pursuit: the courage to learn, the drive to create, and the vision to empower.</p>",
    author: "Fagbewesa Adeola Ayomide",
    category: "Quality Connections",
    tags: ["campus-life", "community", "resilience"],
    status: "published",
    featured: false,
    readingTime: 3,
    publishedAt: new Date(),
  },
];

async function runSeed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Error: MONGODB_URI environment variable is required to run seed.");
    process.exit(1);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "Error: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD environment variables are required."
    );
    console.error(
      "Please set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in your .env or environment before running db:seed."
    );
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || "moneywise",
  });
  console.log("MongoDB connection established.");

  // 1. Seed Categories (Idempotent upsert by slug)
  console.log("Seeding categories...");
  for (const cat of INITIAL_CATEGORIES) {
    await Category.findOneAndUpdate({ slug: cat.slug }, { $set: cat }, { upsert: true, new: true });
  }
  console.log(`Seeded ${INITIAL_CATEGORIES.length} categories.`);

  // 2. Seed Team Members (Idempotent upsert by name)
  console.log("Seeding editorial team...");
  for (const member of INITIAL_TEAM_MEMBERS) {
    await TeamMember.findOneAndUpdate(
      { name: member.name },
      { $set: member },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${INITIAL_TEAM_MEMBERS.length} team members.`);

  // 3. Seed Sample Publications (Idempotent upsert by slug)
  console.log("Seeding initial publications...");
  for (const pub of SAMPLE_PUBLICATIONS) {
    await Publication.findOneAndUpdate(
      { slug: pub.slug },
      { $set: pub },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${SAMPLE_PUBLICATIONS.length} publications.`);

  // 4. Seed Admin User (Idempotent upsert by email)
  console.log(`Seeding development admin user (${adminEmail})...`);
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await User.findOneAndUpdate(
    { email: adminEmail.toLowerCase() },
    {
      $set: {
        name: "Money Wise Admin",
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        role: "admin",
        active: true,
      },
    },
    { upsert: true, new: true }
  );
  console.log("Development admin user seeded successfully.");

  console.log("Database seed completed successfully.");
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error("Database seed failed with error:", err);
  process.exit(1);
});
