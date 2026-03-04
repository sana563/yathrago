import User from "@/models/User";
import { connectToDB } from "@/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("New user created:", savedUser);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (err) {
    console.log("Error creating user:", err.message);
    return NextResponse.json(
      { message: "Failed to create new user" },
      { status: 500 }
    );
  }
};
