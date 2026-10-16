import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  FileText,
  Link2,
  LockKeyhole,
  LogOut,
  MapPin,
  ShieldCheck,
  UserRound,
} from "lucide-react-native";
import { ComponentType } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuItem = {
  label: string;
  icon: ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  description: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuSections: MenuSection[] = [
  {
    title: "Account",
    items: [
      {
        label: "Personal Information",
        icon: UserRound,
        description: "Update your name and contact details",
      },
      {
        label: "Saved Addresses",
        icon: MapPin,
        description: "Manage your service locations",
      },
      {
        label: "Connected Accounts",
        icon: Link2,
        description: "Manage Google and Apple sign-in",
      },
    ],
  },
  {
    title: "Security",
    items: [
      {
        label: "Password & Security",
        icon: LockKeyhole,
        description: "Manage password and account security",
      },
      {
        label: "Privacy & Permissions",
        icon: ShieldCheck,
        description: "Control your privacy preferences",
      },
    ],
  },
  {
    title: "Preferences & Support",
    items: [
      {
        label: "Notifications",
        icon: Bell,
        description: "Manage alerts and updates",
      },
      {
        label: "Help & Support",
        icon: CircleHelp,
        description: "Get assistance with ApusFly",
      },
      {
        label: "Terms & Privacy",
        icon: FileText,
        description: "Read our policies",
      },
    ],
  },
];

const customer = {
  name: "Customer Account",
  email: "customer@example.com",
  emailVerified: true,
};

export default function CustomerProfileScreen() {
  const router = useRouter();

  const handleMenuPress = (item: MenuItem) => {
    Alert.alert(
      item.label,
      `${item.description}.\n\nThis feature will be connected during the next development phase.`,
    );
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out of ApusFly?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          if (__DEV__) {
            router.replace("/login");
            return;
          }

          Alert.alert(
            "Unavailable",
            "Account sign-out will be available after authentication is connected.",
          );
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF7" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
      >
        {/* HEADER */}
        <View className="pt-5 pb-6">
          <Text className="text-sm text-gray-500">Manage your account</Text>

          <Text className="mt-1 text-2xl font-extrabold text-[#171717]">
            My Profile
          </Text>
        </View>

        {/* CUSTOMER INFORMATION */}
        <Pressable
          onPress={() =>
            Alert.alert(
              "Personal Information",
              "Profile editing will be available once the account API is connected.",
            )
          }
          className="p-5 bg-white border border-gray-100 rounded-3xl"
        >
          <View className="flex-row items-center gap-4">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EAF6DF]">
              <UserRound size={30} color="#559E1C" strokeWidth={1.8} />
            </View>

            <View className="flex-1">
              <Text
                numberOfLines={1}
                className="text-lg font-extrabold text-[#171717]"
              >
                {customer.name}
              </Text>

              <Text numberOfLines={1} className="mt-1 text-sm text-gray-500">
                {customer.email}
              </Text>

              {customer.emailVerified && (
                <View className="flex-row items-center gap-1 mt-2">
                  <CircleCheck size={14} color="#559E1C" />

                  <Text className="text-xs font-semibold text-[#559E1C]">
                    Email verified (sample)
                  </Text>
                </View>
              )}
            </View>

            <ChevronRight size={20} color="#9CA3AF" />
          </View>
        </Pressable>

        {/* MENU SECTIONS */}
        {menuSections.map((section) => (
          <View key={section.title} className="mt-8">
            <Text className="mb-3 text-sm font-bold text-gray-500">
              {section.title}
            </Text>

            <View className="overflow-hidden bg-white border border-gray-100 rounded-2xl">
              {section.items.map((item, index) => {
                const Icon = item.icon;

                return (
                  <View key={item.label}>
                    <Pressable
                      onPress={() => handleMenuPress(item)}
                      className="flex-row items-center px-4 py-4 active:bg-gray-50"
                    >
                      <View className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-[#F0F8E9]">
                        <Icon size={21} color="#559E1C" strokeWidth={1.8} />
                      </View>

                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-[#171717]">
                          {item.label}
                        </Text>

                        <Text
                          numberOfLines={1}
                          className="mt-1 text-xs text-gray-400"
                        >
                          {item.description}
                        </Text>
                      </View>

                      <ChevronRight size={18} color="#9CA3AF" />
                    </Pressable>

                    {index < section.items.length - 1 && (
                      <View className="ml-[76px] h-px bg-gray-100" />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {/* SIGN OUT */}
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-3 py-4 bg-white border border-red-200 mt-9 rounded-2xl active:bg-red-50"
        >
          <LogOut size={20} color="#B91C1C" />

          <Text className="text-base font-bold text-[#B91C1C]">Sign Out</Text>
        </Pressable>

        {/* FOOTER */}
        <View className="items-center mt-9">
          <Text className="text-xs font-bold tracking-widest text-gray-400">
            APUSFLY
          </Text>

          <Text className="mt-2 text-xs text-gray-400">
            Your Vision. Our Wings.
          </Text>

          <Text className="mt-3 text-xs text-gray-400">
            Development Preview
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
