import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create user
    let userRecord = await prisma.user.findUnique({
      where: { userId: user.id },
    });

    if (!userRecord) {
      // Create user with default credits
      userRecord = await prisma.user.create({
        data: {
          userId: user.id,
          credits: 10.0,
          totalCreditsUsed: 0.0,
          name: `${user.given_name || ""} ${user.family_name || ""}`.trim() || null,
          email: user.email || null,
          profilePicture: user.picture || null,
        },
      });
    } else {
      // Update user record with latest Kinde data if not already set
      if (!userRecord.name || !userRecord.email || !userRecord.profilePicture) {
        userRecord = await prisma.user.update({
          where: { userId: user.id },
          data: {
            name: userRecord.name || `${user.given_name || ""} ${user.family_name || ""}`.trim() || null,
            email: userRecord.email || user.email || null,
            profilePicture: userRecord.profilePicture || user.picture || null,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userRecord.id,
        userId: userRecord.userId,
        name: userRecord.name || `${user.given_name || ""} ${user.family_name || ""}`.trim(),
        email: userRecord.email || user.email,
        profilePicture: userRecord.profilePicture || user.picture,
        headerImage: userRecord.headerImage,
        credits: userRecord.credits,
        totalCreditsUsed: userRecord.totalCreditsUsed || 0,
      },
    });
  } catch (error) {
    console.log("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, profilePicture, headerImage } = body;

    // Find or create user
    let userRecord = await prisma.user.findUnique({
      where: { userId: user.id },
    });

    if (!userRecord) {
      userRecord = await prisma.user.create({
        data: {
          userId: user.id,
          credits: 10.0,
          totalCreditsUsed: 0.0,
          name: name || `${user.given_name || ""} ${user.family_name || ""}`.trim() || null,
          email: email || user.email || null,
          profilePicture: profilePicture || user.picture || null,
          headerImage: headerImage || null,
        },
      });
    } else {
      // Update only provided fields
      const updateData: {
        name?: string;
        email?: string;
        profilePicture?: string;
        headerImage?: string;
      } = {};

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
      if (headerImage !== undefined) updateData.headerImage = headerImage;

      userRecord = await prisma.user.update({
        where: { userId: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userRecord.id,
        userId: userRecord.userId,
        name: userRecord.name || `${user.given_name || ""} ${user.family_name || ""}`.trim(),
        email: userRecord.email || user.email,
        profilePicture: userRecord.profilePicture || user.picture,
        headerImage: userRecord.headerImage,
        credits: userRecord.credits,
        totalCreditsUsed: userRecord.totalCreditsUsed || 0,
      },
    });
  } catch (error) {
    console.log("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
