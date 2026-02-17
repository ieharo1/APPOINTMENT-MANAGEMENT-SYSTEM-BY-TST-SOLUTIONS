import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

const start = async () => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`API listening on ${env.port}`);
    });
  } catch (error) {
    console.error('Error starting server', error);
    process.exit(1);
  }
};

start();
