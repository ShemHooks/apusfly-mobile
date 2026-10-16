import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Plane,
  Search,
  X,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

type BookingFilter = "All" | "Upcoming" | "Completed" | "Cancelled";

type Booking = {
  id: string;
  reference: string;
  provider: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: BookingStatus;
  notes?: string;
};

const bookings: Booking[] = [
  {
    id: "1",
    reference: "APF-2026-001",
    provider: "SkyVista Aerial",
    service: "Aerial Photography",
    date: "October 18, 2026",
    time: "9:00 AM",
    location: "Bacolod City, Negros Occidental",
    price: 2500,
    status: "confirmed",
    notes: "Aerial photos for a residential property.",
  },
  {
    id: "2",
    reference: "APF-2026-002",
    provider: "AgriWing Drone Solutions",
    service: "Agricultural Survey",
    date: "October 22, 2026",
    time: "8:00 AM",
    location: "Kabankalan City, Negros Occidental",
    price: 3000,
    status: "pending",
    notes: "Survey of agricultural land.",
  },
  {
    id: "3",
    reference: "APF-2026-003",
    provider: "DroneFrame Studios",
    service: "Aerial Videography",
    date: "September 28, 2026",
    time: "2:00 PM",
    location: "Cebu City, Cebu",
    price: 3500,
    status: "completed",
  },
  {
    id: "4",
    reference: "APF-2026-004",
    provider: "AeroMap Technologies",
    service: "Mapping & Surveying",
    date: "September 20, 2026",
    time: "10:00 AM",
    location: "Iloilo City, Iloilo",
    price: 4500,
    status: "cancelled",
  },
];

const filters: BookingFilter[] = ["All", "Upcoming", "Completed", "Cancelled"];

const statusConfig: Record<
  BookingStatus,
  { label: string; background: string; color: string }
> = {
  pending: {
    label: "Pending",
    background: "#FFF4D6",
    color: "#946200",
  },
  confirmed: {
    label: "Confirmed",
    background: "#EAF6DF",
    color: "#559E1C",
  },
  in_progress: {
    label: "In Progress",
    background: "#E8F1FF",
    color: "#2463A6",
  },
  completed: {
    label: "Completed",
    background: "#E8F1FF",
    color: "#2463A6",
  },
  cancelled: {
    label: "Cancelled",
    background: "#FEE2E2",
    color: "#B91C1C",
  },
};

const formatPrice = (value: number) => `₱${value.toLocaleString("en-PH")}`;

function StatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status];

  return (
    <View
      style={{ backgroundColor: config.background }}
      className="rounded-full px-3 py-1.5"
    >
      <Text style={{ color: config.color }} className="text-xs font-semibold">
        {config.label}
      </Text>
    </View>
  );
}

function SummaryCard({ count, label }: { count: number; label: string }) {
  return (
    <View className="items-center flex-1 px-2 py-4 bg-white rounded-2xl">
      <Text className="text-2xl font-extrabold text-[#171717]">
        {count.toString().padStart(2, "0")}
      </Text>
      <Text className="mt-1 text-xs text-gray-500">{label}</Text>
    </View>
  );
}

export default function CustomerBookingsScreen() {
  const [activeFilter, setActiveFilter] = useState<BookingFilter>("All");

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const upcomingCount = bookings.filter((booking) =>
    ["pending", "confirmed", "in_progress"].includes(booking.status),
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (activeFilter === "Upcoming") {
        return ["pending", "confirmed", "in_progress"].includes(booking.status);
      }

      if (activeFilter === "Completed") {
        return booking.status === "completed";
      }

      if (activeFilter === "Cancelled") {
        return booking.status === "cancelled";
      }

      return true;
    });
  }, [activeFilter]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAF7]" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAF7" />

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 32,
        }}
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View className="pt-5 pb-6">
              <Text className="text-sm text-gray-500">
                Manage your drone services
              </Text>

              <Text className="mt-1 text-2xl font-extrabold text-[#171717]">
                My Bookings
              </Text>
            </View>

            {/* SUMMARY */}
            <View className="flex-row gap-3">
              <SummaryCard count={upcomingCount} label="Upcoming" />
              <SummaryCard count={completedCount} label="Completed" />
              <SummaryCard count={cancelledCount} label="Cancelled" />
            </View>

            {/* FILTERS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-7"
              contentContainerStyle={{
                gap: 8,
                paddingRight: 8,
              }}
            >
              {filters.map((filter) => {
                const active = activeFilter === filter;

                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
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
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="flex-row items-center justify-between mt-8 mb-4">
              <Text className="text-lg font-bold text-[#171717]">
                Booking History
              </Text>

              <Text className="text-xs text-gray-500">
                {filteredBookings.length} bookings
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="p-5 mb-4 bg-white border border-gray-100 rounded-3xl">
            {/* REFERENCE & STATUS */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold text-gray-400">
                {item.reference}
              </Text>

              <StatusBadge status={item.status} />
            </View>

            {/* SERVICE */}
            <View className="flex-row items-center gap-3 mt-5">
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF6DF]">
                <Plane size={25} color="#559E1C" />
              </View>

              <View className="flex-1">
                <Text className="text-base font-bold text-[#171717]">
                  {item.service}
                </Text>

                <Text className="mt-1 text-sm text-gray-500">
                  {item.provider}
                </Text>
              </View>
            </View>

            {/* DETAILS */}
            <View className="gap-3 pt-4 mt-5 border-t border-gray-100">
              <View className="flex-row items-center gap-2">
                <CalendarDays size={16} color="#6B7280" />

                <Text className="text-sm text-gray-600">
                  {item.date} at {item.time}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <MapPin size={16} color="#6B7280" />

                <Text className="flex-1 text-sm text-gray-600">
                  {item.location}
                </Text>
              </View>
            </View>

            {/* PRICE */}
            <View className="flex-row items-end justify-between mt-5">
              <View>
                <Text className="text-xs text-gray-400">Estimated total</Text>

                <Text className="mt-1 text-xl font-extrabold text-[#559E1C]">
                  {formatPrice(item.price)}
                </Text>
              </View>

              <Pressable
                onPress={() => setSelectedBooking(item)}
                className="flex-row items-center rounded-xl bg-[#F0F8E9] px-4 py-3"
              >
                <Text className="text-sm font-bold text-[#559E1C]">
                  View Details
                </Text>

                <ChevronRight size={17} color="#559E1C" />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center px-6 py-12 bg-white rounded-3xl">
            <Search size={30} color="#9CA3AF" />

            <Text className="mt-4 text-base font-bold text-[#171717]">
              No bookings found
            </Text>

            <Text className="mt-2 text-sm leading-6 text-center text-gray-500">
              There are no bookings in this category yet.
            </Text>
          </View>
        }
      />

      {/* BOOKING DETAILS MODAL */}
      <Modal
        visible={selectedBooking !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedBooking(null)}
      >
        <View className="justify-end flex-1 bg-black/40">
          <View className="max-h-[85%] rounded-t-3xl bg-white">
            <View className="flex-row items-center justify-between px-6 py-5 border-b border-gray-100">
              <Text className="text-xl font-bold text-[#171717]">
                Booking Details
              </Text>

              <Pressable
                onPress={() => setSelectedBooking(null)}
                accessibilityLabel="Close booking details"
                className="items-center justify-center w-10 h-10 bg-gray-100 rounded-full"
              >
                <X size={20} color="#171717" />
              </Pressable>
            </View>

            {selectedBooking && (
              <ScrollView
                className="px-6"
                contentContainerStyle={{
                  paddingTop: 24,
                  paddingBottom: 40,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-semibold text-gray-400">
                    {selectedBooking.reference}
                  </Text>

                  <StatusBadge status={selectedBooking.status} />
                </View>

                <Text className="mt-6 text-2xl font-extrabold text-[#171717]">
                  {selectedBooking.service}
                </Text>

                <Text className="mt-2 text-base text-gray-500">
                  {selectedBooking.provider}
                </Text>

                <View className="mt-7 gap-5 rounded-2xl bg-[#F8FAF7] p-5">
                  <View className="flex-row items-start gap-3">
                    <CalendarDays size={20} color="#559E1C" />

                    <View>
                      <Text className="text-xs text-gray-500">
                        Scheduled Date
                      </Text>

                      <Text className="mt-1 font-semibold text-[#171717]">
                        {selectedBooking.date}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-start gap-3">
                    <Clock3 size={20} color="#559E1C" />

                    <View>
                      <Text className="text-xs text-gray-500">
                        Scheduled Time
                      </Text>

                      <Text className="mt-1 font-semibold text-[#171717]">
                        {selectedBooking.time}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-start gap-3">
                    <MapPin size={20} color="#559E1C" />

                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">
                        Service Location
                      </Text>

                      <Text className="mt-1 font-semibold text-[#171717]">
                        {selectedBooking.location}
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedBooking.notes && (
                  <View className="mt-6">
                    <Text className="font-bold text-[#171717]">
                      Booking Notes
                    </Text>

                    <Text className="mt-2 text-sm leading-6 text-gray-600">
                      {selectedBooking.notes}
                    </Text>
                  </View>
                )}

                <View className="flex-row items-center justify-between pt-5 border-t border-gray-100 mt-7">
                  <Text className="font-semibold text-[#171717]">
                    Estimated Total
                  </Text>

                  <Text className="text-2xl font-extrabold text-[#559E1C]">
                    {formatPrice(selectedBooking.price)}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setSelectedBooking(null)}
                  className="mt-8 items-center rounded-xl bg-[#75C928] py-4"
                >
                  <Text className="font-bold text-[#171717]">Done</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
