import type { LegalSection } from "@/constants/legal";
import { router } from "expo-router";
import { ArrowLeft, ShieldCheck } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LegalScreenProps = {
  title: string;
  subtitle: string;
  version: string;
  sections: LegalSection[];
};

export default function LegalScreen({
  title,
  subtitle,
  version,
  sections,
}: LegalScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="items-center justify-center mt-4 h-11 w-11 rounded-xl bg-surface"
        >
          <ArrowLeft size={22} color="#171717" />
        </Pressable>

        <View className="mt-8">
          <View className="items-center justify-center mb-5 h-14 w-14 rounded-2xl bg-green-50">
            <ShieldCheck size={28} color="#559E1C" />
          </View>

          <Text className="text-3xl font-bold text-charcoal">{title}</Text>

          <Text className="mt-3 text-base leading-6 text-gray-500">
            {subtitle}
          </Text>

          <Text className="mt-3 text-xs text-gray-400">Version {version}</Text>
        </View>

        <View className="h-px mt-8 bg-gray-200" />

        {sections.map((section, index) => (
          <View key={index} className="mt-7">
            <Text className="text-lg font-bold text-charcoal">
              {section.heading}
            </Text>

            <Text className="mt-3 text-sm leading-6 text-gray-600">
              {section.body}
            </Text>
          </View>
        ))}

        <View className="p-5 mt-10 rounded-2xl bg-green-50">
          <Text className="text-sm leading-6 text-gray-600">
            For questions about this policy, please contact ApusFly through its
            official support channels.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
