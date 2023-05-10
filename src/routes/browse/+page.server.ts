import db from "$lib/server/db";

export async function load({ locals }) {
    const learningSets = await db.learningSet.findMany({
        where: {
            visibility: "PUBLIC"
        },
        take: 50,
        include: {
            user: true
        }
    });
    
    return {
        learningSets 
    };
}