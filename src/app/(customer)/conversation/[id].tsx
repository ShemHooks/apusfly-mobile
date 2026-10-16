import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CalendarDays, Send } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Message,
  mockConversations,
  mockMessages,
} from "../../../stores/data/mockMessages";

export default function ConversationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const listRef = useRef<FlatList<Message>>(null);

  const conversation = mockConversations.find((item) => item.id === id);

  const [messageText, setMessageText] = useState("");

  const [messages, setMessages] = useState<Message[]>(() =>
    mockMessages.filter((message) => message.conversationId === id),
  );

  useEffect(() => {
    setMessages(
      mockMessages.filter((message) => message.conversationId === id),
    );
  }, [id]);

  const sendMessage = () => {
    const text = messageText.trim();

    if (!text || !conversation) return;

    const newMessage: Message = {
      id: `${Date.now()}`,
      conversationId: conversation.id,
      sender: "customer",
      text,
      time: new Date().toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((current) => [...current, newMessage]);

    setMessageText("");
  };

  if (!conversation) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="text-lg font-bold text-[#171717]">
          Conversation not found
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-[#75C928] px-6 py-3"
        >
          <Text className="font-bold text-[#171717]">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* CHAT HEADER */}
        <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
          <Pressable
            onPress={() => router.back()}
            className="items-center justify-center w-10 h-10 mr-3"
          >
            <ArrowLeft size={23} color="#171717" />
          </Pressable>

          <View className="mr-3 h-11 w-11 items-center justify-center rounded-full bg-[#EAF6DF]">
            <Text className="font-extrabold text-[#559E1C]">
              {conversation.providerInitials}
            </Text>
          </View>

          <View className="flex-1">
            <Text
              numberOfLines={1}
              className="text-base font-bold text-[#171717]"
            >
              {conversation.providerName}
            </Text>

            <Text numberOfLines={1} className="mt-1 text-xs text-gray-500">
              {conversation.service}
            </Text>
          </View>
        </View>

        {/* BOOKING CONTEXT */}
        {conversation.bookingReference && (
          <View className="flex-row items-center gap-3 border-b border-[#DDEECD] bg-[#F0F8E9] px-5 py-3">
            <CalendarDays size={19} color="#559E1C" />

            <View className="flex-1">
              <Text className="text-xs text-gray-500">Related Booking</Text>

              <Text className="mt-1 text-sm font-bold text-[#171717]">
                {conversation.bookingReference}
              </Text>
            </View>
          </View>
        )}

        {/* MESSAGES */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({
              animated: true,
            })
          }
          renderItem={({ item }) => {
            const isCustomer = item.sender === "customer";

            return (
              <View
                className={`mb-3 ${isCustomer ? "items-end" : "items-start"}`}
              >
                <View
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isCustomer
                      ? "rounded-br-md bg-[#75C928]"
                      : "rounded-bl-md border border-gray-100 bg-white"
                  }`}
                >
                  <Text className="text-sm leading-6 text-[#171717]">
                    {item.text}
                  </Text>

                  <Text
                    className={`mt-1 text-right text-[10px] ${
                      isCustomer ? "text-[#3D6818]" : "text-gray-400"
                    }`}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* MESSAGE COMPOSER */}
        <View className="flex-row items-end gap-3 px-4 py-3 bg-white border-t border-gray-100">
          <TextInput
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={2000}
            className="max-h-28 min-h-12 flex-1 rounded-2xl bg-[#F3F4F6] px-4 py-3 text-sm text-[#171717]"
            style={{
              textAlignVertical: "center",
            }}
          />

          <Pressable
            onPress={sendMessage}
            disabled={!messageText.trim()}
            className={`h-12 w-12 items-center justify-center rounded-2xl ${
              messageText.trim() ? "bg-[#75C928]" : "bg-gray-200"
            }`}
          >
            <Send
              size={21}
              color={messageText.trim() ? "#171717" : "#9CA3AF"}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
