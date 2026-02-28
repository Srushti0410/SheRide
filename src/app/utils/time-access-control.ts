// Time-based access control for SheRide
export function isNightTime(): boolean {
  const currentHour = new Date().getHours();
  // Night is considered 9 PM (21:00) to 6 AM (06:00)
  return currentHour >= 21 || currentHour < 6;
}

export function isDayTime(): boolean {
  return !isNightTime();
}

export interface TimeAccessControl {
  canAccessRide: boolean;
  currentTimeType: "day" | "night";
  availableRideTypes: string[];
  message: string;
}

export function checkAccessByTimeAndGender(
  currentTime: "day" | "night",
  userGender: string
): TimeAccessControl {
  if (currentTime === "day") {
    return {
      canAccessRide: true,
      currentTimeType: "day",
      availableRideTypes: ["regular", "girls-only"],
      message: "You can book any ride type during the day",
    };
  } else {
    // Night time
    if (userGender === "female" || userGender === "girl" || userGender === "other") {
      return {
        canAccessRide: true,
        currentTimeType: "night",
        availableRideTypes: ["girls-only", "lgbtq-friendly"],
        message: "During night hours, only women and LGBTQ-friendly rides are available for safety",
      };
    } else {
      return {
        canAccessRide: false,
        currentTimeType: "night",
        availableRideTypes: [],
        message:
          "Night rides (9 PM - 6 AM) are only available for female passengers. Regular rides are available during day hours (6 AM - 9 PM).",
      };
    }
  }
}

export function getTimeRestrictionsInfo(): {
  dayHours: string;
  nightHours: string;
} {
  return {
    dayHours: "6:00 AM - 9:00 PM (Everyone)",
    nightHours: "9:00 PM - 6:00 AM (Girls Only)",
  };
}

export function formatCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
