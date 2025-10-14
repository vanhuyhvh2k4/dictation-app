import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    // await sequelize.sync({ alter: true }); // dev only
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error('Unable to start', err);
    process.exit(1);
  }
})();