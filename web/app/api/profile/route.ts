import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/supabase-server";
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
  try {
    // Get authenticated user from session
    const supabase = createServerSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const email = user.email;

    // Use admin client to fetch profile (or use RLS with regular client)
    const adminSupabase = getSupabaseAdminClient();
    const { data, error } = await adminSupabase
      .from(TABLE)
      .select("*")
      .eq("email", email)
      .maybeSingle<TraderProfileRow>();

    if (error) {
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
    return NextResponse.json(
      { message: "Unexpected error fetching profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from session
    const supabase = createServerSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = subscriptionSchema.parse(body);

    // Ensure the email in the request matches the authenticated user's email
    if (parsed.email !== user.email) {
      return NextResponse.json(
        { message: "Email mismatch - cannot update another user's profile" },
        { status: 403 }
      );
    }

    const adminSupabase = getSupabaseAdminClient();
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

    const { data, error } = await adminSupabase
      .from(TABLE)
      .upsert(payload, { onConflict: "email" })
      .select()
      .single<TraderProfileRow>();

    if (error) {
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

    return NextResponse.json(
      { message: "Unexpected error saving profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user from session
    const supabase = createServerSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const email = user.email;

    const adminSupabase = getSupabaseAdminClient();
    const { error } = await adminSupabase
      .from(TABLE)
      .delete()
      .eq("email", email);

    if (error) {
      return NextResponse.json(
        { message: "Unable to delete profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Unexpected error deleting profile" },
      { status: 500 }
    );
  }
}
