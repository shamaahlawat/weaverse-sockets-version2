import mongoose from 'mongoose';
import CONFIG from '../config';

const {
    MONGODB_USERNAME: username,
    MONGODB_PASSWORD: password,
    MONGODB_HOST: host,
    MONGODB_PORT: port,
    MONGODB_DATABASE_NAME: databaseName,
    MLAB_USER: mlab_user,
    MLAB_PASSWORD: mlab_password
} = CONFIG;

mongoose.Promise = global.Promise;


const MONGODB_URI = `mongodb+srv://${mlab_user}:${mlab_password}@cluster0-b9rob.mongodb.net/weaverseV3?retryWrites=true`;

// const MONGODB_URI = 'mongodb://127.0.0.1:27017/weaverse'



console.log('MONGO CONNECTION', MONGODB_URI);
const options = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    useNewUrlParser: true,
};

mongoose.connect(MONGODB_URI, options);
mongoose.set('useCreateIndex', true);



mongoose.connection.on('connected', () => {
    // eslint-disable-next-line no-console
    console.info(`Connected to MongoDB`);
});
mongoose.connection.on('error', err => {
    // eslint-disable-next-line no-console
    console.error(`MongoDB connection error:`, err);
    process.exit(-1);
});

mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.error('MongoDB disconnected');
});

export default mongoose;