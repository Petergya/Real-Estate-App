import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, functions } from '../lib/firebase';

interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt?: { toDate: () => Date };
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db || !user) {
      setConversations([]);
      setIsLoading(false);
      return;
    }

    return onSnapshot(
      query(collection(db, 'conversations'), where('participants', 'array-contains', user.id)),
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Conversation));
        setConversations(items.sort((left, right) => right.id.localeCompare(left.id)));
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error('Unable to load conversations', snapshotError);
        setError('Unable to load your conversations.');
        setIsLoading(false);
      },
    );
  }, [user]);

  useEffect(() => {
    if (!propertyId || !user || !functions) return;
    let cancelled = false;
    setIsStarting(true);
    setError('');
    const startConversation = httpsCallable<{ propertyId: string }, { conversationId: string }>(
      functions,
      'startPropertyConversation',
    );
    void startConversation({ propertyId })
      .then(({ data }) => {
        if (!cancelled) setActiveConversationId(data.conversationId);
      })
      .catch((startError: unknown) => {
        console.error('Unable to start property conversation', startError);
        if (!cancelled) setError(startError instanceof Error ? startError.message : 'Unable to start this conversation.');
      })
      .finally(() => {
        if (!cancelled) setIsStarting(false);
      });
    return () => { cancelled = true; };
  }, [propertyId, user]);

  useEffect(() => {
    if (!db || !activeConversationId) {
      setMessages([]);
      return;
    }
    return onSnapshot(
      query(
        collection(db, 'conversations', activeConversationId, 'messages'),
        orderBy('createdAt', 'asc'),
      ),
      (snapshot) => {
        setMessages(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ChatMessage)));
      },
      (snapshotError) => {
        console.error('Unable to load conversation messages', snapshotError);
        setError('Unable to load messages for this conversation.');
      },
    );
  }, [activeConversationId]);

  const activeConversation = conversations.find((item) => item.id === activeConversationId);
  const otherParticipantName = useMemo(() => {
    if (!activeConversation || !user) return '';
    const otherId = activeConversation.participants.find((participantId) => participantId !== user.id);
    return otherId ? activeConversation.participantNames[otherId] || 'Property contact' : 'Property contact';
  }, [activeConversation, user]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!db || !user || !activeConversationId || !text || text.length > 4000) return;
    setIsSending(true);
    setError('');
    try {
      const batch = writeBatch(db);
      const messageRef = doc(collection(db, 'conversations', activeConversationId, 'messages'));
      batch.set(messageRef, {
        senderId: user.id,
        senderName: user.name,
        text,
        createdAt: serverTimestamp(),
      });
      batch.update(doc(db, 'conversations', activeConversationId), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      });
      await batch.commit();
      setMessageText('');
    } catch (sendError) {
      console.error('Unable to send message', sendError);
      setError(sendError instanceof Error ? sendError.message : 'Message could not be sent.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-light py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-ink mb-6">Messages</h1>
        {!db && <p className="mb-4 rounded-md bg-amber-50 p-4 text-amber-900">Firebase is not configured. Messaging is unavailable.</p>}
        {error && <p role="alert" className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</p>}

        <div className="grid min-h-[65vh] grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:grid-cols-[320px_1fr]">
          <aside className="border-b border-gray-200 md:border-b-0 md:border-r">
            <h2 className="border-b border-gray-100 px-5 py-4 font-semibold text-ink">Conversations</h2>
            {isLoading || isStarting ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : conversations.length === 0 ? (
              <p className="p-5 text-sm text-gray-500">No conversations yet. Start one from a property listing.</p>
            ) : (
              <ul className="max-h-[65vh] overflow-y-auto">
                {conversations.map((conversation) => {
                  const otherId = conversation.participants.find((participantId) => participantId !== user?.id);
                  return (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        onClick={() => setActiveConversationId(conversation.id)}
                        className={`w-full border-b border-gray-100 px-5 py-4 text-left hover:bg-blue-50 ${activeConversationId === conversation.id ? 'bg-blue-50' : ''}`}
                      >
                        <span className="block font-medium text-ink">{conversation.participantNames[otherId || ''] || 'Property contact'}</span>
                        <span className="block truncate text-xs text-gray-500">{conversation.propertyTitle}</span>
                        <span className="mt-1 block truncate text-sm text-gray-600">{conversation.lastMessage || 'Conversation started'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <section className="flex min-h-[60vh] flex-col">
            {activeConversation ? (
              <>
                <header className="border-b border-gray-100 px-5 py-4">
                  <h2 className="font-semibold text-ink">{otherParticipantName}</h2>
                  <p className="text-sm text-gray-500">{activeConversation.propertyTitle}</p>
                </header>
                <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${message.senderId === user?.id ? 'bg-primary text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                        <p className="whitespace-pre-wrap break-words">{message.text}</p>
                        <p className={`mt-1 text-right text-xs ${message.senderId === user?.id ? 'text-white/70' : 'text-gray-400'}`}>
                          {message.createdAt?.toDate().toLocaleString() || 'Sending…'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-100 p-4">
                  <input
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    maxLength={4000}
                    placeholder="Write a message…"
                    className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button disabled={isSending || !messageText.trim()} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-secondary disabled:opacity-50">
                    <Send className="h-4 w-4" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-gray-500">
                <MessageSquare className="mb-3 h-12 w-12 text-gray-300" />
                <p>Select a conversation or start one from a property page.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;
