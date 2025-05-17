import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../shared/database";

export async function updatequestion(id: string, updateData: Record<string, any>) {
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
        const result = await db.collection("questions").updateOne(
            { _id: new ObjectId(id) }, 
            { $set: updateData } 
        );

        if (result.matchedCount > 0) {
            return { success: true, message: "question updated successfully." };
        } else {
            return { success: false, message: "question not found." };
        }
    } catch (error) {
        console.error('❌ Error updating question:', error);
        return { success: false, message: "An error occurred while updating the question.", error };
    }
}
