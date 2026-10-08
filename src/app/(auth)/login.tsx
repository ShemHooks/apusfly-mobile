import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";

import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    // Laravel authentication API integration comes next.
    // Do not log passwords or other credentials.
    console.log("Login form validated:", data.email);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
          className="items-center justify-center mt-4 h-11 w-11 rounded-xl bg-surface"
        >
          <ArrowLeft size={22} color="#171717" />
        </Pressable>

        <View className="mt-12">
          <Text className="text-3xl font-bold text-charcoal">
            Welcome Back!
          </Text>

          <Text className="mt-3 text-base text-gray-500">
            Sign in to continue your journey with ApusFly.
          </Text>
        </View>

        <View className="mt-12">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Email Address"
                placeholder="Enter your email"
                keyboardType="email-address"
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
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="Enter your password"
                isPassword
                autoComplete="current-password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Pressable
            onPress={() => router.push("/forgot-password")}
            className="self-end mb-8"
          >
            <Text className="font-semibold text-primary-dark">
              Forgot Password?
            </Text>
          </Pressable>

          <AppButton
            title="Sign In"
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View className="flex-row justify-center pt-12 mt-auto">
          <Text className="text-gray-500">Don't have an account? </Text>

          <Pressable onPress={() => router.push("/role-selection")}>
            <Text className="font-semibold text-primary-dark">Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
