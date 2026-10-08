import { router } from "expo-router";
import { ArrowLeft, Building2, Plane, UserRound } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Find and book professional drone services.",
    Icon: UserRound,
  },
  {
    id: "provider",
    title: "Service Provider",
    description: "Offer drone services and manage your operations.",
    Icon: Building2,
  },
  {
    id: "pilot",
    title: "Drone Pilot",
    description: "Manage your profile and fulfill assigned drone jobs.",
    Icon: Plane,
  },
] as const;

export default function RoleSelectionScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        className="px-6"
      >
        <Pressable
          onPress={() => router.back()}
          className="mt-4 h-11 w-11 items-center justify-center rounded-xl bg-surface"
        >
          <ArrowLeft size={22} color="#171717" />
        </Pressable>

        <Text className="mt-10 text-3xl font-bold text-charcoal">
          Join ApusFly
        </Text>

        <Text className="mt-3 text-base leading-6 text-gray-500">
          How would you like to use ApusFly?
        </Text>

        <View className="mt-10 gap-4">
          {roles.map(({ id, title, description, Icon }) => (
            <Pressable
              key={id}
              onPress={() =>
                router.push({
                  pathname: "/register",
                  params: { role: id },
                })
              }
              className="flex-row items-center rounded-2xl border border-gray-200 bg-white p-5 active:border-primary active:bg-green-50"
            >
              <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                <Icon size={26} color="#559E1C" />
              </View>

              <View className="flex-1">
                <Text className="text-lg font-bold text-charcoal">{title}</Text>
                <Text className="mt-1 text-sm leading-5 text-gray-500">
                  {description}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View className="mt-auto pt-10">
          <Text className="text-center text-sm text-gray-500">
            Already have an account?
          </Text>

          <Pressable
            onPress={() => router.push("/login")}
            className="mt-2 items-center p-3"
          >
            <Text className="font-semibold text-primary-dark">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
