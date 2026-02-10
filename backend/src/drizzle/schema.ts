import {
    pgTable,
    uuid,
    text,
    timestamp,
    primaryKey,
    integer,
    pgEnum,
    customType,
    jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Custom bytea type for Y.js update vector
const bytea = customType<{ data: Buffer; driverData: Buffer }>({
    dataType() {
        return 'bytea';
    },
});

// Enums
export const roleEnum = pgEnum('role', ['VIEWER', 'EDITOR', 'ADMIN']);
export const statusEnum = pgEnum('status', ['PENDING', 'ACCEPTED', 'REJECTED']);

// --- Part A: NextAuth Standard Tables ---

export const users = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    passwordHash: text("passwordHash"), // For credential-based auth
});

export const accounts = pgTable(
    "account",
    {
        userId: uuid("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

// --- Part B: CRMP Custom Tables ---

export const documents = pgTable("documents", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").default('Untitled').notNull(),
    ownerId: uuid("ownerId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    binaryContent: bytea("binaryContent"), // Y.js update vector
    currentContent: jsonb("currentContent"), // Latest readable JSON state
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const documentVersions = pgTable("document_versions", {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("documentId")
        .notNull()
        .references(() => documents.id, { onDelete: "cascade" }),
    content: jsonb("content").notNull(), // Stores the Tiptap JSON
    versionName: text("versionName"), // Optional e.g., 'Draft 1'
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    createdBy: uuid("createdBy")
        .notNull()
        .references(() => users.id),
});

export const documentAccess = pgTable("document_access", {
    userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    documentId: uuid("documentId")
        .notNull()
        .references(() => documents.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull().default('VIEWER'),
    status: statusEnum("status").notNull().default('PENDING'),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.documentId] }),
}));

// --- Relations ---

export const usersRelations = relations(users, ({ many }) => ({
    accounts: many(accounts),
    sessions: many(sessions),
    documents: many(documents),
    sharedDocuments: many(documentAccess),
    createdVersions: many(documentVersions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
    owner: one(users, {
        fields: [documents.ownerId],
        references: [users.id],
    }),
    accessList: many(documentAccess),
    versions: many(documentVersions),
}));

export const documentVersionsRelations = relations(documentVersions, ({ one }) => ({
    document: one(documents, {
        fields: [documentVersions.documentId],
        references: [documents.id],
    }),
    creator: one(users, {
        fields: [documentVersions.createdBy],
        references: [users.id],
    }),
}));

export const documentAccessRelations = relations(documentAccess, ({ one }) => ({
    user: one(users, {
        fields: [documentAccess.userId],
        references: [users.id],
    }),
    document: one(documents, {
        fields: [documentAccess.documentId],
        references: [documents.id],
    }),
}));
