import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ChatService, ChatMessage, ChatUser } from '@/lib/services/chat-service';
import { BridgeService } from '@/lib/services/bridge-service';

export default function ChatScreen() {
  const { colors } = useTheme();
  const { bridgeId } = useLocalSearchParams<{ bridgeId: string }>();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeChat();
  }, [bridgeId]);

  const initializeChat = async () => {
    try {
      setIsInitializing(true);
      
      // Get bridge data to find the matched user
      const bridgesWithSnapshots = await BridgeService.getBridgesWithSnapshots();
      const currentBridge = bridgesWithSnapshots.find(b => b.id === bridgeId);
      
      if (!currentBridge) {
        Alert.alert('Error', 'Bridge not found');
        router.back();
        return;
      }

      // Determine which snapshot is the "other" user (not the current user)
      // For now, we'll use the rightSnapshot as the other user
      const otherSnapshot = currentBridge.rightSnapshot;
      
      const user: ChatUser = {
        displayName: otherSnapshot.userId.charAt(0).toUpperCase() + otherSnapshot.userId.slice(1),
        photoURL: '',
        city: 'Unknown City',
        themes: otherSnapshot.themes,
        description: otherSnapshot.text || 'Cultural moment shared'
      };

      setChatUser(user);

      // Add welcome message
      const welcomeMessage = ChatService.createMessage(
        `Hi! I'm ${user.displayName}. I saw your cultural moment about ${otherSnapshot.themes.join(' and ')} and I'd love to share my knowledge with you! What would you like to learn?`,
        false
      );
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to load chat');
      router.back();
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !chatUser) return;

    const userMessage = ChatService.createMessage(inputText.trim(), true);
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ChatService.generateResponse(
        userMessage.text,
        chatUser,
        messages
      );
      
      const botMessage = ChatService.createMessage(response, false);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = ChatService.createMessage(
        "I'm having trouble responding right now, but I'm still here to help!",
        false
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      {!item.isUser && (
        chatUser?.photoURL ? (
          <Image source={{ uri: chatUser.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {chatUser?.displayName?.charAt(0) || '?'}
            </Text>
          </View>
        )
      )}
      <View style={[
        styles.messageBubble,
        item.isUser ? [styles.userBubble, { backgroundColor: colors.primary }] : [styles.botBubble, { backgroundColor: colors.surface }]
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : [styles.botText, { color: colors.text.primary }]
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : [styles.botTimestamp, { color: colors.text.secondary }]
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  if (isInitializing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Starting conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          {chatUser?.photoURL ? (
          <Image source={{ uri: chatUser.photoURL }} style={styles.headerAvatar} />
        ) : (
          <View style={[styles.headerAvatar, styles.placeholderAvatar]}>
            <Text style={[styles.placeholderText, { color: colors.text.muted }]}>
              {chatUser?.displayName?.charAt(0) || '?'}
            </Text>
          </View>
        )}
          <View>
            <Text style={[styles.headerName, { color: colors.text.primary }]}>{chatUser?.displayName}</Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>Skill Sharing Chat</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TextInput
            style={[styles.textInput, { borderColor: colors.border, color: colors.text.primary }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about their skills..."
            placeholderTextColor={colors.text.secondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: theme.spacing.xs,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: theme.colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  botTimestamp: {
    color: theme.colors.text.secondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    maxHeight: 100,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.text.secondary,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  placeholderAvatar: {
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.colors.text.muted,
    fontSize: 16,
    fontWeight: '600',
  },
});
