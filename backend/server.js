import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import swaggerUi from "swagger-ui-express"
import swaggerSpecs from "./swagger/config.js"


//app config
const app = express();

const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors({
    origin: [
        'https://tastiolk.netlify.app',
        'http://localhost:5173',
        'http://localhost:3000',
        'https://tastiolk-admin.netlify.app',
        process.env.FRONTEND_URL
    ],
    credentials: true
}))

//db connection
connectDB();

// Swagger Documentation

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #3b82f6; }
  `,
  customSiteTitle: "Food Delivery API Documentation",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true
  }
}))


// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.get("/health",(req,res)=>{
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        cors: 'Enabled for multiple origins'
    });
})

app.listen(port,'0.0.0.0',()=>{
    console.log(`Server Started on http:/localhost:${port}`)
})


//mongodb+srv://tastio:tastio123@cluster0.tzso1ae.mongodb.net/?
