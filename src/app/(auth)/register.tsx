import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Building2, Plane, UserRound } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";

const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required."),
    lastName: z.string().trim().min(2, "Last name is required."),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z
      .string()
      .regex(/^09\d{9}$/, "Enter a valid PH mobile number (09XXXXXXXXX)."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const accountTypes = {
  customer: {
    title: "Customer Account",
    description: "Book professional drone services.",
    Icon: UserRound,
  },
  provider: {
    title: "Service Provider Account",
    description: "Offer and manage drone services.",
    Icon: Building2,
  },
  pilot: {
    title: "Drone Pilot Account",
    description: "Manage drone assignments.",
    Icon: Plane,
  },
} as const;

type AccountRole = keyof typeof accountTypes;

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role?: string }>();

  const selectedRole: AccountRole | null =
    typeof role === "string" && role in accountTypes
      ? (role as AccountRole)
      : null;

  const account = selectedRole ? accountTypes[selectedRole] : null;
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    if (!selectedRole) {
      Alert.alert("Select an account type", "Please choose a role first.");
      return;
    }

    if (!acceptedTerms) {
      Alert.alert(
        "Agreement required",
        "Please accept the Terms of Service and Privacy Policy.",
      );
      return;
    }

    // UI validation only. No account is created yet.
    // Do not log passwords or other registration credentials.
    console.log("Registration validated:", selectedRole);

    Alert.alert(
      "Form validated",
      "Your registration details are valid. Account creation will be available after API integration.",
    );
  };

  if (!account) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 px-6 bg-white">
        <Text className="mb-5 text-lg font-semibold text-center text-charcoal">
          Please select an account type first.
        </Text>
        <AppButton
          title="Choose Account Type"
          onPress={() => router.replace("/role-selection")}
        />
      </SafeAreaView>
    );
  }

  const AccountIcon = account.Icon;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
          className="items-center justify-center mt-4 h-11 w-11 rounded-xl bg-surface"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#171717" />
        </Pressable>

        <Text className="mt-8 text-3xl font-bold text-charcoal">
          Create your account
        </Text>

        <Text className="mt-2 text-base text-gray-500">
          Join ApusFly and get started.
        </Text>

        {/* Selected account type */}
        <View className="flex-row items-center p-4 border border-green-200 mt-7 rounded-2xl bg-green-50">
          <View className="items-center justify-center w-12 h-12 mr-4 bg-white rounded-xl">
            <AccountIcon size={25} color="#559E1C" />
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-charcoal">
              {account.title}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {account.description}
            </Text>
          </View>
        </View>

        {/* Registration fields */}
        <View className="mt-8">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="First Name"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Last Name"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="example@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Phone Number"
                placeholder="09XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="At least 8 characters"
                isPassword
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                isPassword
                autoComplete="new-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </View>

        {/* Terms agreement */}
        <View className="flex-row items-start gap-3 mb-8">
          <Pressable
            onPress={() => setAcceptedTerms((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityLabel="Agree to Terms of Service and Privacy Policy"
            accessibilityState={{ checked: acceptedTerms }}
            className={`mt-1 h-6 w-6 items-center justify-center rounded-md border ${
              acceptedTerms
                ? "border-primary bg-primary"
                : "border-gray-400 bg-white"
            }`}
          >
            {acceptedTerms && (
              <Text className="font-bold text-charcoal">✓</Text>
            )}
          </Pressable>

          <View className="flex-1">
            <Text className="text-sm leading-6 text-gray-600">
              I have read and agree to the
            </Text>

            <View className="flex-row flex-wrap items-center">
              <Pressable onPress={() => router.push("/terms")}>
                <Text className="text-sm font-semibold text-primary-dark">
                  Terms of Service
                </Text>
              </Pressable>

              <Text className="text-sm text-gray-600"> and </Text>

              <Pressable onPress={() => router.push("/privacy")}>
                <Text className="text-sm font-semibold text-primary-dark">
                  Privacy Policy
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <AppButton
          title="Create Account"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500">Already have an account? </Text>
          <Pressable onPress={() => router.push("/login")}>
            <Text className="font-semibold text-primary-dark">Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
