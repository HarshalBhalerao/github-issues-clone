import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createIssueSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const newIssue = await prisma.issue.create({
      data: { title: body.title, description: body.description },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error(error);
  }
}

export async function GET(request: NextRequest) {
  let id: number = +(request.nextUrl.searchParams.get("id") as string);
  if (id) {
    try {
      const getIssues = await prisma.issue.findUnique({
        where: {
          id: id,
        },
      });
      return NextResponse.json(getIssues, { status: 200 });
    } catch (error) {
      console.error(error);
    }
  } else {
    const getIssues = await prisma.issue.findMany();
    return NextResponse.json(getIssues, { status: 200 });
  }
}

export async function PATCH(request: NextRequest) {
  let id: number = +(request.nextUrl.searchParams.get("id") as string);
  try {
    const body = await request.json();
    const validation = createIssueSchema.safeParse(body);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    const newIssue = await prisma.issue.update({
      where: {
        id: id,
      },
      data: { title: body.title, description: body.description },
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(request: NextRequest) {
  let id: number = +(request.nextUrl.searchParams.get("id") as string);
  try {
    const getIssues = await prisma.issue.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(getIssues, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
