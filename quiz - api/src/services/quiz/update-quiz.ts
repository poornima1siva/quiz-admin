import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../shared/database";

export async function updatequiz(id: string, updateData: Record<string, any>) {
    const db = await connectToDatabase();

    try {
        if (!ObjectId.isValid(id)) {
            return { success: false, message: "Invalid ID format." };
        }

        // Ensure _id is not modified
        if ('_id' in updateData) {
            delete updateData._id;
        }

        // Proceed with the update
        const result = await db.collection("quizes").updateOne(
            { _id: new ObjectId(id) }, 
            { $set: updateData } 
        );

        if (result.matchedCount > 0) {
            return { success: true, message: "quiz updated successfully." };
        } else {
            return { success: false, message: "quiz not found." };
        }
    } catch (error) {
        console.error('❌ Error updating quiz:', error);
        return { success: false, message: "An error occurred while updating the quiz.", error };
    }
}
