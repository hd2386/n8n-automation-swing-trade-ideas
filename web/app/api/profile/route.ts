import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { subscriptionSchema } from "@/lib/validation";
import { DEFAULT_TRADER_PREFERENCES } from "@/lib/constants";
import type { Subscription } from "@/types";

const TABLE = "trader_profiles";

type TraderProfileRow = {
  id: string;
  email: string;
  selected_stocks: string[];
  preferences: Subscription["preferences"];
  created_at: string;
  updated_at: string;
};

const withPreferenceDefaults = (
  preferences?: Partial<Subscription["preferences"]>
): Subscription["preferences"] => ({
  ...DEFAULT_TRADER_PREFERENCES,
  ...(preferences || {}),
});

const mapRowToSubscription = (row: TraderProfileRow): Subscription => ({
  email: row.email,
  selectedStocks: row.selected_stocks ?? [],
  preferences: withPreferenceDefaults(row.preferences),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("email", email)
      .maybeSingle<TraderProfileRow>();

    if (error) {
      console.error("Supabase GET error:", error);
      return NextResponse.json(
        { message: "Unable to load profile" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(mapRowToSubscription(data));
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { message: "Unexpected error fetching profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = subscriptionSchema.parse(body);

    const supabase = getSupabaseAdminClient();
    const payload = {
      email: parsed.email,
      selected_stocks: parsed.selectedStocks,
      preferences: withPreferenceDefaults({
        riskProfile: parsed.riskProfile,
        capital: parsed.capital,
        riskPerTrade: parsed.riskPerTrade,
        timeHorizon: parsed.timeHorizon,
        earningsSensitivity: parsed.earningsSensitivity,
        betaTolerance: parsed.betaTolerance,
        exposureLimit: parsed.exposureLimit,
        customTicker: parsed.customTicker,
        entryPreference: parsed.entryPreference,
      }),
    };

    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: "email" })
      .select()
      .single<TraderProfileRow>();

    if (error) {
      console.error("Supabase POST error:", error);
      return NextResponse.json(
        { message: "Unable to save profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(mapRowToSubscription(data));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          issues: error.flatten(),
        },
        { status: 422 }
      );
    }

    console.error("Profile POST error:", error);
    return NextResponse.json(
      { message: "Unexpected error saving profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from(TABLE).delete().eq("email", email);

    if (error) {
      console.error("Supabase DELETE error:", error);
      return NextResponse.json(
        { message: "Unable to delete profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile DELETE error:", error);
    return NextResponse.json(
      { message: "Unexpected error deleting profile" },
      { status: 500 }
    );
  }
}
