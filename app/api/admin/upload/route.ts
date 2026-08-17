import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageTaxonomy } from "@/lib/admin/permissions";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File must be under 8MB" }, { status: 400 });
  }

  const blob = await put(`media/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  const media = await prisma.media.create({
    data: {
      url: blob.url,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedById: session.user.id,
    },
  });

  return NextResponse.json({ media });
}
