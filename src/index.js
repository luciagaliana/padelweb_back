import app from './app.js'
import { PORT } from './config.js'

const cors = require('cors');

app.use(cors(corsOptions));


app.listen(PORT)