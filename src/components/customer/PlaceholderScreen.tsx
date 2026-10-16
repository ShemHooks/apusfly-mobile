import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
};

export default function PlaceholderScreen({ title, description, icon }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-[#F8FAF7] px-8">
      <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-[#EAF6DF]">
        {icon}
      </View>

      <Text className="text-center text-2xl font-bold text-[#171717]">
        {title}
      </Text>

      <Text className="mt-3 text-base leading-6 text-center text-gray-500">
        {description}
      </Text>

      <Text className="mt-8 text-xs font-medium text-gray-400">
        ApusFly Customer App
      </Text>
    </View>
  );
}
