import AppButton from "@/components/ui/AppButton";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1 px-6">
        {/* Logo section */}
        <View className="flex-[3] items-center justify-center">
          <Image
            source={require("../../assets/photos/logo.png")}
            className="h-64 w-64"
            resizeMode="contain"
            accessibilityLabel="ApusFly logo"
          />

          <Text className="mt-2 text-center text-base text-gray-500">
            Your drone services, one tap away.
          </Text>
        </View>

        {/* Action section */}
        <View className="flex-[2] justify-center">
          <View className="gap-4">
            <AppButton
              title="Get Started"
              onPress={() => router.push("/role-selection")}
            />

            <AppButton
              title="Sign In"
              variant="outline"
              onPress={() => router.push("/login")}
            />

            <Text className="mt-4 text-center text-xs text-gray-400">
              Discover. Book. Fly.
            </Text>
          </View>
        </View>
      </View>
      {/* Footer */}
      <View className="items-center pb-4 pt-2">
        <Text className="text-center text-xs text-gray-400">
          © 2026 ApusFly. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
}
