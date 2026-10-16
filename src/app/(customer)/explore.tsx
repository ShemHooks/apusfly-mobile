import {
  ArrowRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#75C928";
const DARK_GREEN = "#559E1C";

type Category =
  | "All"
  | "Photography"
  | "Videography"
  | "Agriculture"
  | "Mapping"
  | "Inspection";

type Provider = {
  id: string;
  name: string;
  location: string;
  categories: Category[];
  rating: number;
  reviews: number;
  startingPrice: number;
  image: string;
};

const categories: Category[] = [
  "All",
  "Photography",
  "Videography",
  "Agriculture",
  "Mapping",
  "Inspection",
];

// Development-only fictional listings
const providers: Provider[] = [
  {
    id: "1",
    name: "SkyVista Aerial",
    location: "Bacolod City, Negros Occidental",
    categories: ["Photography", "Videography"],
    rating: 4.9,
    reviews: 128,
    startingPrice: 2500,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900",
  },
  {
    id: "2",
    name: "AgriWing Drone Solutions",
    location: "Kabankalan City, Negros Occidental",
    categories: ["Agriculture", "Mapping"],
    rating: 4.8,
    reviews: 86,
    startingPrice: 3000,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900",
  },
  {
    id: "3",
    name: "AeroMap Technologies",
    location: "Iloilo City, Iloilo",
    categories: ["Mapping", "Inspection"],
    rating: 4.7,
    reviews: 54,
    startingPrice: 4500,
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?w=900",
  },
  {
    id: "4",
    name: "DroneFrame Studios",
    location: "Cebu City, Cebu",
    categories: ["Photography", "Videography"],
    rating: 4.9,
    reviews: 201,
    startingPrice: 3500,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900",
  },
];

const formatPrice = (price: number) => `₱${price.toLocaleString("en-PH")}`;

export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sortByRating, setSortByRating] = useState(false);

  const filteredProviders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = providers.filter((provider) => {
      const matchesSearch =
        provider.name.toLowerCase().includes(query) ||
        provider.location.toLowerCase().includes(query) ||
        provider.categories.some((item) => item.toLowerCase().includes(query));

      const matchesCategory =
        category === "All" || provider.categories.includes(category);

      return matchesSearch && matchesCategory;
    });

    if (sortByRating) {
      return [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sortByRating]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top"]}>
      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 32,
        }}
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View className="flex-row items-center justify-between pt-5 pb-6">
              <View>
                <Text className="text-sm text-gray-500">
                  Discover professionals
                </Text>

                <Text className="mt-1 text-2xl font-extrabold text-[#171717]">
                  Explore Providers
                </Text>
              </View>

              <Pressable
                onPress={() => setSortByRating((current) => !current)}
                accessibilityRole="button"
                accessibilityLabel="Toggle sorting by rating"
                className={`h-12 w-12 items-center justify-center rounded-2xl ${
                  sortByRating ? "bg-[#EAF6DF]" : "bg-white"
                }`}
              >
                <SlidersHorizontal
                  size={22}
                  color={sortByRating ? DARK_GREEN : "#171717"}
                />
              </Pressable>
            </View>

            {/* SEARCH */}
            <View className="flex-row items-center px-4 bg-white border border-gray-200 rounded-2xl">
              <Search size={20} color={DARK_GREEN} />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search providers or services..."
                placeholderTextColor="#9CA3AF"
                className="h-14 flex-1 pl-3 text-base text-[#171717]"
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <X size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            {/* CATEGORIES */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-5"
              contentContainerStyle={{
                gap: 8,
                paddingRight: 8,
              }}
            >
              {categories.map((item) => {
                const active = category === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    className={`rounded-full border px-4 py-3 ${
                      active
                        ? "border-[#75C928] bg-[#75C928]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        active ? "text-[#171717]" : "text-gray-600"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* RESULTS */}
            <View className="flex-row items-center justify-between mt-8 mb-4">
              <Text className="text-lg font-bold text-[#171717]">
                Available Providers
              </Text>

              <Text className="text-xs text-gray-500">
                {filteredProviders.length} found
              </Text>
            </View>

            {sortByRating && (
              <Text className="mb-4 text-xs font-medium text-[#559E1C]">
                Sorted by highest rating
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-5 overflow-hidden bg-white border border-gray-100 rounded-3xl">
            {/* PROVIDER IMAGE */}
            <Image
              source={{ uri: item.image }}
              className="w-full bg-gray-100 h-44"
              resizeMode="cover"
            />

            <View className="p-5">
              {/* NAME & RATING */}
              <View className="flex-row items-start justify-between gap-3">
                <Text className="flex-1 text-lg font-bold text-[#171717]">
                  {item.name}
                </Text>

                <View className="flex-row items-center gap-1">
                  <Star size={16} color="#F5A623" fill="#F5A623" />

                  <Text className="text-sm font-bold text-[#171717]">
                    {item.rating.toFixed(1)}
                  </Text>

                  <Text className="text-xs text-gray-400">
                    ({item.reviews})
                  </Text>
                </View>
              </View>

              {/* LOCATION */}
              <View className="flex-row items-center gap-1 mt-2">
                <MapPin size={15} color="#6B7280" />

                <Text className="flex-1 text-xs text-gray-500">
                  {item.location}
                </Text>
              </View>

              {/* SERVICES */}
              <View className="flex-row flex-wrap gap-2 mt-4">
                {item.categories.map((service) => (
                  <View
                    key={service}
                    className="rounded-lg bg-[#F0F8E9] px-3 py-2"
                  >
                    <Text className="text-xs font-semibold text-[#559E1C]">
                      {service}
                    </Text>
                  </View>
                ))}
              </View>

              {/* PRICE & BUTTON */}
              <View className="flex-row items-end justify-between mt-5">
                <View>
                  <Text className="text-xs text-gray-400">
                    Sample starting price
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#559E1C]">
                    {formatPrice(item.startingPrice)}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    // TODO: Navigate to provider details.
                  }}
                  className="flex-row items-center rounded-xl bg-[#75C928] px-4 py-3"
                >
                  <Text className="text-sm font-bold text-[#171717]">
                    View Profile
                  </Text>

                  <ArrowRight
                    size={16}
                    color="#171717"
                    style={{ marginLeft: 6 }}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center px-6 py-12 bg-white rounded-2xl">
            <Search size={30} color="#9CA3AF" />

            <Text className="mt-4 text-base font-bold text-[#171717]">
              No providers found
            </Text>

            <Text className="mt-2 text-sm leading-5 text-center text-gray-500">
              Try a different search or service category.
            </Text>

            <Pressable
              onPress={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 rounded-xl bg-[#75C928] px-5 py-3"
            >
              <Text className="font-semibold text-[#171717]">
                Clear Filters
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}
