import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Document,
  type Suggestion,
  suggestion,
  type Message,
  message,
  vote,
  documentSection,
  type DocumentSection,
  documentAnnotation,
  type DocumentAnnotation,
} from './schema';
import { ArtifactKind } from '@/components/artifact';

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error('Failed to create user in database');
    throw error;
  }
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,
      kind,
      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}

/**
 * Save a document with blob storage information
 * @param params Document parameters
 * @returns Database operation result
 */
export async function saveDocumentWithBlob({
  id,
  title,
  kind,
  content,
  userId,
  fileName,
  fileType,
  fileSize,
  blobUrl,
  pageCount,
  wordCount,
  lastModified,
}: {
  id: string;
  title: string;
  kind: 'text' | 'code' | 'image' | 'sheet' | 'legal';
  content?: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'md';
  fileSize: number;
  blobUrl: string;
  pageCount?: number;
  wordCount?: number;
  lastModified?: Date;
}) {
  try {
    const documentData = {
      id,
      title,
      kind,
      content,
      userId,
      fileName,
      fileType,
      fileSize,
      blobUrl,
      pageCount,
      wordCount,
      lastModified,
      createdAt: new Date(),
      isAnalyzed: false,
    };
    
    return await db.insert(document).values(documentData);
  } catch (error) {
    console.error('Failed to save document with blob in database', error);
    throw error;
  }
}

/**
 * Get documents by user ID
 * @param params User ID
 * @returns Array of documents
 */
export async function getDocumentsByUserId({ userId }: { userId: string }) {
  try {
    return await db
      .select()
      .from(document)
      .where(eq(document.userId, userId))
      .orderBy(desc(document.createdAt));
  } catch (error) {
    console.error('Failed to get documents by user ID from database', error);
    throw error;
  }
}

/**
 * Update document analysis status
 * @param params Document ID and analysis status
 * @returns Database operation result
 */
export async function updateDocumentAnalysisStatus({
  id,
  isAnalyzed,
}: {
  id: string;
  isAnalyzed: boolean;
}) {
  try {
    return await db
      .update(document)
      .set({ isAnalyzed })
      .where(eq(document.id, id));
  } catch (error) {
    console.error('Failed to update document analysis status in database', error);
    throw error;
  }
}

/**
 * Delete document by ID
 * @param params Document ID
 * @returns Database operation result
 */
export async function deleteDocumentById({ id }: { id: string }) {
  try {
    // Delete related document sections
    await db
      .delete(documentSection)
      .where(eq(documentSection.documentId, id));
    
    // Delete related document annotations
    await db
      .delete(documentAnnotation)
      .where(eq(documentAnnotation.documentId, id));
    
    // Delete related suggestions
    await db
      .delete(suggestion)
      .where(eq(suggestion.documentId, id));
    
    // Delete the document
    return await db
      .delete(document)
      .where(eq(document.id, id));
  } catch (error) {
    console.error('Failed to delete document by ID from database', error);
    throw error;
  }
}

/**
 * Save document sections
 * @param params Document sections
 * @returns Database operation result
 */
export async function saveDocumentSections({
  sections,
}: {
  sections: Array<DocumentSection>;
}) {
  try {
    return await db.insert(documentSection).values(sections);
  } catch (error) {
    console.error('Failed to save document sections in database', error);
    throw error;
  }
}

/**
 * Get document sections by document ID
 * @param params Document ID
 * @returns Array of document sections
 */
export async function getDocumentSectionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(documentSection)
      .where(eq(documentSection.documentId, documentId))
      .orderBy(asc(documentSection.startIndex));
  } catch (error) {
    console.error('Failed to get document sections by document ID from database', error);
    throw error;
  }
}

/**
 * Save document annotations
 * @param params Document annotations
 * @returns Database operation result
 */
export async function saveDocumentAnnotations({
  annotations,
}: {
  annotations: Array<DocumentAnnotation>;
}) {
  try {
    return await db.insert(documentAnnotation).values(annotations);
  } catch (error) {
    console.error('Failed to save document annotations in database', error);
    throw error;
  }
}

/**
 * Get document annotations by document ID
 * @param params Document ID
 * @returns Array of document annotations
 */
export async function getDocumentAnnotationsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(documentAnnotation)
      .where(eq(documentAnnotation.documentId, documentId))
      .orderBy(asc(documentAnnotation.startIndex));
  } catch (error) {
    console.error('Failed to get document annotations by document ID from database', error);
    throw error;
  }
}

/**
 * Update document annotation resolution status
 * @param params Annotation ID and resolution status
 * @returns Database operation result
 */
export async function updateDocumentAnnotationResolution({
  id,
  isResolved,
}: {
  id: string;
  isResolved: boolean;
}) {
  try {
    return await db
      .update(documentAnnotation)
      .set({ isResolved })
      .where(eq(documentAnnotation.id, id));
  } catch (error) {
    console.error('Failed to update document annotation resolution in database', error);
    throw error;
  }
}
