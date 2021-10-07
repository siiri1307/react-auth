import { getDbConnection } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../util/sendEmail.js";

export const signUpRoute = {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;

        const db = getDbConnection("react-auth-db");
        const user = await db.collection("users").findOne({ email });
        if(user) {
            res.sendStatus(409); // conflict error code
        };

        const passwordHash = await bcrypt.hash(password, 10);

        // verification string sent to user
        const verificationString = uuid();

        const startingInfo = {
            hairColor: "",
            favoriteFood: "",
            bio: "",
        };

        const result = await db.collection("users").insertOne({
            email, 
            passwordHash, 
            info: startingInfo, 
            isVerified: false,
            verificationString,
        });

        const { insertedId } = result;

        try {
            await sendEmail({
                to: email,
                from: process.env.MAIL_FROM,
                subject: "Please verify your email",
                text: `
                    Thanks for signing up! To verify your email, please click here: http://localhost:3000/verify-email/${verificationString}`
                });
        }
        catch(err){
            console.log(err);
            res.sendStatus(500);
        }

        jwt.sign({
            id: insertedId,
            email,
            info: startingInfo,
            isVerified: false,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2d",
        },
        (err, token) => {
            if(err) {
                return res.status(500).send(err);
            }
            res.status(200).json({token})    
        });
    },
};