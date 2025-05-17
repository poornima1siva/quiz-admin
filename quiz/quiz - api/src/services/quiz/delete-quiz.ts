import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../shared/database";

export async function deletequiz(id: string) {
    const db = await connectToDatabase();

    try {
        if (!ObjectId.isValid(id)) {  // Check if ID is valid
            return { success: false, message: "Invalid ID format." };
        }

        const result = await db.collection("quizes").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            return { success: true, message: "quiz deleted successfully." };
        } else {
            return { success: false, message: "quiz not found or already deleted." };
        }
    } catch (error) {
        return { success: false, message: "An error occurred while deleting the quiz.", error };
    }
}
