import { useRouter } from "expo-router";
import { MessageCircle, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { mockConversations } from "../../stores/data/mockMessages";

export default function CustomerMessagesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return mockConversations.filter((conversation) =>
      [
        conversation.providerName,
        conversation.service,
        conversation.lastMessage,
        conversation.bookingReference ?? "",
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [search]);

  const totalUnread = mockConversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF7" />

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 32,
          flexGrow: 1,
        }}
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View className="pt-5 pb-6">
              <Text className="text-sm text-gray-500">
                Stay connected with providers
              </Text>

              <Text className="mt-1 text-2xl font-extrabold text-[#171717]">
                Messages
              </Text>
            </View>

            {/* SEARCH */}
            <View className="flex-row items-center px-4 bg-white border border-gray-200 rounded-2xl">
              <Search size={20} color="#559E1C" />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search conversations..."
                placeholderTextColor="#9CA3AF"
                className="h-14 flex-1 pl-3 text-base text-[#171717]"
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <X size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            {/* SECTION */}
            <View className="flex-row items-center justify-between mt-8 mb-4">
              <Text className="text-lg font-bold text-[#171717]">
                Recent Conversations
              </Text>

              {totalUnread > 0 && (
                <View className="rounded-full bg-[#EAF6DF] px-3 py-1.5">
                  <Text className="text-xs font-bold text-[#559E1C]">
                    {totalUnread} unread
                  </Text>
                </View>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/conversation/[id]",
                params: { id: item.id },
              })
            }
            className="p-4 mb-3 bg-white border border-gray-100 rounded-2xl"
          >
            <View className="flex-row items-start gap-3">
              {/* AVATAR */}
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#EAF6DF]">
                <Text className="text-base font-extrabold text-[#559E1C]">
                  {item.providerInitials}
                </Text>
              </View>

              <View className="flex-1">
                {/* NAME AND TIME */}
                <View className="flex-row items-center justify-between gap-2">
                  <Text
                    numberOfLines={1}
                    className="flex-1 text-base font-bold text-[#171717]"
                  >
                    {item.providerName}
                  </Text>

                  <Text className="text-xs text-gray-400">
                    {item.lastMessageTime}
                  </Text>
                </View>

                {/* SERVICE */}
                <Text className="mt-1 text-xs font-semibold text-[#559E1C]">
                  {item.service}
                </Text>

                {/* LAST MESSAGE */}
                <View className="flex-row items-center justify-between gap-2 mt-2">
                  <Text
                    numberOfLines={1}
                    className={`flex-1 text-sm ${
                      item.unreadCount > 0
                        ? "font-semibold text-[#171717]"
                        : "text-gray-500"
                    }`}
                  >
                    {item.lastMessage}
                  </Text>

                  {item.unreadCount > 0 && (
                    <View className="h-6 min-w-6 items-center justify-center rounded-full bg-[#75C928] px-1">
                      <Text className="text-xs font-bold text-[#171717]">
                        {item.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 py-16">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF6DF]">
              <MessageCircle size={30} color="#559E1C" />
            </View>

            <Text className="mt-5 text-lg font-bold text-[#171717]">
              No conversations found
            </Text>

            <Text className="mt-2 text-sm leading-6 text-center text-gray-500">
              Try another search or explore drone providers to start a
              conversation.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
