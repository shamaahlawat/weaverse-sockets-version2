import { Chat, User } from '../models';

export const messageSeenByUser = async (socket, io, msg) => {
    try {
        if (msg.isChannel) {

            let updatechannelmsg = await Chat.update(
                { _id: msg.message_id },
                { $push: { msgSeenBy: msg.seen_by } }
            )
            console.log("messageSeenBy updatechannelmsg", updatechannelmsg)
        }
        if (!msg.isChannel) {
            let updatePrivetmsg = await Chat.update(
                { _id: msg.message_id },
                { status: "seen" }
            )
            console.log("messageSeenBy updatePrivetmsg", updatePrivetmsg)
        }

    } catch (error) {
        console.log("messageSeenBy user", error)
    }
}