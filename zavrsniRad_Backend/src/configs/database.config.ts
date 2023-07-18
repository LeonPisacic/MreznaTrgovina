import { connect, ConnectOptions } from "mongoose";


export const dbConnect = () => { //ostvarivanje konekcije sa mongoDB baze koristeci connection url i opcije 
    connect('mongodb+srv://leonpisacic:Proba12345@cluster0.yq8fzze.mongodb.net/Baza?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("Connected to MongoDB"),
        (error) => console.log(error)
    )
}