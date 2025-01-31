"use server";

import User from "@/modals/user.modal";
import {connect} from "@/db";

export async function createUser(user: any) {
    try {
        await connect();
        const newUser = await User.create(user);
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.log(error);
    }
}

export async function getUser(userId: string) {
    try {
        await connect();
        const newUser = await User.findOne({
            where: {
                clerkId: userId
            }
        });
        return JSON.parse(JSON.stringify(newUser));
    }catch (error) {
        console.log(error);
    }
}