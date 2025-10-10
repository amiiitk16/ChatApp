import arcjet from "@arcjet/node";
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async(req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if(decision.isDenied()) {
            if(decision.reason?.israteLimit) {
                return res.status(429).json({message: "Rate limit exceeded"})    
            } else if (decision.reason?.isBot) {
                return res.status(403).json({message:"Bot access denied"})
            } else {
                return res.status(403).json({
                    message:" Access denied by security policy"
                })
            }
        }

        //check for spoof bots
        if (decision.results.some(isSpoofedBot)) 
            {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Forbidden" }));
                return;
            }

        next()


    } catch (error) {
        console.log("Arcjet protection failed", error)
    }
}