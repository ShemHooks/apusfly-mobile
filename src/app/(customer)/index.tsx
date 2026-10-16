import { useRouter } from "expo-router";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Building2,
  CalendarClock,
  Camera,
  ChevronRight,
  House,
  Map,
  MapPin,
  Search,
  ShieldCheck,
  Sprout,
  Star,
  Video,
  Wallet,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#75C928";
const PRIMARY_DARK = "#559E1C";
const CHARCOAL = "#171717";

const services = [
  {
    id: "photography",
    title: "Photography",
    searchName: "Aerial Photography",
    icon: Camera,
  },
  {
    id: "videography",
    title: "Videography",
    searchName: "Aerial Videography",
    icon: Video,
  },
  {
    id: "agriculture",
    title: "Agriculture",
    searchName: "Agricultural Services",
    icon: Sprout,
  },
  {
    id: "mapping",
    title: "Mapping",
    searchName: "Mapping & Surveying",
    icon: Map,
  },
  {
    id: "inspection",
    title: "Inspection",
    searchName: "Infrastructure Inspection",
    icon: Building2,
  },
  {
    id: "real-estate",
    title: "Real Estate",
    searchName: "Real Estate",
    icon: House,
  },
];

// Development-only provider data.
// Replace with the Laravel provider API later.
const featuredProviders = [
  {
    id: "provider-1",
    name: "SkyVista Aerial",
    location: "Bacolod City",
    service: "Aerial Photography",
    rating: 4.9,
    reviews: 48,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
  },
  {
    id: "provider-2",
    name: "AgriWing Drone Solutions",
    location: "Kabankalan City",
    service: "Agricultural Services",
    rating: 4.8,
    reviews: 32,
    verified: true,
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
  {
    id: "provider-3",
    name: "AeroMap Technologies",
    location: "Iloilo City",
    service: "Mapping & Surveying",
    rating: 4.7,
    reviews: 21,
    verified: false,
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
  },
];

// Set to null to simulate a customer without bookings.
const activeBooking: {
  id: string;
  reference: string;
  provider: string;
  service: string;
  status: string;
  date: string;
} | null = {
  id: "booking-1",
  reference: "APF-2026-001",
  provider: "SkyVista Aerial",
  service: "Aerial Photography",
  status: "Pending Confirmation",
  date: "October 18, 2026",
};

export default function CustomerHomeScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const goToExplore = () => {
    router.push("/(customer)/explore");
  };

  const goToBookings = () => {
    router.push("/(customer)/bookings");
  };

  const goToMessages = () => {
    router.push("/(customer)/messages");
  };

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return services;

    return services.filter((service) =>
      `${service.title} ${service.searchName}`.toLowerCase().includes(query),
    );
  }, [search]);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return featuredProviders;

    return featuredProviders.filter((provider) =>
      [provider.name, provider.location, provider.service]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [search]);

  const hasSearchResults =
    filteredServices.length > 0 || filteredProviders.length > 0;

  const goToWallet = () => {
    router.push("./wallet");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF7" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 36,
        }}
      >
        {/* HEADER */}
        <View className="flex-row items-center justify-between px-6 pt-5 pb-6">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-500">
              Welcome to ApusFly
            </Text>

            <Text className="mt-1 text-2xl font-extrabold text-[#171717]">
              Where to next?
            </Text>
          </View>

          {/* HEADER ACTIONS */}
          <View className="flex-row items-center gap-3">
            {/* WALLET */}
            <Pressable
              onPress={goToWallet}
              accessibilityRole="button"
              accessibilityLabel="Open wallet"
              className="items-center justify-center w-12 h-12 bg-white rounded-2xl"
            >
              <Wallet size={23} color={CHARCOAL} />
            </Pressable>

            {/* NOTIFICATIONS */}
            <Pressable
              onPress={goToMessages}
              accessibilityRole="button"
              accessibilityLabel="Open notifications"
              className="items-center justify-center w-12 h-12 bg-white rounded-2xl"
            >
              <Bell size={23} color={CHARCOAL} />

              <View className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#75C928]" />
            </Pressable>
          </View>
        </View>

        {/* SEARCH */}
        <View className="px-6">
          <View className="flex-row items-center px-4 bg-white border border-gray-200 rounded-2xl">
            <Search size={21} color={PRIMARY_DARK} />

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search services or providers..."
              placeholderTextColor="#9CA3AF"
              returnKeyType="search"
              onSubmitEditing={goToExplore}
              className="h-14 flex-1 pl-3 text-base text-[#171717]"
            />

            {search.length > 0 && (
              <Pressable
                onPress={() => setSearch("")}
                accessibilityLabel="Clear search"
              >
                <X size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>

          {search.trim().length > 0 && (
            <Text className="mt-2 text-xs text-gray-500">
              Showing matching services and featured providers
            </Text>
          )}
        </View>

        {/* HERO BANNER */}
        {!search.trim() && (
          <View className="px-6 pt-7">
            <View className="overflow-hidden rounded-3xl bg-[#171717] p-6">
              <View
                className="absolute w-56 h-56 rounded-full -right-16 -top-16"
                style={{
                  backgroundColor: "rgba(117,201,40,0.12)",
                }}
              />

              <View
                className="absolute w-40 h-40 rounded-full -bottom-20 right-12"
                style={{
                  backgroundColor: "rgba(117,201,40,0.08)",
                }}
              />

              <View className="self-start rounded-full border border-[#75C928]/30 bg-[#75C928]/10 px-3 py-2">
                <Text className="text-xs font-bold tracking-wider text-[#75C928]">
                  YOUR VISION. OUR WINGS.
                </Text>
              </View>

              <Text className="mt-6 max-w-[260px] text-3xl font-extrabold leading-9 text-white">
                Your ideas, from a new perspective.
              </Text>

              <Text className="mt-4 max-w-[280px] text-sm leading-6 text-gray-300">
                Discover professional drone services for your next project.
              </Text>

              <Pressable
                onPress={goToExplore}
                className="mt-7 flex-row items-center self-start rounded-xl bg-[#75C928] px-5 py-3"
              >
                <Text className="font-bold text-[#171717]">
                  Explore Services
                </Text>

                <ArrowRight
                  size={18}
                  color={CHARCOAL}
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            </View>
          </View>
        )}

        {/* ACTIVE BOOKING */}
        {!search.trim() && activeBooking && (
          <View className="px-6 mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-extrabold text-[#171717]">
                Continue Your Booking
              </Text>

              <Pressable onPress={goToBookings}>
                <ChevronRight size={21} color={PRIMARY_DARK} />
              </Pressable>
            </View>

            <Pressable
              onPress={goToBookings}
              className="rounded-2xl border border-[#DDEECD] bg-white p-4"
            >
              <View className="flex-row items-start justify-between">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6DF]">
                  <CalendarClock size={24} color={PRIMARY_DARK} />
                </View>

                <View className="rounded-full bg-amber-50 px-3 py-1.5">
                  <Text className="text-xs font-semibold text-amber-700">
                    {activeBooking.status}
                  </Text>
                </View>
              </View>

              <Text className="mt-4 text-base font-bold text-[#171717]">
                {activeBooking.service}
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                {activeBooking.provider}
              </Text>

              <View className="flex-row items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <View>
                  <Text className="text-xs text-gray-400">Scheduled Date</Text>

                  <Text className="mt-1 text-sm font-semibold text-[#171717]">
                    {activeBooking.date}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-bold text-[#559E1C]">
                    View Booking
                  </Text>

                  <ArrowRight size={16} color={PRIMARY_DARK} />
                </View>
              </View>
            </Pressable>
          </View>
        )}

        {/* SERVICES SECTION */}
        <View className="px-6 mt-9">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-[#171717]">
                Our Services
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Find the right drone solution
              </Text>
            </View>

            <Pressable
              onPress={goToExplore}
              className="flex-row items-center gap-1"
            >
              <Text className="text-sm font-bold text-[#559E1C]">See all</Text>

              <ChevronRight size={17} color={PRIMARY_DARK} />
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {filteredServices.map((service) => {
              const Icon = service.icon;

              return (
                <Pressable
                  key={service.id}
                  onPress={goToExplore}
                  className="mb-3 w-[31.5%] items-center rounded-2xl border border-gray-100 bg-white px-2 py-5"
                >
                  <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6DF]">
                    <Icon size={23} color={PRIMARY_DARK} strokeWidth={1.8} />
                  </View>

                  <Text
                    numberOfLines={2}
                    className="text-center text-xs font-bold text-[#171717]"
                  >
                    {service.title}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* FEATURED PROVIDERS */}
        <View className="mt-7">
          <View className="flex-row items-center justify-between px-6 mb-5">
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-[#171717]">
                Featured Providers
              </Text>

              <Text className="mt-1 text-sm text-gray-500">
                Discover drone service professionals
              </Text>
            </View>

            <Pressable
              onPress={goToExplore}
              className="flex-row items-center gap-1"
            >
              <Text className="text-sm font-bold text-[#559E1C]">View all</Text>

              <ChevronRight size={17} color={PRIMARY_DARK} />
            </Pressable>
          </View>

          {filteredProviders.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 4,
                gap: 14,
              }}
            >
              {filteredProviders.map((provider) => (
                <Pressable
                  key={provider.id}
                  onPress={goToExplore}
                  className="w-64 overflow-hidden bg-white border border-gray-100 rounded-2xl"
                >
                  <View className="bg-gray-100 h-36">
                    <Image
                      source={{ uri: provider.image }}
                      resizeMode="cover"
                      className="w-full h-full"
                    />

                    {provider.verified && (
                      <View className="absolute left-3 top-3 flex-row items-center gap-1 rounded-full bg-white px-2.5 py-1.5">
                        <BadgeCheck size={14} color={PRIMARY_DARK} />

                        <Text className="text-xs font-bold text-[#559E1C]">
                          Verified
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="p-4">
                    <Text
                      numberOfLines={1}
                      className="text-base font-bold text-[#171717]"
                    >
                      {provider.name}
                    </Text>

                    <View className="flex-row items-center gap-1 mt-2">
                      <MapPin size={14} color="#6B7280" />

                      <Text className="text-xs text-gray-500">
                        {provider.location}
                      </Text>
                    </View>

                    <Text
                      numberOfLines={1}
                      className="mt-3 text-sm font-medium text-[#171717]"
                    >
                      {provider.service}
                    </Text>

                    <View className="flex-row items-center justify-between pt-3 mt-4 border-t border-gray-100">
                      <View className="flex-row items-center gap-1">
                        <Star size={15} color="#EAB308" fill="#EAB308" />

                        <Text className="text-sm font-bold text-[#171717]">
                          {provider.rating.toFixed(1)}
                        </Text>

                        <Text className="text-xs text-gray-400">
                          ({provider.reviews})
                        </Text>
                      </View>

                      <View className="flex-row items-center gap-1">
                        <Text className="text-xs font-bold text-[#559E1C]">
                          View Profile
                        </Text>

                        <ArrowRight size={14} color={PRIMARY_DARK} />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        {/* SEARCH EMPTY STATE */}
        {search.trim().length > 0 && !hasSearchResults && (
          <View className="items-center px-6 py-10 mx-6 mt-6 bg-white rounded-2xl">
            <Search size={30} color="#9CA3AF" />

            <Text className="mt-3 text-base font-bold text-[#171717]">
              No matches found
            </Text>

            <Text className="mt-2 text-sm text-center text-gray-500">
              Try another service, provider, or location.
            </Text>
          </View>
        )}

        {/* REQUEST A QUOTATION */}
        {!search.trim() && (
          <View className="px-6 mt-9 ">
            <View className="rounded-3xl border border-[#DDEECD]  p-5 overflow-hidden bg-[#171717] ">
              <Text className="text-xl font-extrabold text-[#f4f0f0]">
                Have a project in mind?
              </Text>

              <Text className="mt-3 text-sm leading-6 text-gray-300">
                Find a professional drone service provider and request a
                quotation for your project.
              </Text>

              <Pressable
                onPress={goToExplore}
                className="mt-5 flex-row items-center justify-center rounded-xl bg-[#75C928] px-5 py-3.5"
              >
                <Text className="font-bold text-[#171717]">
                  Find a Provider
                </Text>

                <ArrowRight
                  size={18}
                  color={CHARCOAL}
                  style={{ marginLeft: 8 }}
                />
              </Pressable>
            </View>
          </View>
        )}

        {/* HOW IT WORKS */}
        {!search.trim() && (
          <View className="px-6 mt-9">
            <Text className="text-xl font-extrabold text-[#171717]">
              How ApusFly Works
            </Text>

            <Text className="mt-1 text-sm text-gray-500">
              Book drone services in three simple steps
            </Text>

            <View className="p-5 mt-5 bg-white border border-gray-100 rounded-2xl">
              {[
                {
                  number: "01",
                  title: "Explore Providers",
                  description: "Browse drone professionals and their services.",
                },
                {
                  number: "02",
                  title: "Choose a Service",
                  description: "Compare service offerings for your project.",
                },
                {
                  number: "03",
                  title: "Request a Booking",
                  description:
                    "Submit your details and coordinate with the provider.",
                },
              ].map((step, index) => (
                <View
                  key={step.number}
                  className={`flex-row items-start gap-4 ${
                    index < 2 ? "mb-6" : ""
                  }`}
                >
                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#EAF6DF]">
                    <Text className="text-sm font-extrabold text-[#559E1C]">
                      {step.number}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#171717]">
                      {step.title}
                    </Text>

                    <Text className="mt-1 text-sm leading-5 text-gray-500">
                      {step.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TRUST SECTION */}
        {!search.trim() && (
          <View className="px-6 mt-8">
            <View className="flex-row items-start rounded-2xl border border-[#DDEECD] bg-[#F0F8E9] p-5">
              <View className="items-center justify-center w-12 h-12 mr-4 bg-white rounded-xl">
                <ShieldCheck size={25} color={PRIMARY_DARK} />
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-[#171717]">
                  Fly with confidence
                </Text>

                <Text className="mt-2 text-sm leading-6 text-gray-600">
                  Discover drone service providers, review their offerings, and
                  coordinate bookings through ApusFly.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* FOOTER */}
        <View className="items-center px-6 mt-10">
          <Text className="text-xs font-semibold tracking-widest text-gray-400">
            APUSFLY
          </Text>

          <Text className="mt-2 text-xs text-gray-400">
            Your Vision. Our Wings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
